"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Mail, Phone, MapPin, Loader2, CheckCircle } from "lucide-react";
import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  platform: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setIsSuccess(true);
      toast.success("Message sent successfully! We will contact you within 24 hours.");
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact" className="bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Ready to Scale?
          </motion.h2>
          <p className="text-lg text-muted-foreground">Book a free strategy call. No commitment required.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Let us talk growth</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every great partnership starts with a conversation. Tell us about your goals, and we will craft a custom strategy to get you there.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">{SITE_CONFIG.contact.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">{SITE_CONFIG.contact.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Office</div>
                  <div className="text-sm text-muted-foreground">{SITE_CONFIG.contact.address}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-2xl bg-background border border-border/50 space-y-6">
              {isSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We will be in touch within 24 hours.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" placeholder="John Doe" {...register("name")} className="rounded-xl" />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="john@company.com" {...register("email")} className="rounded-xl" />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Your Company" {...register("company")} className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Primary Platform</Label>
                    <select id="platform" {...register("platform")} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="">Select a platform</option>
                      <option value="facebook">Facebook</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="multiple">Multiple</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" placeholder="Tell us about your goals..." rows={4} {...register("message")} className="rounded-xl resize-none" />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" className="w-full rounded-full h-12" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" />Send Message</>
                    )}
                  </Button>
                </>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
