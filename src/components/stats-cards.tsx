"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Bell, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderLite {
  id: string;
  status: string;
  created_at: string;
}

export function StatsCards({ orders }: { orders: OrderLite[] }) {
  const total = orders.length;
  const newOrders = orders.filter((o) => o.status === "new").length;
  const processing = orders.filter((o) => o.status === "processing").length;
  const completed = orders.filter((o) => o.status === "completed").length;

  const stats = [
    { label: "Total Orders", value: total, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "New", value: newOrders, icon: Bell, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Processing", value: processing, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
