"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING } from "@/lib/constants";

export function PricingSection() {
  return (
    <SectionWrapper id="pricing" className="bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </motion.h2>
          <p className="text-lg text-muted-foreground">No hidden fees. No long-term contracts. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-background border-primary/50 shadow-xl shadow-primary/10 scale-105 md:scale-110"
                  : "bg-background border-border/50 hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground">
                  <Sparkles className="w-3 h-3 mr-1" />Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">${plan.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full rounded-full" variant={plan.popular ? "default" : "outline"} size="lg">
                <Link href="#contact">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
