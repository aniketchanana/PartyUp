"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getInvitesByHost, deleteInvite, type Invite } from "@/lib/firestore/invites";
import { getRSVPs, type RSVP } from "@/lib/firestore/rsvps";
import { getGifts, addGift, removeGift, type Gift } from "@/lib/firestore/gifts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
  Link2,
  Users,
  Gift as GiftIcon,
  Loader2,
  PartyPopper,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";

const templateLabels: Record<string, string> = {
  birthday: "Birthday Party",
  marriage: "Marriage",
  "baby-shower": "Baby Shower",
  "new-baby": "New Baby Party",
};

export function InviteList() {
  const { user } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getInvitesByHost(user.uid).then((data) => {
      setInvites(data);
      setLoading(false);
    });
  }, [user]);

  async function handleDelete(id: string) {
    try {
      await deleteInvite(id);
      setInvites((prev) => prev.filter((inv) => inv.id !== id));
      toast.success("Invite deleted");
    } catch {
      toast.error("Failed to delete invite");
    }
  }

  function copyLink(id: string) {
    const url = `${window.location.origin}/invite/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied!");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PartyPopper className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h3 className="font-heading text-xl font-semibold text-muted-foreground">
          No invites yet
        </h3>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Create your first party invite to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {invites.map((invite, i) => (
          <motion.div
            key={invite.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="font-heading text-lg truncate">
                      {invite.heading}
                    </CardTitle>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {invite.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(invite.dateTime, "PPp")}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {templateLabels[invite.templateType] ?? invite.templateType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyLink(invite.id)}
                  >
                    <Link2 className="mr-1.5 h-3.5 w-3.5" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpanded(expanded === invite.id ? null : invite.id)
                    }
                  >
                    {expanded === invite.id ? (
                      <ChevronUp className="mr-1.5 h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(invite.id)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>

                <AnimatePresence>
                  {expanded === invite.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <Separator className="my-4" />
                      <ExpandedDetails inviteId={invite.id} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ExpandedDetails({ inviteId }: { inviteId: string }) {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGiftName, setNewGiftName] = useState("");
  const [newGiftLink, setNewGiftLink] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    Promise.all([getRSVPs(inviteId), getGifts(inviteId)]).then(
      ([r, g]) => {
        setRsvps(r);
        setGifts(g);
        setLoading(false);
      }
    );
  }, [inviteId]);

  async function handleAddGift() {
    const name = newGiftName.trim();
    if (!name) return;
    setAdding(true);
    try {
      const id = await addGift(inviteId, name, newGiftLink.trim() || undefined);
      setGifts((prev) => [...prev, { id, itemName: name, link: newGiftLink.trim() || null, isClaimed: false, claimedBy: null }]);
      setNewGiftName("");
      setNewGiftLink("");
      toast.success(`"${name}" added to registry`);
    } catch {
      toast.error("Failed to add gift");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemoveGift(giftId: string, itemName: string) {
    try {
      await removeGift(inviteId, giftId);
      setGifts((prev) => prev.filter((g) => g.id !== giftId));
      toast.success(`"${itemName}" removed`);
    } catch {
      toast.error("Failed to remove gift");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalPax = rsvps.reduce((sum, r) => sum + r.pax, 0);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* RSVPs */}
      <div>
        <h4 className="flex items-center gap-2 font-heading text-sm font-semibold mb-3">
          <Users className="h-4 w-4 text-primary" />
          RSVPs ({rsvps.length} responses, {totalPax} guests)
        </h4>
        {rsvps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No RSVPs yet</p>
        ) : (
          <div className="space-y-2">
            {rsvps.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
              >
                <span className="font-medium">{r.guestName}</span>
                <Badge variant="outline">{r.pax} pax</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gifts */}
      <div>
        <h4 className="flex items-center gap-2 font-heading text-sm font-semibold mb-3">
          <GiftIcon className="h-4 w-4 text-primary" />
          Gift Registry ({gifts.filter((g) => g.isClaimed).length}/
          {gifts.length} claimed)
        </h4>

        {/* Add gift inputs */}
        <div className="space-y-2 mb-3 rounded-lg border p-2.5">
          <Input
            placeholder="Gift name..."
            value={newGiftName}
            onChange={(e) => setNewGiftName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddGift();
              }
            }}
            className="h-8 text-sm"
          />
          <Input
            placeholder="Product link (optional)"
            value={newGiftLink}
            onChange={(e) => setNewGiftLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddGift();
              }
            }}
            className="h-8 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddGift}
            disabled={!newGiftName.trim() || adding}
            className="w-full"
          >
            {adding ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="mr-1.5 h-3.5 w-3.5" />
            )}
            Add Gift
          </Button>
        </div>

        {gifts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No gifts added yet — add one above!</p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {gifts.map((g) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <span
                      className={
                        g.isClaimed ? "line-through text-muted-foreground" : ""
                      }
                    >
                      {g.itemName}
                    </span>
                    {g.link && (
                      <a
                        href={g.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5 truncate"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">{g.link}</span>
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {g.isClaimed ? (
                      <Badge variant="secondary" className="text-xs">
                        {g.claimedBy}
                      </Badge>
                    ) : (
                      <>
                        <Badge
                          variant="outline"
                          className="text-xs text-party-green border-party-green"
                        >
                          Available
                        </Badge>
                        <button
                          onClick={() => handleRemoveGift(g.id, g.itemName)}
                          className="rounded p-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
