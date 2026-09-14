"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  Upload,
  ImageIcon,
  X,
  Package,
  CreditCard,
  Wallet,
  ClipboardList,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MAX_SCREENSHOT_MB } from "@/lib/constants";
import {
  PaymentMethodInfo,
  PaymentWorkflowLine,
  CashAppIcon,
  ZelleIcon,
} from "@/components/payment-methods";
import type { GigWithPackages, GigPackage } from "@/lib/gigs";
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  formatPrice,
  formatDeliveryDays,
} from "@/lib/gigs";

const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  quantity: z
    .number({ message: "Please enter a quantity" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  note: z.string().optional(),
});

type OrderForm = z.infer<typeof orderSchema>;

type MethodKey = "zelle" | "cashapp" | "other";

const METHOD_OPTIONS: {
  key: MethodKey;
  label: string;
  dbValue: string;
  color: string;
  icon: React.ReactNode;
  blurb: string;
}[] = [
  {
    key: "zelle",
    label: "Zelle",
    dbValue: "Zelle",
    color: "#6D1ED4",
    icon: <ZelleIcon className="w-5 h-5" />,
    blurb: "Pay with the Zelle email",
  },
  {
    key: "cashapp",
    label: "CashApp",
    dbValue: "CashApp",
    color: "#00D632",
    icon: <CashAppIcon className="w-5 h-5" />,
    blurb: "Scan the QR or $Cashtag",
  },
  {
    key: "other",
    label: "Other",
    dbValue: "Other",
    color: "#888888",
    icon: <Wallet className="w-5 h-5" />,
    blurb: "Any other method",
  },
];

