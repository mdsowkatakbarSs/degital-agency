"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string | null;
  platform: string | null;
  message: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  contacted: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  qualified: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  converted: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  archived: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
};

export function ContactsTable({ contacts: initialContacts }: { contacts: Contact[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const supabase = createClient();

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("contacts")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      toast.success("Status updated");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/50 bg-background overflow-hidden"
    >
      <div className="p-6 border-b border-border/50">
        <h2 className="text-lg font-semibold">Recent Leads</h2>
        <p className="text-sm text-muted-foreground">Manage and track your inquiries</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No leads yet. They will appear here when someone contacts you.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.company || "—"}</TableCell>
                  <TableCell className="capitalize">{contact.platform || "—"}</TableCell>
                  <TableCell>
                    <Select value={contact.status} onValueChange={(value) => updateStatus(contact.id, value)}>
                      <SelectTrigger className={`w-32 h-8 border-0 ${statusColors[contact.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(contact.created_at), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
