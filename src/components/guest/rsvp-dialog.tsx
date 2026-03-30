"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { claimGifts, getAvailableGifts, type Gift } from "@/lib/firestore/gifts";
import { createRSVP } from "@/lib/firestore/rsvps";
import { Loader2, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GiftSelector } from "./gift-selector";

export function RsvpDialog({
  inviteId,
  open,
  onOpenChange,
}: {
  inviteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loadingGifts, setLoadingGifts] = useState(true);
  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [pax, setPax] = useState(1);
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingGifts(true);
    getAvailableGifts(inviteId).then((g) => {
      setGifts(g);
      setLoadingGifts(false);
    });
  }, [inviteId, open]);

  function toggleGift(id: string) {
    setSelectedGiftIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    try {
      if (selectedGiftIds.length > 0) {
        const claimName = anonymous ? "Anonymous" : name.trim();
        await claimGifts(inviteId, selectedGiftIds, claimName);
      }

      await createRSVP(inviteId, name.trim(), pax);
      setSubmitted(true);
      toast.success("RSVP submitted! See you at the party!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      if (message.includes("already claimed")) {
        toast.error("One or more gifts were just claimed. Please re-select.");
        const fresh = await getAvailableGifts(inviteId);
        setGifts(fresh);
        setSelectedGiftIds([]);
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    onOpenChange(false);
    if (submitted) {
      setName("");
      setPax(1);
      setAnonymous(false);
      setSelectedGiftIds([]);
      setSubmitted(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <PartyPopper className="h-16 w-16 text-primary mb-4" />
            <DialogTitle className="font-heading text-2xl font-bold mb-2">
              You&apos;re In!
            </DialogTitle>
            <p className="text-muted-foreground">
              Thanks for RSVPing. We can&apos;t wait to see you!
            </p>
            <Button
              className="mt-6 party-gradient text-white font-semibold"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl font-bold">
                RSVP
              </DialogTitle>
              <DialogDescription>
                Let the host know you&apos;re coming!
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              {/* Gift selection */}
              {loadingGifts ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                gifts.length > 0 && (
                  <>
                    <GiftSelector
                      gifts={gifts}
                      selectedIds={selectedGiftIds}
                      onToggle={toggleGift}
                    />
                    <Separator />
                  </>
                )
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="guest-name">Your Name</Label>
                <Input
                  id="guest-name"
                  placeholder="Aniket Chanana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Anonymous checkbox */}
              {selectedGiftIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="anonymous"
                    checked={anonymous}
                    onCheckedChange={(c) => setAnonymous(c === true)}
                  />
                  <Label htmlFor="anonymous" className="font-normal text-sm">
                    Keep my name anonymous for the gift (surprise!)
                  </Label>
                </div>
              )}

              {/* Pax */}
              <div className="space-y-2">
                <Label htmlFor="pax">Number of Guests (including you)</Label>
                <Input
                  id="pax"
                  type="number"
                  min={1}
                  max={20}
                  value={pax}
                  onChange={(e) => setPax(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={submitting || !name.trim()}
                className="w-full party-gradient text-white font-semibold"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit RSVP"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
