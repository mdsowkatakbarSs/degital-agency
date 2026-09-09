"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle,
  Upload,
  ImageIcon,
  X,
  Package,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PAYMENT_METHODS, MAX_SCREENSHOT_MB } from "@/lib/constants";
import { PaymentMethods } from "@/components/payment-methods";
import type { GigWithPackages, GigPackage } from "@/lib/gigs";
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  formatPrice,
  formatDeliveryDays,
  TIER_LABELS,
} from "@/lib/gigs";

const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
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

function OrderPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gigSlug = searchParams.get("gig");
  const tierParam = searchParams.get("tier") || "basic";

  const [gig, setGig] = useState<GigWithPackages | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>(tierParam);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: { quantity: 1 },
  });

  const quantity = watch("quantity") || 1;

  useEffect(() => {
    async function fetchGig() {
      if (!gigSlug) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/gigs?platform=all");
        const data = await res.json();
        const found = data.gigs?.find((g: GigWithPackages) => g.slug === gigSlug);
        if (found) setGig(found);
      } catch {
        toast.error("Failed to load gig details");
      }
      setLoading(false);
    }
    fetchGig();
  }, [gigSlug]);

  const pkg = gig?.gig_packages?.find((p: GigPackage) => p.tier === selectedTier);
  const totalPrice = pkg ? pkg.price * quantity : 0;

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
    if (!pkg || !gig) {
      toast.error("No package selected.");
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
          service: gig.title,
          quantity: data.quantity,
          paymentMethod: data.paymentMethod,
          note: data.note,
          screenshotName: screenshot.name,
          screenshotData,
          gigId: gig.id,
          packageTier: pkg.tier,
          packagePrice: pkg.price,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setIsSuccess(true);
      reset();
      clearScreenshot();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // No gig param — show fallback message
  if (!gigSlug || !gig) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h1 className="text-2xl font-bold mb-3">Select a service first</h1>
          <p className="text-muted-foreground mb-6">
            Browse our services and pick a package to get started.
          </p>
          <Button onClick={() => router.push("/#services")} className="rounded-full">
            Browse services
          </Button>
        </div>
      </div>
    );
  }

  const color = PLATFORM_COLORS[gig.platform] || "#888";

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/gigs/${gig.slug}`)}
            className="gap-1 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {gig.title}
          </Button>
        </motion.div>

        {isSuccess ? (
          /* Confirmation Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Order Submitted!</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
              We&apos;ve received your order for <strong>{gig.title}</strong> ({TIER_LABELS[selectedTier]} package). We&apos;ll review your payment screenshot and confirm shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push("/")} className="rounded-full">
                Back to home
              </Button>
              <Button variant="outline" onClick={() => router.push(`/gigs/${gig.slug}`)} className="rounded-full">
                View another service
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Order Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <h1 className="text-2xl font-bold mb-6">Complete your order</h1>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 rounded-2xl bg-background border border-border/50 space-y-6">
                {/* Name & Email */}
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

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
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

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Pay By *</Label>
                  <select id="paymentMethod" defaultValue="" {...register("paymentMethod")} className={selectClasses}>
                    <option value="" disabled>
                      Select payment method
                    </option>                      {PAYMENT_METHODS.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                  </select>
                  {errors.paymentMethod && (
                    <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>
                  )}
                </div>

                {/* Screenshot Upload */}
                <div className="space-y-2">
                  <Label htmlFor="screenshot">Payment Screenshot *</Label>
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
                      <Button type="button" variant="ghost" size="icon" onClick={clearScreenshot} aria-label="Remove screenshot">
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

                {/* Note */}
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

                {/* Submit */}
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
              </form>
            </motion.div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="lg:sticky lg:top-28">
                <div className="p-6 rounded-2xl border border-border/50 bg-background space-y-5">
                  <h2 className="font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Order Summary
                  </h2>

                  {/* Gig Info */}
                  <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <span className="text-xs font-bold" style={{ color }}>
                        {PLATFORM_LABELS[gig.platform]?.slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">{gig.title}</h3>
                      <Badge variant="secondary" className="mt-1 text-xs" style={{ backgroundColor: `${color}15`, color }}>
                        {PLATFORM_LABELS[gig.platform]}
                      </Badge>
                    </div>
                  </div>

                  {/* Package Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Package</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(gig.gig_packages || [])
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((p) => (
                          <button
                            key={p.tier}
                            type="button"
                            onClick={() => setSelectedTier(p.tier)}
                            className={`p-2 rounded-lg border text-center text-xs font-medium transition-all ${
                              selectedTier === p.tier
                                ? "border-primary bg-primary/5"
                                : "border-border/50 hover:border-border"
                            }`}
                          >
                            <div>{TIER_LABELS[p.tier]}</div>
                            <div className="text-muted-foreground mt-0.5">{formatPrice(p.price)}</div>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Package price</span>
                      <span>{pkg ? formatPrice(pkg.price) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span>× {quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>{pkg ? formatDeliveryDays(pkg.delivery_days) : "—"}</span>
                    </div>
                    <div className="border-t border-border/50 pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-lg">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  Upload your payment proof and we&apos;ll confirm shortly.
                </p>
              </div>
              <div className="mt-4">
                <PaymentMethods />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}
