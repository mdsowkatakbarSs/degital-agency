import Link from "next/link";
import { Mail, QrCode } from "lucide-react";
import { ORDER_STEPS, PAYMENT_DETAILS } from "@/lib/constants";

function ZelleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.5 3H9.3l-4.8 9h4.2L4.5 21h10.2l4.8-9h-4.2z" />
    </svg>
  );
}

function CashAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-7.314-4.565c-.357-.376-.958-.585-1.636-.585h-3.39c-1.298 0-2.372.914-2.372 2.084 0 1.169 1.05 2.107 2.372 2.107h2.676c.547 0 .903.294.903.57 0 .277-.356.57-.903.57H7.17c-.612 0-1.03.293-1.03.716v1.235c0 .422.418.716 1.03.716h1.288v1.186c0 .516.345.86.86.86.517 0 .861-.344.861-.86v-1.186h1.879c1.297 0 2.371-.914 2.371-2.084s-1.05-2.107-2.371-2.107h-2.677c-.546 0-.902-.294-.902-.57 0-.277.356-.57.902-.57h4.916c.612 0 1.03-.294 1.03-.717V8.15a.85.85 0 00-.25-.715h-.05z" />
    </svg>
  );
}

export function PaymentMethods() {
  return (
    <div className="space-y-4">
      {/* Workflow steps */}
      <div className="p-4 sm:p-5 rounded-2xl border border-primary/20 bg-primary/5">
        <h3 className="font-semibold text-sm mb-3">How To Place Your Order:</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          {ORDER_STEPS.map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm font-medium flex flex-wrap items-center gap-1.5">
          <span>💳 Pay</span>
          <span className="text-muted-foreground">→</span>
          <span>Send Screenshot</span>
          <span className="text-muted-foreground">→</span>
          <span>Submit Order</span>
          <span className="text-green-600 dark:text-green-400">✅</span>
        </p>
      </div>

      {/* Zelle */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/50 bg-background">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-9 h-9 rounded-xl bg-[#6D1ED4]/10 text-[#6D1ED4] flex items-center justify-center shrink-0">
            <ZelleIcon className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Pay with Zelle</h3>
            <a
              href={PAYMENT_DETAILS.zelle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              zelle.com
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 text-sm">
          <Mail className="w-4 h-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground shrink-0">Email:</span>
          <span className="font-medium truncate select-all">
            {PAYMENT_DETAILS.zelle.email}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {PAYMENT_DETAILS.zelle.hint}
        </p>
      </div>

      {/* CashApp */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/50 bg-background">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-9 h-9 rounded-xl bg-[#00D632]/10 text-[#00D632] flex items-center justify-center shrink-0">
            <CashAppIcon className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Pay with CashApp</h3>
            <a
              href={PAYMENT_DETAILS.cashapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              cash.app
            </a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 text-sm flex-1 min-w-0">
            <span className="text-muted-foreground shrink-0">Ac:</span>
            <span className="font-medium truncate select-all">
              {PAYMENT_DETAILS.cashapp.cashtag}
            </span>
          </div>
          <a
            href={PAYMENT_DETAILS.cashapp.qrImage}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 self-start sm:self-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PAYMENT_DETAILS.cashapp.qrImage}
              alt="CashApp QR code for $AimeeKhuu"
              className="w-20 h-20 rounded-lg border border-border object-cover"
              loading="lazy"
            />
          </a>
        </div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 shrink-0" />
          Tap the QR to enlarge. {PAYMENT_DETAILS.cashapp.hint}
        </p>
      </div>
    </div>
  );
}
