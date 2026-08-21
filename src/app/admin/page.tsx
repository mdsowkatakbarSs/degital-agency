import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ContactsTable } from "@/components/contacts-table";
import { StatsCards } from "@/components/stats-cards";
import { Button } from "@/components/ui/button";
import { logout } from "./logout-action";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contacts:", error);
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your leads and inquiries</p>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline" className="rounded-full gap-2">
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </form>
        </div>

        <StatsCards contacts={contacts || []} />

        <div className="mt-8">
          <ContactsTable contacts={contacts || []} />
        </div>
      </div>
    </div>
  );
}
