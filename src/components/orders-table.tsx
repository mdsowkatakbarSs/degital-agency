"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Eye, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { ORDER_STATUSES } from "@/lib/constants";

export interface OrderRow {
  id: string;
  name: string;
  email: string;
  service: string;
  quantity: number;
  payment_method: string;
  note: string | null;
  status: string;
  screenshot_name: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  completed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  cancelled: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
};

export function OrdersTable({ orders: initialOrders }: { orders: OrderRow[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [viewingOrder, setViewingOrder] = useState<OrderRow | null>(null);
  const [screenshotSrc, setScreenshotSrc] = useState<string | null>(null);
  const [loadingScreenshot, setLoadingScreenshot] = useState(false);
  const supabase = createClient();

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success("Status updated");
    }
  };

  const openScreenshot = async (order: OrderRow) => {
    setViewingOrder(order);
    setScreenshotSrc(null);
    setLoadingScreenshot(true);
    const { data, error } = await supabase
      .from("orders")
      .select("screenshot_data")
      .eq("id", order.id)
      .single();

    if (error || !data?.screenshot_data) {
      toast.error("Could not load screenshot");
      setViewingOrder(null);
    } else {
      setScreenshotSrc(data.screenshot_data as string);
    }
    setLoadingScreenshot(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/50 bg-background overflow-hidden"
      >
        <div className="p-6 border-b border-border/50">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <p className="text-sm text-muted-foreground">Manage and track incoming orders</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Qnty</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Screenshot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders yet. They will appear here when customers place them.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.name}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </TableCell>
                    <TableCell className="max-w-52 truncate" title={order.service}>
                      {order.service}
                    </TableCell>
                    <TableCell>{order.quantity.toLocaleString()}</TableCell>
                    <TableCell>{order.payment_method}</TableCell>
                    <TableCell>
                      {order.screenshot_name ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-full gap-1.5"
                          onClick={() => openScreenshot(order)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={(value) => updateStatus(order.id, value)}>
                        <SelectTrigger className={`w-32 h-8 border-0 ${statusColors[order.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((status) => (
                            <SelectItem key={status} value={status} className="capitalize">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-left">
              Payment screenshot — {viewingOrder?.name}
            </DialogTitle>
          </DialogHeader>
          {loadingScreenshot ? (
            <Skeleton className="w-full h-72 rounded-xl" />
          ) : screenshotSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={screenshotSrc}
              alt={`Payment screenshot from ${viewingOrder?.name}`}
              className="w-full rounded-xl border border-border max-h-[70vh] object-contain bg-muted/30"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
              <ImageIcon className="w-8 h-8" />
              <span className="text-sm">No screenshot available</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
