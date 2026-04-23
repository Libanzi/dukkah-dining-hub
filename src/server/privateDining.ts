import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createHash } from "crypto";

const PrivateDiningSchema = z.object({
  room_name: z.string(),
  room_capacity: z.number(),
  base_price_per_person: z.number(),
  event_date: z.string(),
  guest_count: z.number().min(1),
  customer_name: z.string(),
  customer_email: z.string().email(),
  customer_phone: z.string().optional(),
  event_type: z.string().optional(),
  special_requests: z.string().optional(),
  payment_type: z.enum(["deposit", "full"]),
});

export type PrivateDiningInput = z.infer<typeof PrivateDiningSchema>;

function makeBookingRef() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 0x10000)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
  return `PD-${yy}${mm}${dd}-${rand}`;
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

export const createPrivateDiningBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PrivateDiningSchema.parse(data))
  .handler(async ({ data }) => {
    const daysAhead = Math.ceil(
      (new Date(data.event_date).getTime() - Date.now()) / 86400000
    );

    let pricing_modifier: number;
    if (daysAhead < 1) {
      pricing_modifier = 1.5;
    } else if (daysAhead < 3) {
      pricing_modifier = 1.2;
    } else if (daysAhead < 7) {
      pricing_modifier = 1.0;
    } else {
      pricing_modifier = 0.9;
    }

    const total_amount = Math.round(
      data.base_price_per_person * data.guest_count * pricing_modifier * 100
    ) / 100;

    const deposit_amount =
      data.payment_type === "full"
        ? total_amount
        : Math.round(total_amount * 0.5 * 100) / 100;

    const booking_ref = makeBookingRef();

    const { data: row, error } = await supabaseAdmin
      .from("private_dining_bookings")
      .insert({
        booking_ref,
        room_name: data.room_name,
        room_capacity: data.room_capacity,
        base_price_per_person: data.base_price_per_person,
        event_date: data.event_date,
        guest_count: data.guest_count,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone || null,
        event_type: data.event_type || null,
        special_requests: data.special_requests || null,
        pricing_modifier,
        total_amount,
        deposit_amount,
        payment_type: data.payment_type,
        status: "pending",
      })
      .select("id, booking_ref, total_amount, deposit_amount, pricing_modifier, payment_type")
      .single();

    if (error) {
      console.error("createPrivateDiningBooking error:", error);
      throw new Error("Could not create private dining booking. Please try again.");
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID ?? "10000100";
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY ?? "46f0cd694581a";
    const passphrase = process.env.PAYFAST_PASSPHRASE ?? "";
    const isSandbox = process.env.PAYFAST_SANDBOX !== "false";

    const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

    const pfParams: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/account#private-dining`,
      cancel_url: `${baseUrl}/#private-dining`,
      notify_url: `${baseUrl}/api/payfast/notify`,
      name_first: data.customer_name.split(" ")[0],
      name_last: data.customer_name.split(" ").slice(1).join(" ") || "",
      email_address: data.customer_email,
      m_payment_id: booking_ref,
      amount: deposit_amount.toFixed(2),
      item_name: `Private Dining: ${data.room_name} - ${booking_ref}`,
      item_description: `Booking ref: ${booking_ref}`,
    };

    const signature = generatePayFastSignature(pfParams, passphrase || undefined);
    pfParams.signature = signature;

    const payfast_url = isSandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

    return {
      booking_ref: row.booking_ref,
      total_amount: row.total_amount,
      deposit_amount: row.deposit_amount,
      payment_type: row.payment_type,
      pricing_modifier: row.pricing_modifier,
      payfast_url,
      payfast_params: pfParams,
    };
  });
