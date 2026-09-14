"use client";

import { useEffect, useState } from "react";
import { Mail, QrCode, ExternalLink } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/lib/announcement-types";

/** The subset of settings used by payment components. */
export type PaymentDetails = {
  zelleEmail: string;
  cashappCashtag: string;
  cashappQr: string;
};

const FALLBACK: PaymentDetails = {
  zelleEmail: DEFAULT_SETTINGS.payment_zelle_email,
  cashappCashtag: DEFAULT_SETTINGS.payment_cashapp_cashtag,
  cashappQr: DEFAULT_SETTINGS.payment_cashapp_qr,
};

/**
 * Fetch admin-editable payment details from the public settings endpoint.
 * Renders immediately with defaults, then swaps in DB values once loaded —
 * so the checkout never blocks or flashes empty.
 */
export function usePaymentDetails(): PaymentDetails {
  const [details, setDetails] = useState<PaymentDetails>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site-settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setDetails({
          zelleEmail: data.payment_zelle_email || FALLBACK.zelleEmail,
          cashappCashtag: data.payment_cashapp_cashtag || FALLBACK.cashappCashtag,
          cashappQr: data.payment_cashapp_qr || FALLBACK.cashappQr,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return details;
}

export function ZelleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.5 3H9.3l-4.8 9h4.2L4.5 21h10.2l4.8-9h-4.2z" />
    </svg>
  );
}

export function CashAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-7.314-4.565c-.357-.376-.958-.585-1.636-.585h-3.39c-1.298 0-2.372.914-2.372 2.084 0 1.169 1.05 2.107 2.372 2.107h2.676c.547 0 .903.294.903.57 0 .277-.356.57-.903.57H7.17c-.612 0-1.03.293-1.03.716v1.235c0 .422.418.716 1.03.716h1.288v1.186c0 .516.345.86.86.86.517 0 .861-.344.861-.86v-1.186h1.879c1.297 0 2.371-.914 2.371-2.084s-1.05-2.107-2.371-2.107h-2.677c-.546 0-.902-.294-.902-.57 0-.277.356-.57.902-.57h4.916c.612 0 1.03-.294 1.03-.717V8.15a.85.85 0 00-.25-.715h-.05z" />
    </svg>
  );
}

/**
 * Compact "payment partners" strip — names + logos only, no sensitive details.
 * Safe to show anywhere: homepage, footer, etc.
 */
export function PaymentPartners({ className }: { className?: string }) {
  const partners = [
    { name: "Zelle", icon: <ZelleIcon className="w-4 h-4" />, color: "#6D1ED4" },
    { name: "CashApp", icon: <CashAppIcon className="w-4 h-4" />, color: "#00D632" },
  ];

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <span className="text-xs text-muted-foreground">We accept:</span>
        {partners.map((p) => (
          <span
            key={p.name}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-background text-xs font-medium"
          >
            <span style={{ color: p.color }} aria-hidden="true">
              {p.icon}
            </span>
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}

type MethodKey = "zelle" | "cashapp" | "other";

/**
 * Detailed payment instructions for ONE method — shown inside the
 * order flow's "Payment" step only. Never rendered on the homepage.
 * Details come from the admin-editable Settings panel.
 */
export function PaymentMethodInfo({ method }: { method: MethodKey }) {
  const details = usePaymentDetails();

  if (method === "zelle") {
    return (
      <div className="p-4 sm:p-5 rounded-2xl border border-[#6D1ED4]/25 bg-[#6D1ED4]/5">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-9 h-9 rounded-xl bg-[#6D1ED4]/10 text-[#6D1ED4] flex items-center justify-center shrink-0">
            <ZelleIcon className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Pay with Zelle</h3>
            <a
              href="https://www.zelle.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 inline-flex items-center gap-1"
            >
              Open zelle.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <p className="text-sm mb-2">
          Complete the required payment to this Zelle email:
        </p>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border text-sm">
          <Mail className="w-4 h-4 shrink-0 text-[#6D1ED4]" />
          <span className="font-semibold truncate select-all">
            {details.zelleEmail}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Send payment to the Zelle email above, then upload your confirmation
          screenshot.
        </p>
      </div>
    );
  }

  if (method === "cashapp") {
    return (
      <div className="p-4 sm:p-5 rounded-2xl border border-[#00D632]/25 bg-[#00D632]/5">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-9 h-9 rounded-xl bg-[#00D632]/10 text-[#00D632] flex items-center justify-center shrink-0">
            <CashAppIcon className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Pay with CashApp</h3>
            <a
              href="https://cash.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 inline-flex items-center gap-1"
            >
              Open cash.app <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <p className="text-sm mb-2">
          Scan the QR below (or send to the $Cashtag) to complete the payment:
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <a
            href={details.cashappQr}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 self-center sm:self-auto rounded-xl overflow-hidden border border-border bg-background p-1.5"
            aria-label="Open CashApp QR code full size"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={details.cashappQr}
              alt="CashApp QR code — tap to enlarge"
              className="w-36 h-36 sm:w-40 sm:h-40 object-cover rounded-lg"
              loading="lazy"
            />
          </a>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border text-sm">
              <span className="text-muted-foreground shrink-0">Ac:</span>
              <span className="font-semibold truncate select-all">
                {details.cashappCashtag}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
              <QrCode className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Tap the QR to enlarge. Scan the QR or send to the $Cashtag above,
              then upload your confirmation screenshot.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Other
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border/60 bg-muted/30">
      <h3 className="font-semibold text-sm mb-2">Paying with another method?</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Complete the payment using your preferred method, then upload the
        payment screenshot in the next step. Mention the method you used in the
        order note so we can verify it faster.
      </p>
    </div>
  );
}

export function PaymentWorkflowLine() {
  return (
    <p className="text-sm font-medium flex flex-wrap items-center gap-1.5">
      <span>💳 Pay</span>
      <span className="text-muted-foreground">→</span>
      <span>Send Screenshot</span>
      <span className="text-muted-foreground">→</span>
      <span>Submit Order</span>
      <span className="text-green-600 dark:text-green-400">✅</span>
    </p>
  );
}
