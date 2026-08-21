"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  BadgeDollarSign,
  Zap,
  ShieldCheck,
  Wallet,
  Headset,
} from "lucide-react";
import { SectionWrapper } from "@/components/section-wrapper";
import { WHY_US } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  BadgeDollarSign,
  Zap,
  ShieldCheck,
  Wallet,
  Headset,
};

export function WhyUsSection() {
  return (
    <SectionWrapper id="why-us" className="bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Why Choose Us
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Trusted service, safe methods and support you can rely on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
