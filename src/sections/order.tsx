"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { PaymentPartners, PaymentWorkflowLine } from "@/components/payment-methods";
import type { SiteSettings } from "@/lib/announcement-types";
import { DEFAULT_SETTINGS } from "@/lib/announcement-types";

export function OrderSection({ settings }: { settings?: SiteSettings }) {
  const s = settings || DEFAULT_SETTINGS;

  return (
    <SectionWrapper id="order">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            {s.order_title || "Place Your Order"}
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            {s.order_subtitle || "Pick a package, complete the payment, upload your screenshot — we handle the rest."}
          </p>
          <div className="mt-3 flex justify-center">
            <PaymentWorkflowLine />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="p-8 rounded-2xl bg-background border border-border/50 space-y-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {s.order_description || "Payment details (Zelle email & CashApp QR) are shown at checkout, right after you confirm your purchase — so everything you need is in one place."}
            </p>

            <Button asChild size="lg" className="rounded-full h-12 px-8">
              <Link href="/#services">
                Browse Packages & Order
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>

            <PaymentPartners />
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
