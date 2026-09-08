import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Megaphone, Package, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OrdersTable } from "@/components/orders-table";
import { StatsCards } from "@/components/stats-cards";
import { Button } from "@/components/ui/button";
import { logout } from "./logout-action";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id, name, email, service, quantity, payment_method, note, status, screenshot_name, created_at, gig_id, package_tier, package_price"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage incoming service orders</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button asChild variant="outline" className="rounded-full gap-2">
              <Link href="/admin/gigs">
                <Package className="w-4 h-4" />
                Gigs
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full gap-2">
              <Link href="/admin/announcements">
                <Megaphone className="w-4 h-4" />
                Posts & Offers
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full gap-2">
              <Link href="/admin/settings">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </Button>
            <form action={logout}>
              <Button type="submit" variant="outline" className="rounded-full gap-2">
                <LogOut className="w-4 h-4" />
                Log out
              </Button>
            </form>
          </div>
        </div>

        <StatsCards orders={orders || []} />

        <div className="mt-8">
          <OrdersTable orders={orders || []} />
        </div>
  </div>
    </div>
  );
}
