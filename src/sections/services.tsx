"use client";

import { motion } from "framer-motion";
import { Target, Palette, Users, BarChart3, MessageCircle, Lightbulb } from "lucide-react";
import { SectionWrapper } from "@/components/section-wrapper";
import { SERVICES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Target, Palette, Users, BarChart3, MessageCircle, Lightbulb,
};

export function ServicesSection() {
  return (
    <SectionWrapper id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Growth Engine
          </motion.h2>
          <p className="text-lg text-muted-foreground">Full-funnel social media services designed to attract, engage, and convert.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.icon] || Target;
            return (
              <motion.div
                key={service.title}
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
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium">{service.stats}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
