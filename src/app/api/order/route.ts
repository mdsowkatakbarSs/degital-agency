import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { ALL_SERVICES, MAX_SCREENSHOT_MB } from "@/lib/constants";

const MAX_SCREENSHOT_CHARS = MAX_SCREENSHOT_MB * 1024 * 1024 * 1.4; // base64 overhead

const orderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  service: z.string().min(1),
  quantity: z.number().int().positive(),
  paymentMethod: z.enum(["Zelle", "CashApp", "PayPal", "Other"]),
  note: z.string().max(2000).optional(),
  screenshotName: z.string().max(255).optional(),
  screenshotData: z
    .string()
    .max(MAX_SCREENSHOT_CHARS)
    .refine(
      (val) => !val || val.startsWith("data:image/"),
      "Screenshot must be an image"
    )
    .optional(),
  // New gig-specific fields (optional for backward compatibility)
  gigId: z.string().uuid().optional(),
  packageTier: z.string().min(1).max(100).optional(),
  packagePrice: z.number().positive().optional(),
});

const ADMIN_EMAIL = "ytgrowthgear2026@gmail.com";

/**
 * Sends an instant order-notification email to the admin inbox via Resend.
 * No-op when RESEND_API_KEY is not configured. Failures are logged but never
 * surface to the customer — the order itself is already saved.
 */
async function sendAdminNotificationEmail(order: z.infer<typeof orderSchema>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — order notification email skipped");
    return;
  }
  try {
    const rows: [string, string][] = [
      ["Service", order.service],
      ["Package tier", order.packageTier ?? "—"],
      ["Package price", order.packagePrice ? `$${order.packagePrice}` : "—"],
      ["Quantity", String(order.quantity)],
      ["Payment method", order.paymentMethod],
      ["Payment proof", order.screenshotData ? "Screenshot attached to order" : "None provided"],
      ["Note", order.note || "—"],
      ["Customer", `${order.name} (${order.email})`],
    ];
    const html = `
      <div style="font-family:sans-serif;max-width:560px">
        <h2 style="margin:0 0 4px">New order received</h2>
        <p style="color:#666;margin:0 0 16px">ytgrowthgear.shop — order notification</p>
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding:6px 0;color:#666;width:130px">${k}</td><td style="padding:6px 0;font-weight:600">${v}</td></tr>`
            )
            .join("")}
        </table>
        <p style="color:#999;font-size:12px;margin-top:16px">Open the admin dashboard to view the payment screenshot and update the order status.</p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ytgrowthgear <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `🛒 New order: ${order.service} — ${order.name}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", await res.text());
    }
  } catch (err) {
    console.error("Failed to send order notification email:", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = orderSchema.parse(body);

    const supabase = await createClient();
    const { error } = await supabase.from("orders").insert({
      name: validated.name,
      email: validated.email,
      service: validated.service,
      quantity: validated.quantity,
      payment_method: validated.paymentMethod,
      note: validated.note ?? null,
      screenshot_name: validated.screenshotName ?? null,
      screenshot_data: validated.screenshotData ?? null,
      // Gig-specific fields
      gig_id: validated.gigId ?? null,
      package_tier: validated.packageTier ?? null,
      package_price: validated.packagePrice ?? null,
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          error:
            error.message === "Could not find the table" || error.code === "PGRST205"
              ? "Database not set up yet. Run the migration SQL in the Supabase SQL Editor (see README)."
              : "Failed to save order",
        },
        { status: 500 }
      );
    }

    // Fire-and-forget admin notification email (never blocks/fails the order)
    void sendAdminNotificationEmail(validated);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
