import Link from "next/link";
import { Mail, MapPin, Star } from "lucide-react";
import { PaymentPartners } from "@/components/payment-methods";
import type { SiteSettings } from "@/lib/announcement-types";
import { DEFAULT_SETTINGS } from "@/lib/announcement-types";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const PLATFORMS = ["YouTube", "Facebook", "Instagram", "TikTok"];

export function Footer({ settings }: { settings?: SiteSettings }) {
  const s = settings || DEFAULT_SETTINGS;
  const displayTagline = s.footer_tagline;
  const siteName = s.site_name || "ytgrowthgear.shop";
  const siteDescription = s.site_description || DEFAULT_SETTINGS.site_description;
  const popularServices = s.footer_popular_services || DEFAULT_SETTINGS.footer_popular_services;
  const whatsappNumber = s.contact_whatsapp || DEFAULT_SETTINGS.contact_whatsapp;
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%2C%20I%27m%20interested%20in%20your%20social%20media%20growth%20services.`;

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand + Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-bold text-base leading-tight">
                {siteName}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {siteDescription}
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${s.contact_email}`}
                  className="hover:text-foreground transition-colors truncate"
                >
                  {s.contact_email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="shrink-0 text-[#25D366]">
                  <WhatsAppIcon className="w-4 h-4" />
                </span>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  WhatsApp: {whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-primary" />
                <span>Service Country: {s.service_country}</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{s.footer_quick_links_title}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                { href: "#services", label: "Services" },
                { href: "#why-us", label: "Why Us" },
                { href: "#order", label: "Order Now" },
                { href: "/login", label: "Admin Login" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform Services */}
          <div>
            <h4 className="font-semibold mb-4">{s.footer_platforms_title}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {PLATFORMS.map((platform) => (
                <li key={platform}>
                  <Link href="#services" className="hover:text-foreground transition-colors">
                    {platform} Growth &amp; Monetization
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Popular Services */}
          <div>
            <h4 className="font-semibold mb-4">{s.footer_popular_title}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {popularServices.map((item: string) => (
                <li key={item}>
                  <Link href="#order" className="hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm">Payment Partners</h4>
            <PaymentPartners />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
            <p>{displayTagline}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
