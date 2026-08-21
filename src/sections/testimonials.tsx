"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SectionWrapper } from "@/components/section-wrapper";
import { TESTIMONIALS } from "@/lib/constants";

export function TestimonialsSection() {
  return (
    <SectionWrapper id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Client Results
          </motion.h2>
          <p className="text-lg text-muted-foreground">Real brands. Real growth. Real revenue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/20 transition-all"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <p className="text-foreground leading-relaxed mb-6 relative z-10">{testimonial.content}</p>
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/5 text-primary">{testimonial.platform}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
