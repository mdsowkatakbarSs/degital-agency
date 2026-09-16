"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  Settings as SettingsIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEFAULT_SETTINGS } from "@/lib/announcement-types";

interface WhyUsFeature {
  title: string;
  description: string;
  icon: string;
}

interface SettingsForm {
  announcement_enabled: boolean;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  footer_tagline: string;
  site_name: string;
  site_description: string;
  services_title: string;
  services_subtitle: string;
  why_us_title: string;
  why_us_subtitle: string;
  why_us_features_json: string;
  order_title: string;
  order_subtitle: string;
  order_description: string;
  ticker_enabled: boolean;
  activity_feed: string;
  contact_email: string;
  contact_whatsapp: string;
  service_country: string;
  payment_zelle_email: string;
  payment_cashapp_cashtag: string;
  payment_cashapp_qr: string;
  footer_quick_links_title: string;
  footer_platforms_title: string;
  footer_popular_title: string;
  footer_popular_services: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState<SettingsForm>({
    announcement_enabled: true,
    hero_badge: "",
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    footer_tagline: "",
    site_name: "",
    site_description: "",
    services_title: "",
    services_subtitle: "",
    why_us_title: "",
    why_us_subtitle: "",
    why_us_features_json: "[]",
    order_title: "",
    order_subtitle: "",
    order_description: "",
    ticker_enabled: true,
    activity_feed: "",
    contact_email: "",
    contact_whatsapp: "",
    service_country: "",
    payment_zelle_email: "",
    payment_cashapp_cashtag: "",
    payment_cashapp_qr: "",
    footer_quick_links_title: "",
    footer_platforms_title: "",
    footer_popular_title: "",
    footer_popular_services: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data, error } = await supabase.from("site_settings").select("*");

    if (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } else if (data) {
      const map: Record<string, string> = {};
      for (const row of data) {
        map[row.key] = row.value;
      }
      setForm({
        announcement_enabled: (map.announcement_enabled ?? "true") === "true",
        hero_badge: map.hero_badge || DEFAULT_SETTINGS.hero_badge,
        hero_title: map.hero_title || DEFAULT_SETTINGS.hero_title,
        hero_subtitle: map.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle,
        hero_description: map.hero_description || DEFAULT_SETTINGS.hero_description,
        footer_tagline: map.footer_tagline || DEFAULT_SETTINGS.footer_tagline,
        site_name: map.site_name || DEFAULT_SETTINGS.site_name,
        site_description: map.site_description || DEFAULT_SETTINGS.site_description,
        services_title: map.services_title || DEFAULT_SETTINGS.services_title,
        services_subtitle: map.services_subtitle || DEFAULT_SETTINGS.services_subtitle,
        why_us_title: map.why_us_title || DEFAULT_SETTINGS.why_us_title,
        why_us_subtitle: map.why_us_subtitle || DEFAULT_SETTINGS.why_us_subtitle,
        why_us_features_json: map.why_us_features || JSON.stringify(DEFAULT_SETTINGS.why_us_features, null, 2),
        order_title: map.order_title || DEFAULT_SETTINGS.order_title,
        order_subtitle: map.order_subtitle || DEFAULT_SETTINGS.order_subtitle,
        order_description: map.order_description || DEFAULT_SETTINGS.order_description,
        ticker_enabled: (map.ticker_enabled ?? "true") === "true",
        activity_feed: map.activity_feed || DEFAULT_SETTINGS.activity_feed.join("\n"),
        contact_email: map.contact_email || DEFAULT_SETTINGS.contact_email,
        contact_whatsapp: map.contact_whatsapp || DEFAULT_SETTINGS.contact_whatsapp,
        service_country: map.service_country || DEFAULT_SETTINGS.service_country,
        payment_zelle_email: map.payment_zelle_email || DEFAULT_SETTINGS.payment_zelle_email,
        payment_cashapp_cashtag: map.payment_cashapp_cashtag || DEFAULT_SETTINGS.payment_cashapp_cashtag,
        payment_cashapp_qr: map.payment_cashapp_qr || DEFAULT_SETTINGS.payment_cashapp_qr,
        footer_quick_links_title: map.footer_quick_links_title || DEFAULT_SETTINGS.footer_quick_links_title,
        footer_platforms_title: map.footer_platforms_title || DEFAULT_SETTINGS.footer_platforms_title,
        footer_popular_title: map.footer_popular_title || DEFAULT_SETTINGS.footer_popular_title,
        footer_popular_services: map.footer_popular_services || JSON.stringify(DEFAULT_SETTINGS.footer_popular_services),
      });
    }
    setLoading(false);
  }

