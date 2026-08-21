import Link from "next/link";
import { Star } from "lucide-react";
import { SITE_CONFIG, SERVICE_GROUPS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-bold text-base leading-tight">
                Digital Agency &amp;<br className="hidden lg:block" /> Social Exchange
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
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

          <div>
            <h4 className="font-semibold mb-4">Platform Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {SERVICE_GROUPS.map((group) => (
                <li key={group.platform}>
                  <Link href="#services" className="hover:text-foreground transition-colors">
                    {group.platform} Growth &amp; Monetization
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Popular Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "YouTube Monetization Package",
                "Facebook Monetization Package",
                "YouTube Watch Time",
                "Instagram Followers",
                "TikTok Followers",
              ].map((item) => (
                <li key={item}>
                  <Link href="#order" className="hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p>Grow Faster. Reach Further. Monetize Smarter.</p>
        </div>
      </div>
    </footer>
  );
}
