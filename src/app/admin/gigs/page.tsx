"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ImagePlus, Loader2, Package, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";import { ImageUpload } from "@/components/image-upload";
import { type Gig,
  type GigPackage,
  PLATFORMS,
  PLATFORM_LABELS,
  PLATFORM_COLORS,
} from "@/lib/gigs";

interface GigWithPackages extends Gig {
  gig_packages: GigPackage[];
}

export default function AdminGigsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [gigs, setGigs] = useState<GigWithPackages[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingGig, setEditingGig] = useState<GigWithPackages | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchGigs();
  }, []);

  async function fetchGigs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("gigs")
      .select("*, gig_packages(*)")
      .order("sort_order");

    if (error) {
      console.error("Error fetching gigs:", error);
      toast.error("Failed to load gigs");
    } else {
      setGigs((data as GigWithPackages[]) || []);
    }
    setLoading(false);
  }

  function openNewGig() {
    setEditingGig({
      id: "",
      slug: "",
      platform: "youtube",
      title: "",
      short_description: "",
      full_description: "",
      cover_image_url: "",
      starting_price: 9.99,
      delivery_days: 3,
      is_active: true,
      sort_order: gigs.length,
      created_at: "",
      updated_at: "",
      gig_packages: [
        { id: "", gig_id: "", tier: "basic", name: "Basic", price: 9.99, delivery_days: 3, features: ["Standard delivery", "Email updates"], sort_order: 0 },
        { id: "", gig_id: "", tier: "standard", name: "Standard", price: 19.99, delivery_days: 5, features: ["Priority delivery", "Email + chat updates", "Drip-feed"], sort_order: 1 },
        { id: "", gig_id: "", tier: "premium", name: "Premium", price: 39.99, delivery_days: 7, features: ["Express delivery", "Priority support", "Unlimited revisions"], sort_order: 2 },
      ],
    });
    setIsDialogOpen(true);
  }

  function openEditGig(gig: GigWithPackages) {
    setEditingGig({ ...gig, gig_packages: [...gig.gig_packages] });
    setIsDialogOpen(true);
  }

  function updatePackage(index: number, field: string, value: string | number | string[]) {
    if (!editingGig) return;
    const updated = [...editingGig.gig_packages];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[field] = value;
    setEditingGig({ ...editingGig, gig_packages: updated });
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function addPackage() {
    if (!editingGig) return;
    const nextSort = editingGig.gig_packages.length;
    setEditingGig({
      ...editingGig,
      gig_packages: [
        ...editingGig.gig_packages,
        {
          id: "",
          gig_id: editingGig.id,
          tier: `tier-${nextSort + 1}`,
          name: `Package ${nextSort + 1}`,
          price: 9.99,
          delivery_days: 3,
          features: ["Standard delivery"],
          sort_order: nextSort,
          image_url: "",
        },
      ],
    });
  }

  function removePackage(index: number) {
    if (!editingGig) return;
    setEditingGig({
      ...editingGig,
      gig_packages: editingGig.gig_packages.filter((_, i) => i !== index),
    });
  }

  async function saveGig() {
    if (!editingGig) return;

    if (!editingGig.title || !editingGig.slug || !editingGig.platform) {
      toast.error("Title, slug, and platform are required");
      return;
    }

    setSaving(true);

    const gigData = {
      slug: editingGig.slug || generateSlug(editingGig.title),
      platform: editingGig.platform,
      title: editingGig.title,
      short_description: editingGig.short_description,
      full_description: editingGig.full_description,
      cover_image_url: editingGig.cover_image_url,
      starting_price: editingGig.starting_price,
      delivery_days: editingGig.delivery_days,
      is_active: editingGig.is_active,
      sort_order: editingGig.sort_order,
    };

    if (editingGig.id) {
      // Update existing gig
      const { error } = await supabase
        .from("gigs")
        .update(gigData)
        .eq("id", editingGig.id);

      if (error) {
        toast.error("Failed to update gig");
        setSaving(false);
        return;
      }

      // Update packages
      for (const pkg of editingGig.gig_packages) {
        if (pkg.id) {
          await supabase
            .from("gig_packages")
            .update({
              tier: pkg.tier,
              name: pkg.name,
              price: pkg.price,
              delivery_days: pkg.delivery_days,
              features: pkg.features,
              sort_order: pkg.sort_order,
              image_url: pkg.image_url || "",
            })
            .eq("id", pkg.id);
        } else {
          await supabase.from("gig_packages").insert({
            gig_id: editingGig.id,
            tier: pkg.tier,
            name: pkg.name,
            price: pkg.price,
            delivery_days: pkg.delivery_days,
            features: pkg.features,
            sort_order: pkg.sort_order,
            image_url: pkg.image_url || "",
          });
        }
      }

      toast.success("Gig updated");
    } else {
      // Create new gig
      const { data, error } = await supabase
        .from("gigs")
        .insert(gigData)
        .select()
        .single();

      if (error || !data) {
        toast.error("Failed to create gig");
        setSaving(false);
        return;
      }

      // Insert packages
      for (const pkg of editingGig.gig_packages) {
        await supabase.from("gig_packages").insert({
          gig_id: data.id,
          tier: pkg.tier,
          name: pkg.name,
          price: pkg.price,
          delivery_days: pkg.delivery_days,
          features: pkg.features,
          sort_order: pkg.sort_order,
          image_url: pkg.image_url || "",
        });
      }

      toast.success("Gig created");
    }

    setSaving(false);
    setIsDialogOpen(false);
    fetchGigs();
  }

  async function toggleActive(gig: GigWithPackages) {
    const { error } = await supabase
      .from("gigs")
      .update({ is_active: !gig.is_active })
      .eq("id", gig.id);

    if (error) {
      toast.error("Failed to update gig");
    } else {
      setGigs((prev) =>
        prev.map((g) =>
          g.id === gig.id ? { ...g, is_active: !g.is_active } : g
        )
      );
      toast.success(gig.is_active ? "Gig deactivated" : "Gig activated");
    }
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin")}
              className="mb-2 -ml-2 gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Manage Gigs</h1>
            <p className="text-muted-foreground">
              Add, edit, or deactivate services in your gig catalog
            </p>
          </div>
          <Button onClick={openNewGig} className="rounded-full gap-2">
            <Plus className="w-4 h-4" />
            New Gig
          </Button>
        </div>

        <div className="grid gap-4">
          {gigs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">No gigs yet</p>
                <Button onClick={openNewGig} className="rounded-full">
                  Create your first gig
                </Button>
              </CardContent>
            </Card>
          ) : (
            gigs.map((gig, index) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card
                  className={`transition-opacity ${
                    !gig.is_active ? "opacity-50" : ""
                  }`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${PLATFORM_COLORS[gig.platform] || "#888"}15`,
                        }}
                      >
                        <span
                          className="text-xs font-bold"
                          style={{ color: PLATFORM_COLORS[gig.platform] || "#888" }}
                        >
                          {PLATFORM_LABELS[gig.platform]?.slice(0, 2) || gig.platform.slice(0, 2)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{gig.title}</h3>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${PLATFORM_COLORS[gig.platform] || "#888"}15`,
                              color: PLATFORM_COLORS[gig.platform] || "#888",
                            }}
                          >
                            {PLATFORM_LABELS[gig.platform] || gig.platform}
                          </span>
                          {!gig.is_active && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {gig.short_description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>From ${gig.starting_price}</span>
                          <span>{gig.delivery_days}d delivery</span>
                          <span>{gig.gig_packages?.length || 0} packages</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Switch
                          checked={gig.is_active}
                          onCheckedChange={() => toggleActive(gig)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditGig(gig)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Edit / Create Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingGig?.id ? "Edit Gig" : "New Gig"}
              </DialogTitle>
            </DialogHeader>

            {editingGig && (
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Basic Info
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Title</Label>
                      <Input
                        value={editingGig.title}
                        onChange={(e) =>
                          setEditingGig({
                            ...editingGig,
                            title: e.target.value,
                            slug: editingGig.slug || generateSlug(e.target.value),
                          })
                        }
                        placeholder="e.g. YouTube Subscribers"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug</Label>
                      <Input
                        value={editingGig.slug}
                        onChange={(e) =>
                          setEditingGig({ ...editingGig, slug: e.target.value })
                        }
                        placeholder="youtube-subscribers"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select
                        value={editingGig.platform}
                        onValueChange={(value) =>
                          setEditingGig({ ...editingGig, platform: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLATFORMS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {PLATFORM_LABELS[p]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Short Description</Label>
                      <Input
                        value={editingGig.short_description}
                        onChange={(e) =>
                          setEditingGig({
                            ...editingGig,
                            short_description: e.target.value,
                          })
                        }
                        placeholder="One-line pitch shown on the card"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Full Description</Label>
                      <Textarea
                        value={editingGig.full_description}
                        onChange={(e) =>
                          setEditingGig({
                            ...editingGig,
                            full_description: e.target.value,
                          })
                        }
                        placeholder="Detailed description for the gig page (supports line breaks)"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Starting Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingGig.starting_price}
                        onChange={(e) =>
                          setEditingGig({
                            ...editingGig,
                            starting_price: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery Days</Label>
                      <Input
                        type="number"
                        min="1"
                        value={editingGig.delivery_days}
                        onChange={(e) =>
                          setEditingGig({
                            ...editingGig,
                            delivery_days: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Cover Image (optional)</Label>
                      <ImageUpload
                        value={editingGig.cover_image_url}
                        onChange={(url) =>
                          setEditingGig({ ...editingGig, cover_image_url: url })
                        }
                        folder="covers"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Packages */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Packages ({editingGig.gig_packages.length})
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPackage}
                      className="gap-1 h-8"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Package
                    </Button>
                  </div>
                  {editingGig.gig_packages.map((pkg, i) => (
                    <Card key={pkg.id || `new-${i}`} className="border-dashed">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between gap-2">
                          <span className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                pkg.tier === "basic"
                                  ? "bg-blue-500"
                                  : pkg.tier === "standard"
                                  ? "bg-yellow-500"
                                  : pkg.tier === "premium"
                                  ? "bg-purple-500"
                                  : "bg-primary"
                              }`}
                            />
                            <span className="truncate">Package {i + 1}</span>
                          </span>
                          {editingGig.gig_packages.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePackage(i)}
                              className="h-7 px-2 text-destructive hover:text-destructive gap-1 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </Button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Name</Label>
                            <Input
                              value={pkg.name}
                              onChange={(e) => updatePackage(i, "name", e.target.value)}
                              placeholder="e.g. 1K Views"
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Tier tag</Label>
                            <Input
                              value={pkg.tier}
                              onChange={(e) =>
                                updatePackage(i, "tier", e.target.value.trim().toLowerCase())
                              }
                              placeholder="basic / views-1k"
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Price ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={pkg.price}
                              onChange={(e) =>
                                updatePackage(i, "price", parseFloat(e.target.value) || 0)
                              }
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Delivery (days)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={pkg.delivery_days}
                              onChange={(e) =>
                                updatePackage(i, "delivery_days", parseInt(e.target.value) || 1)
                              }
                              className="h-8"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <ImagePlus className="w-3 h-3" />
                            Package image (optional)
                          </Label>
                          <ImageUpload
                            value={pkg.image_url || ""}
                            onChange={(url) => updatePackage(i, "image_url", url)}
                            folder="packages"
                            placeholder="/gigs/views-1k.jpg or https://..."
                            small
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Features (one per line)</Label>
                          <Textarea
                            value={(pkg.features || []).join("\n")}
                            onChange={(e) =>
                              updatePackage(
                                i,
                                "features",
                                e.target.value.split("\n").filter(Boolean)
                              )
                            }
                            rows={3}
                            className="text-sm resize-none"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Save */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveGig}
                    disabled={saving}
                    className="rounded-full gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingGig.id ? "Save Changes" : "Create Gig"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