  async function save() {
    setSaving(true);

    const rows = Object.entries(form).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      console.error("Save error:", error);
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved - refresh the homepage to see changes");
      router.refresh();
    }
    setSaving(false);
  }

  function update(field: keyof SettingsForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Why Us feature helpers
  function getFeatures(): WhyUsFeature[] {
    try {
      const parsed = JSON.parse(form.why_us_features_json);
      return Array.isArray(parsed) ? parsed : DEFAULT_SETTINGS.why_us_features;
    } catch {
      return DEFAULT_SETTINGS.why_us_features;
    }
  }

  function updateFeature(index: number, field: keyof WhyUsFeature, value: string) {
    const features = getFeatures();
    features[index] = { ...features[index], [field]: value };
    update("why_us_features_json", JSON.stringify(features, null, 2));
  }

  function addFeature() {
    const features = getFeatures();
    features.push({ title: "New Feature", description: "Description here", icon: "Zap" });
    update("why_us_features_json", JSON.stringify(features, null, 2));
  }

  function removeFeature(index: number) {
    const features = getFeatures();
    features.splice(index, 1);
    update("why_us_features_json", JSON.stringify(features, null, 2));
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin")}
            className="mb-2 -ml-2 gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Site Settings
          </h1>
          <p className="text-muted-foreground">
            Control the site content without touching any code or SQL
          </p>
        </div>

        <div className="space-y-6">
          {/* Site Identity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Site Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site name</Label>
                <Input value={form.site_name} onChange={(e) => update("site_name", e.target.value)} placeholder="ytgrowthgear.shop" />
              </div>
              <div className="space-y-2">
                <Label>Site description (for footer & SEO)</Label>
                <Textarea value={form.site_description} onChange={(e) => update("site_description", e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* Announcements toggle */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Announcement Bar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Show announcement bar</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    When off, no announcements show anywhere on the site
                  </p>
                </div>
                <Switch checked={form.announcement_enabled} onCheckedChange={(checked) => update("announcement_enabled", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">
                Create and manage announcement content in{" "}
                <a href="/admin/announcements" className="text-primary underline underline-offset-2">
                  Announcements & Offers
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Hero section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hero Section (Homepage top)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge text</Label>
                <Input value={form.hero_badge} onChange={(e) => update("hero_badge", e.target.value)} placeholder="Welcome To Our Platform" />
              </div>
              <div className="space-y-2">
                <Label>Main headline</Label>
                <Input value={form.hero_title} onChange={(e) => update("hero_title", e.target.value)} placeholder="Grow Faster. Reach Further. Monetize Smarter." />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={form.hero_subtitle} onChange={(e) => update("hero_subtitle", e.target.value)} placeholder="Your Trusted Partner For..." />
              </div>
              <div className="space-y-2">
                <Label>Description paragraph</Label>
                <Textarea value={form.hero_description} onChange={(e) => update("hero_description", e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Services section headings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Services Section (Homepage)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section title</Label>
                <Input value={form.services_title} onChange={(e) => update("services_title", e.target.value)} placeholder="Our Services" />
              </div>
              <div className="space-y-2">
                <Label>Section subtitle</Label>
                <Input value={form.services_subtitle} onChange={(e) => update("services_subtitle", e.target.value)} placeholder="Professional growth & monetization solutions..." />
              </div>
            </CardContent>
          </Card>

          {/* Why Us section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Why Choose Us Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section title</Label>
                <Input value={form.why_us_title} onChange={(e) => update("why_us_title", e.target.value)} placeholder="Why Choose Us" />
              </div>
              <div className="space-y-2">
                <Label>Section subtitle</Label>
                <Input value={form.why_us_subtitle} onChange={(e) => update("why_us_subtitle", e.target.value)} placeholder="Trusted service, safe methods..." />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Features ({getFeatures().length})</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature} className="gap-1 h-7">
                    <Plus className="w-3.5 h-3.5" /> Add Feature
                  </Button>
                </div>
                {getFeatures().map((feat, i) => (
                  <div key={i} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Input value={feat.title} onChange={(e) => updateFeature(i, "title", e.target.value)} placeholder="Feature title" className="h-8" />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(i)} className="h-8 px-2 text-destructive shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <Input value={feat.description} onChange={(e) => updateFeature(i, "description", e.target.value)} placeholder="Feature description" className="h-8" />
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground w-12">Icon:</Label>
                      <Input value={feat.icon} onChange={(e) => updateFeature(i, "icon", e.target.value)} placeholder="TrendingUp" className="h-8 flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order / How It Works section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Place Your Order Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section title</Label>
                <Input value={form.order_title} onChange={(e) => update("order_title", e.target.value)} placeholder="Place Your Order" />
              </div>
              <div className="space-y-2">
                <Label>Section subtitle</Label>
                <Input value={form.order_subtitle} onChange={(e) => update("order_subtitle", e.target.value)} placeholder="Pick a package, complete the payment..." />
              </div>
              <div className="space-y-2">
                <Label>Description text</Label>
                <Textarea value={form.order_description} onChange={(e) => update("order_description", e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* Live activity ticker */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Live Activity Ticker (footer)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Show activity ticker</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Social-proof line cycling through recent activity above the footer
                  </p>
                </div>
                <Switch checked={form.ticker_enabled} onCheckedChange={(checked) => update("ticker_enabled", checked)} />
              </div>
              <div className="space-y-2">
                <Label>Activity feed (one item per line)</Label>
                <Textarea value={form.activity_feed} onChange={(e) => update("activity_feed", e.target.value)} rows={5} />
              </div>
            </CardContent>
          </Card>

          {/* Contact info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Details (footer & navbar)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Contact email</Label>
                <Input value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} placeholder="ytgrowthgear2026@gmail.com" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp number (with country code)</Label>
                <Input value={form.contact_whatsapp} onChange={(e) => update("contact_whatsapp", e.target.value)} placeholder="+8801761391880" />
              </div>
              <div className="space-y-2">
                <Label>Service country</Label>
                <Input value={form.service_country} onChange={(e) => update("service_country", e.target.value)} placeholder="Bangladesh" />
              </div>
            </CardContent>
          </Card>

          {/* Payment details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Details (checkout only)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Zelle email</Label>
                <Input value={form.payment_zelle_email} onChange={(e) => update("payment_zelle_email", e.target.value)} placeholder="prakashauzee15@gmail.com" />
              </div>
              <div className="space-y-2">
                <Label>CashApp $Cashtag</Label>
                <Input value={form.payment_cashapp_cashtag} onChange={(e) => update("payment_cashapp_cashtag", e.target.value)} placeholder="$AimeeKhuu" />
              </div>
              <div className="space-y-2">
                <Label>CashApp QR image</Label>
                <ImageUpload value={form.payment_cashapp_qr} onChange={(url) => update("payment_cashapp_qr", url)} folder="qrcodes" placeholder="/payments/cashapp-qr.jpg" small />
              </div>
            </CardContent>
          </Card>

          {/* Footer settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Footer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Footer tagline</Label>
                <Input value={form.footer_tagline} onChange={(e) => update("footer_tagline", e.target.value)} placeholder="Grow Faster. Reach Further. Monetize Smarter." />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Quick Links title</Label>
                  <Input value={form.footer_quick_links_title} onChange={(e) => update("footer_quick_links_title", e.target.value)} placeholder="Quick Links" />
                </div>
                <div className="space-y-2">
                  <Label>Platforms title</Label>
                  <Input value={form.footer_platforms_title} onChange={(e) => update("footer_platforms_title", e.target.value)} placeholder="Platform Services" />
                </div>
                <div className="space-y-2">
                  <Label>Popular title</Label>
                  <Input value={form.footer_popular_title} onChange={(e) => update("footer_popular_title", e.target.value)} placeholder="Popular Services" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Popular services (JSON array)</Label>
                <Textarea value={form.footer_popular_services} onChange={(e) => update("footer_popular_services", e.target.value)} rows={3} className="font-mono text-xs" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pb-8">
            <Button variant="outline" onClick={() => router.push("/admin")} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} className="rounded-full gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
