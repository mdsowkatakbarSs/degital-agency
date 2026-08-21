"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Send,
  Loader2,
  CheckCircle,
  Upload,
  ImageIcon,
  X,
} from "lucide-react";
import { SectionWrapper } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  SERVICE_GROUPS,
  PAYMENT_METHODS,
  MAX_SCREENSHOT_MB,
} from "@/lib/constants";

const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  service: z.string().min(1, "Please select a service"),
  quantity: z
    .number({ message: "Please enter a quantity" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  note: z.string().optional(),
});

type OrderForm = z.infer<typeof orderSchema>;

const selectClasses =
  "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function OrderSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setScreenshot(null);
      setPreviewUrl(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Screenshot must be an image file.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SCREENSHOT_MB * 1024 * 1024) {
      toast.error(`Screenshot must be smaller than ${MAX_SCREENSHOT_MB}MB.`);
      e.target.value = "";
      return;
    }
    setScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearScreenshot = () => {
    setScreenshot(null);
    setPreviewUrl(null);
    const input = document.getElementById("screenshot") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const onSubmit = async (data: OrderForm) => {
    if (!screenshot) {
      toast.error("Please attach the payment screenshot.");
      return;
    }

    setIsSubmitting(true);
    try {
      const screenshotData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read screenshot"));
        reader.readAsDataURL(screenshot);
      });

      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          service: data.service,
          quantity: data.quantity,
          paymentMethod: data.paymentMethod,
          note: data.note,
          screenshotName: screenshot.name,
          screenshotData,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setIsSuccess(true);
      toast.success("Order submitted! We will confirm it shortly.");
      reset();
      clearScreenshot();
      setTimeout(() => setIsSuccess(false), 6000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="order">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Place Your Order
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Select your service, send payment and upload the receipt — we handle the rest.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-2xl bg-background border border-border/50 space-y-6">
            {isSuccess ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Order Submitted!</h3>
                <p className="text-muted-foreground">
                  We received your order and will confirm it shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" placeholder="Your name" {...register("name")} className="rounded-xl" />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className="rounded-xl" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Select Service *</Label>
                  <select id="service" defaultValue="" {...register("service")} className={selectClasses}>
                    <option value="" disabled>
                      Choose a service
                    </option>
                    {SERVICE_GROUPS.map((group) => (
                      <optgroup key={group.platform} label={group.platform}>
                        {group.items.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.service && <p className="text-xs text-destructive">{errors.service.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Qnty *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      step={1}
                      placeholder="e.g. 1000"
                      {...register("quantity", { valueAsNumber: true })}
                      className="rounded-xl"
                    />
                    {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Pay By *</Label>
                    <select id="paymentMethod" defaultValue="" {...register("paymentMethod")} className={selectClasses}>
                      <option value="" disabled>
                        Select payment method
                      </option>
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method} value={method}>
                          {method === "PayPal" ? "PayPal" : "Other"}
                        </option>
                      ))}
                    </select>
                    {errors.paymentMethod && (
                      <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Screen Shot * (payment proof)</Label>
                  {screenshot ? (
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt="Payment screenshot preview"
                          className="w-14 h-14 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{screenshot.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(screenshot.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearScreenshot}
                        aria-label="Remove screenshot"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="screenshot"
                      className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload payment screenshot
                      </span>
                      <span className="text-xs text-muted-foreground/70">
                        PNG, JPG or WebP — max {MAX_SCREENSHOT_MB}MB
                      </span>
                    </label>
                  )}
                  <input
                    id="screenshot"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={onFileChange}
                    className="sr-only"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Your page/channel link or any details we should know..."
                    rows={3}
                    {...register("note")}
                    className="rounded-xl resize-none"
                  />
                </div>

                <Button type="submit" className="w-full rounded-full h-12" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />Submit Order
                    </>
                  )}
                </Button>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
