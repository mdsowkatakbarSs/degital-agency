import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  platform: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    const supabase = await createClient();
    const { error } = await supabase.from("contacts").insert(validated);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save contact" },
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
