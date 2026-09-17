"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Megaphone,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
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
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type Announcement,
  ANNOUNCEMENT_TYPES,
  TYPE_STYLES,
} from "@/lib/announcement-types";

const EMPTY: Omit<Announcement, "id" | "created_at" | "updated_at"> = {
  title: "",
  message: "",
  type: "info",
  link_url: null,
  link_label: null,
  is_active: true,
  sort_order: 0,
};

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<(Partial<Announcement> & { id?: string }) | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("sort_order");

    if (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } else {
      setItems((data as Announcement[]) || []);
    }
    setLoading(false);
  }

  function openNew() {
    setEditing({ ...EMPTY });
    setIsDialogOpen(true);
  }

  function openEdit(item: Announcement) {
    setEditing({ ...item });
    setIsDialogOpen(true);
  }

  async function save() {
    if (!editing) return;
    if (!editing.title?.trim() || !editing.message?.trim()) {
      toast.error("Title and message are required");
      return;
    }

    setSaving(true);
    const payload = {
      title: editing.title,
      message: editing.message,
      type: editing.type || "info",
      link_url: editing.link_url || null,
      link_label: editing.link_label || null,
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order ?? 0,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase
        .from("announcements")
        .update(payload)
        .eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("announcements").insert(payload));
    }

    if (error) {
      console.error("Save error:", error);
      toast.error("Failed to save announcement");
    } else {
      toast.success("Announcement saved");
      setIsDialogOpen(false);
      fetchItems();
    }
    setSaving(false);
  }

  async function toggleActive(item: Announcement) {
    const { error } = await supabase
      .from("announcements")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      setItems((prev) =>
        prev.map((a) =>
          a.id === item.id ? { ...a, is_active: !a.is_active } : a
        )
      );
      toast.success(item.is_active ? "Hidden from site" : "Now live on site");
    }
  }

  async function remove(item: Announcement) {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      setItems((prev) => prev.filter((a) => a.id !== item.id));
      toast.success("Announcement deleted");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
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
            <h1 className="text-3xl font-bold">Announcements & Offers</h1>
            <p className="text-muted-foreground">
              Post ads, offers and updates — they appear instantly at the top of the site
            </p>
          </div>
          <Button onClick={openNew} className="rounded-full gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        <div className="grid gap-4">
          {items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Megaphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">No announcements yet</p>
                <Button onClick={openNew} className="rounded-full">
                  Create your first announcement
                </Button>
              </CardContent>
            </Card>
          ) : (
            items.map((item, index) => {
              const style = TYPE_STYLES[item.type] || TYPE_STYLES.info;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className={`transition-opacity ${!item.is_active ? "opacity-50" : ""}`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${style.bg} border ${style.border}`}>
                          <span className="text-lg">{style.icon}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold truncate">{item.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                              {style.label}
                            </span>
                            {!item.is_active && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.message}
                          </p>
                          {item.link_url && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              🔗 {item.link_label || item.link_url}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Switch
                            checked={item.is_active}
                            onCheckedChange={() => toggleActive(item)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => remove(item)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Edit / Create Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing?.id ? "Edit Announcement" : "New Announcement"}
              </DialogTitle>
            </DialogHeader>

            {editing && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2 col-span-2">
                    <Label>Title *</Label>
                    <Input
                      value={editing.title || ""}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="e.g. Summer Sale"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={editing.type || "info"}
                      onValueChange={(value) =>
                        setEditing({ ...editing, type: value as Announcement["type"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ANNOUNCEMENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {TYPE_STYLES[t].icon} {TYPE_STYLES[t].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Message *</Label>
                  <Textarea
                    value={editing.message || ""}
                    onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                    placeholder="e.g. Get 20% off all YouTube packages this week!"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Link URL (optional)</Label>
                    <Input
                      value={editing.link_url || ""}
                      onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                      placeholder="https://... or /order"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link Label</Label>
                    <Input
                      value={editing.link_label || ""}
                      onChange={(e) => setEditing({ ...editing, link_label: e.target.value })}
                      placeholder="Learn more"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-end">
                  <div className="space-y-2">
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={editing.sort_order ?? 0}
                      onChange={(e) =>
                        setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower = shown first. Only the first active one displays on site.
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="active-switch">Live on site</Label>
                    <Switch
                      id="active-switch"
                      checked={editing.is_active ?? true}
                      onCheckedChange={(checked) =>
                        setEditing({ ...editing, is_active: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
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
                    {editing.id ? "Save Changes" : "Publish"}
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
