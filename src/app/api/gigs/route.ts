import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");

    const supabase = await createClient();

    let query = supabase
      .from("gigs")
      .select("*, gig_packages(*)")
      .eq("is_active", true)
      .order("sort_order");

    if (platform && platform !== "all") {
      query = query.eq("platform", platform);
    }

    const { data, error } = await query;

    if (error) {
      // If gigs table doesn't exist yet, return empty with a flag
      if (
        error.message === "Could not find the table" ||
        error.code === "PGRST205"
      ) {
        return NextResponse.json(
          {
            gigs: [],
            message:
              "Gigs table not set up yet. Run the migration SQL in the Supabase SQL Editor.",
          },
          { status: 200 }
        );
      }
      console.error("Error fetching gigs:", error);
      return NextResponse.json(
        { gigs: [], error: "Failed to fetch gigs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ gigs: data || [] }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { gigs: [], error: "Internal server error" },
      { status: 500 }
    );
  }
}
