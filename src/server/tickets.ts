import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createHash } from "crypto";

const TicketSchema = z.object({
  event_id: z.string().uuid().optional().nullable(),
  event_name: z.string().min(1).max(200),
  event_date: z.string().optional().nullable(),
  ticket_price: z.number().min(0).max(100000),
  ticket_count: z.number().int().min(1).max(20),
  customer_name: z.string().trim().min(1).max(120),
  customer_email: z.string().trim().email().max(255),
  customer_phone: z.string().trim().max(40).optional().nullable(),
});

export type TicketInput = z.infer<typeof TicketSchema>;

function makeBookingRef() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TK-${yy}${mm}${dd}-${rand}`;
}

function buildPayFastParams(params: Record<string, string>): string {
  return Object.entries(params)
    .filter(([, v]) => v !== "" && v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
    .join("&");
}

function generatePayFastSignature(params: Record<string, string>, passphrase?: string): string {
  const pfString = buildPayFastParams(params) + (passphrase ? `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}` : "");
  return createHash("md5").update(pfString).digest("hex");
}

export const createTicketBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TicketSchema.parse(data))
  .handler(async ({ data }) => {
    const total = data.ticket_price * data.ticket_count;
    const booking_ref = makeBookingRef();

    const { data: row, error } = await supabaseAdmin
      .from("ticket_bookings")
      .insert({
        event_id: data.event_id || null,
        event_name: data.event_name,
        event_date: data.event_date || null,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone || null,
        ticket_count: data.ticket_count,
        ticket_price_each: data.ticket_price,
        total,
        booking_ref,
        status: "pending",
        payment_status: "unpaid",
      })
      .select("id, booking_ref, total")
      .single();

    if (error) {
      console.error("createTicketBooking error:", error);
      throw new Error("Could not create ticket booking. Please try again.");
    }

    // Build PayFast payment data (replace env vars with real credentials)
    const merchantId = process.env.PAYFAST_MERCHANT_ID ?? "10000100";
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY ?? "46f0cd694581a";
    const passphrase = process.env.PAYFAST_PASSPHRASE ?? "";
    const isSandbox = process.env.PAYFAST_SANDBOX !== "false";

    const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

    const pfParams: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/account#tickets`,
      cancel_url: `${baseUrl}/#events`,
      notify_url: `${baseUrl}/api/payfast/notify`,
      name_first: data.customer_name.split(" ")[0],
      name_last: data.customer_name.split(" ").slice(1).join(" ") || "",
      email_address: data.customer_email,
      m_payment_id: booking_ref,
      amount: total.toFixed(2),
      item_name: `${data.ticket_count}x ticket(s) — ${data.event_name}`,
      item_description: `Booking ref: ${booking_ref}`,
    };

    const signature = generatePayFastSignature(pfParams, passphrase || undefined);
    pfParams.signature = signature;

    const payFastUrl = isSandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

    return {
      success: true as const,
      booking_ref: row.booking_ref,
      total: row.total,
      payfast_url: payFastUrl,
      payfast_params: pfParams,
    };
  });
