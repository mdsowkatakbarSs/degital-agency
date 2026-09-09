"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { PaymentPartners, PaymentWorkflowLine } from "@/components/payment-methods";

export function OrderSection() {
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
            Place Your Order
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Pick a package, complete the payment, upload your screenshot — we
            handle the rest.
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
              Payment details (Zelle email &amp; CashApp QR) are shown at
              checkout, right after you confirm your purchase — so everything
              you need is in one place.
            </p>

            <Button asChild size="lg" className="rounded-full h-12 px-8">
              <Link href="/#services">
                Browse Packages &amp; Order
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
