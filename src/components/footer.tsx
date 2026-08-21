import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">VS</span>
              </div>
              <span className="font-bold text-xl">{SITE_CONFIG.name}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Paid Advertising", "Content Creation", "Influencer Marketing", "Analytics", "Community Management", "Brand Strategy"].map((item) => (
                <li key={item}>
                  <Link href="#services" className="hover:text-foreground transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platforms</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Facebook Marketing", "TikTok Growth", "YouTube SEO", "Instagram Strategy", "LinkedIn B2B"].map((item) => (
                <li key={item}>
                  <Link href="#platforms" className="hover:text-foreground transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" />{SITE_CONFIG.contact.email}</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" />{SITE_CONFIG.contact.phone}</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" />{SITE_CONFIG.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
