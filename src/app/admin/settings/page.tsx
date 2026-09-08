"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";import {
  ArrowLeft,
  Loader2,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DEFAULT_SETTINGS,
} from "@/lib/announcement-types";

interface SettingsForm {
  announcement_enabled: boolean;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  stats_platforms: string;
  stats_services: string;
  stats_safe: string;
  stats_support: string;
  footer_tagline: string;
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
    stats_platforms: "",
    stats_services: "",
    stats_safe: "",
    stats_support: "",
    footer_tagline: "",
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
        stats_platforms: map.stats_platforms || DEFAULT_SETTINGS.stats_platforms,
        stats_services: map.stats_services || DEFAULT_SETTINGS.stats_services,
        stats_safe: map.stats_safe || DEFAULT_SETTINGS.stats_safe,
        stats_support: map.stats_support || DEFAULT_SETTINGS.stats_support,
        footer_tagline: map.footer_tagline || DEFAULT_SETTINGS.footer_tagline,
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
      toast.success("Settings saved — refresh the homepage to see changes");
      router.refresh();
    }
    setSaving(false);
  }

  function update(field: keyof SettingsForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
                <Switch
                  checked={form.announcement_enabled}
                  onCheckedChange={(checked) =>
                    update("announcement_enabled", checked)
                  }
                />
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
                <Input
                  value={form.hero_badge}
                  onChange={(e) => update("hero_badge", e.target.value)}
                  placeholder="Welcome To Our Platform"
                />
              </div>
              <div className="space-y-2">
                <Label>Main headline</Label>
                <Input
                  value={form.hero_title}
                  onChange={(e) => update("hero_title", e.target.value)}
                  placeholder="Grow Faster. Reach Further. Monetize Smarter."
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={form.hero_subtitle}
                  onChange={(e) => update("hero_subtitle", e.target.value)}
                  placeholder="Your Trusted Partner For..."
                />
              </div>
              <div className="space-y-2">
                <Label>Description paragraph</Label>
                <Textarea
                  value={form.hero_description}
                  onChange={(e) => update("hero_description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Homepage Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stat 1 — value</Label>
                  <Input
                    value={form.stats_platforms}
                    onChange={(e) => update("stats_platforms", e.target.value)}
                    placeholder="4"
                  />
                  <p className="text-xs text-muted-foreground">Label: Major Platforms</p>
                </div>
                <div className="space-y-2">
                  <Label>Stat 2 — value</Label>
                  <Input
                    value={form.stats_services}
                    onChange={(e) => update("stats_services", e.target.value)}
                    placeholder="16"
                  />
                  <p className="text-xs text-muted-foreground">Label: Growth Services</p>
                </div>
                <div className="space-y-2">
                  <Label>Stat 3 — value</Label>
                  <Input
                    value={form.stats_safe}
                    onChange={(e) => update("stats_safe", e.target.value)}
                    placeholder="100%"
                  />
                  <p className="text-xs text-muted-foreground">Label: Safe Methods</p>
                </div>
                <div className="space-y-2">
                  <Label>Stat 4 — value</Label>
                  <Input
                    value={form.stats_support}
                    onChange={(e) => update("stats_support", e.target.value)}
                    placeholder="24/7"
                  />
                  <p className="text-xs text-muted-foreground">Label: Support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Footer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Footer tagline</Label>
              <Input
                value={form.footer_tagline}
                onChange={(e) => update("footer_tagline", e.target.value)}
                placeholder="Grow Faster. Reach Further. Monetize Smarter."
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pb-8">
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} className="rounded-full gap-2">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
