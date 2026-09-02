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
  paymentMethod: z.enum(["PayPal", "Other"]),
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
  packageTier: z.enum(["basic", "standard", "premium"]).optional(),
  packagePrice: z.number().positive().optional(),
});

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