const STEPS = [
  { n: 1, label: "Details", icon: <ClipboardList className="w-3.5 h-3.5" /> },
  { n: 2, label: "Pay", icon: <CreditCard className="w-3.5 h-3.5" /> },
  { n: 3, label: "Screenshot", icon: <Camera className="w-3.5 h-3.5" /> },
];

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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<MethodKey>("zelle");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    trigger,
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

  // Step 1 → 2: validate details, remember them, advance
  const onDetailsContinue = async () => {
    const ok = await trigger(["name", "email", "quantity"]);
    if (ok) setStep(2);
  };

  const goBackToDetails = () => setStep(1);

  // Step 3 → submit
  const onSubmit = async () => {
    if (!screenshot) {
      toast.error("Please attach the payment screenshot.");
      return;
    }
    if (!pkg || !gig) {
      toast.error("No package selected.");
      return;
    }

    const data = getValues();
    const methodDbValue =
      METHOD_OPTIONS.find((m) => m.key === method)?.dbValue || "Other";

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
          paymentMethod: methodDbValue,
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
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
  const packages = (gig.gig_packages || []).sort((a, b) => a.sort_order - b.sort_order);

  /* ---------- Stepper header ---------- */
  const stepper = (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {STEPS.map((s, i) => {
        const isActive = step === s.n;
        const isDone = step > s.n;
        return (
          <div key={s.n} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isDone
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-muted/60 text-muted-foreground"
              }`}
            >
              {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : s.icon}
              <span className="hidden sm:inline">
                {s.n}. {s.label}
              </span>
              <span className="sm:hidden">{s.n}</span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="mx-1 text-muted-foreground/50">→</span>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              step === 1 ? router.push(`/gigs/${gig.slug}`) : setStep((step - 1) as 1 | 2)
            }
            className="gap-1 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? `Back to ${gig.title}` : "Back"}
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
              We&apos;ve received your order for <strong>{gig.title}</strong> (
              {pkg ? pkg.name : selectedTier} package). We&apos;ll review your payment
              screenshot and confirm shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push("/")} className="rounded-full">
                Back to home
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/gigs/${gig.slug}`)}
                className="rounded-full"
              >
                View another service
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">Complete your order</h1>
            <p className="text-muted-foreground text-center mb-8">
              <span className="font-medium text-foreground">{gig.title}</span> ·{" "}
              {pkg ? pkg.name : selectedTier} package
            </p>

            {stepper}

            <AnimatePresence mode="wait">
              {/* ================= STEP 1: DETAILS ================= */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8 rounded-2xl bg-background border border-border/50 space-y-6"
                >
                  <h2 className="font-semibold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    Your details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        {...register("name")}
                        className="rounded-xl"
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                        className="rounded-xl"
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Package selection (hidden if single package) */}
                  {packages.length > 1 && (
                    <div className="space-y-2">
                      <Label>Package *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {packages.map((p) => (
                          <button
                            key={p.tier}
                            type="button"
                            onClick={() => setSelectedTier(p.tier)}
                            className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                              selectedTier === p.tier
                                ? "border-primary bg-primary/5"
                                : "border-border/50 hover:border-border"
                            }`}
                          >
                            <div className="truncate max-w-full">{p.name || p.tier}</div>
                            <div className="text-muted-foreground mt-0.5">
                              {formatPrice(p.price)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                    {errors.quantity && (
                      <p className="text-xs text-destructive">{errors.quantity.message}</p>
                    )}
                  </div>

                  {/* Live total */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total to pay</span>
                    <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                  </div>

                  <Button
                    type="button"
                    onClick={onDetailsContinue}
                    className="w-full rounded-full h-12"
                  >
                    Confirm Purchase
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Next: complete the payment, then upload your screenshot.
                  </p>
                </motion.div>
              )}

              {/* ================= STEP 2: PAY ================= */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="p-6 sm:p-8 rounded-2xl bg-background border border-border/50">
                    <h2 className="font-semibold flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-primary" />
                      Step 1 — Complete The Required Payment
                    </h2>
                    <p className="text-sm text-muted-foreground mb-5">
                      Choose how you want to pay{" "}
                      <span className="font-medium text-foreground">
                        {formatPrice(totalPrice)}
                      </span>{" "}
                      for {gig.title} ({pkg ? pkg.name : selectedTier} × {quantity}).
                    </p>

                    {/* Method cards */}
                    <div className="grid grid-cols-3 gap-2.5 mb-6">
                      {METHOD_OPTIONS.map((m) => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setMethod(m.key)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            method === m.key
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-border"
                          }`}
                        >
                          <span
                            className="w-9 h-9 rounded-lg mx-auto mb-1.5 flex items-center justify-center"
                            style={{ backgroundColor: `${m.color}15`, color: m.color }}
                          >
                            {m.icon}
                          </span>
                          <div className="text-xs font-semibold">{m.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                            {m.blurb}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Chosen method's payment details */}
                    <PaymentMethodInfo method={method} />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBackToDetails}
                      className="rounded-full h-12 sm:flex-1"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      className="rounded-full h-12 sm:flex-[2]"
                    >
                      I Have Completed The Payment
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    After making the payment, you&apos;ll upload your screenshot in the
                    next step.
                  </p>
                </motion.div>
              )}

              {/* ================= STEP 3: SCREENSHOT + SUBMIT ================= */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="p-6 sm:p-8 rounded-2xl bg-background border border-border/50 space-y-6">
                    <div>
                      <h2 className="font-semibold flex items-center gap-2 mb-1">
                        <Camera className="w-4 h-4 text-primary" />
                        Step 2 — Send Us Your Payment Screenshot
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Attach the payment confirmation screenshot and submit your
                        order. We&apos;ll verify it and confirm shortly.
                      </p>
                      <div className="mt-3">
                        <PaymentWorkflowLine />
                      </div>
                    </div>

                    {/* Order recap */}
                    <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium truncate max-w-[60%] text-right">
                          {gig.title} — {pkg ? pkg.name : selectedTier}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paying via</span>
                        <span className="font-medium">
                          {METHOD_OPTIONS.find((m) => m.key === method)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount paid</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Screenshot upload */}
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
                            <div className="text-sm font-medium truncate">
                              {screenshot.name}
                            </div>
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
                            Tap to add your payment screenshot
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
                        placeholder="Your page/channel link, transaction ID, or any details we should know..."
                        rows={3}
                        {...register("note")}
                        className="rounded-xl resize-none"
                      />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="rounded-full h-12 sm:flex-1"
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="rounded-full h-12 sm:flex-[2]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Order
                            <CheckCircle className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
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
