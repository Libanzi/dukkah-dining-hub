import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ItemSchema = z.object({
  id: z.string().min(1).max(120),
  name: z.string().min(1).max(160),
  price: z.number().min(0).max(100000),
  qty: z.number().int().min(1).max(50),
  category: z.string().max(60).optional().default(""),
});

const CheckoutSchema = z.object({
  customer_name: z.string().trim().min(1).max(120),
  customer_email: z.string().trim().email().max(255),
  customer_phone: z.string().trim().max(40).optional().nullable(),
  order_type: z.enum(["delivery", "collection"]),
  delivery_address: z.string().trim().max(400).optional().nullable(),
  special_instructions: z.string().trim().max(500).optional().nullable(),
  items: z.array(ItemSchema).min(1).max(40),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

function makeOrderNumber() {
  // DK-YYMMDD-XXXX
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DK-${yy}${mm}${dd}-${rand}`;
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => CheckoutSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.order_type === "delivery" && !data.delivery_address) {
      throw new Error("Delivery address is required for delivery orders.");
    }

    const subtotal = data.items.reduce((s, i) => s + i.price * i.qty, 0);
    const deliveryFee = data.order_type === "delivery" ? (subtotal >= 400 ? 0 : 45) : 0;
    const total = subtotal + deliveryFee;

    const order_number = makeOrderNumber();

    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone || null,
        order_type: data.order_type,
        delivery_address: data.delivery_address || null,
        special_instructions: data.special_instructions || null,
        items: data.items,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: "received",
        payment_status: "pending",
      })
      .select("id, order_number, total, delivery_fee")
      .single();

    if (error) {
      console.error("placeOrder error:", error);
      throw new Error("Could not place your order. Please try again.");
    }

    return {
      success: true as const,
      order_number: row.order_number,
      total: row.total,
      delivery_fee: row.delivery_fee,
      eta: data.order_type === "delivery" ? "45–60 min" : "30–45 min",
    };
  });
