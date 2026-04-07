"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowLeft, Gift, Loader2, ExternalLink } from "lucide-react";
import type { GiftInput } from "@/lib/firestore/gifts";

export function GiftAdder({
  gifts,
  onGiftsChange,
  onSubmit,
  onBack,
  submitting,
}: {
  gifts: GiftInput[];
  onGiftsChange: (g: GiftInput[]) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  function addGift() {
    const trimmed = name.trim();
    if (!trimmed || gifts.some((g) => g.name === trimmed)) return;
    onGiftsChange([...gifts, { name: trimmed, link: link.trim() }]);
    setName("");
    setLink("");
  }

  function removeGift(idx: number) {
    onGiftsChange(gifts.filter((_, i) => i !== idx));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2 text-xl">
          <Gift className="text-primary h-5 w-5" />
          Gift Registry
          <Badge variant="secondary" className="ml-auto font-normal">
            Optional
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Add gifts you&apos;d like guests to pick from. Claimed gifts will be hidden from other
          guests.
        </p>

        <div className="space-y-3 rounded-lg border p-3">
          <div className="space-y-1.5">
            <Label htmlFor="gift-name" className="text-xs font-medium">
              Gift Name
            </Label>
            <Input
              id="gift-name"
              placeholder="e.g. Kitchen Mixer, Photo Frame..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addGift();
                }
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gift-link" className="text-muted-foreground text-xs font-medium">
              Product Link <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Input
              id="gift-link"
              placeholder="https://amazon.com/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addGift();
                }
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addGift}
            disabled={!name.trim()}
            className="w-full"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Gift
          </Button>
        </div>

        {gifts.length > 0 && (
          <div className="space-y-2">
            <AnimatePresence>
              {gifts.map((g, i) => (
                <motion.div
                  key={g.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-muted/50 flex items-center gap-2 rounded-lg px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{g.name}</span>
                    {g.link && (
                      <a
                        href={g.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary mt-0.5 flex items-center gap-1 truncate text-xs hover:underline"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">{g.link}</span>
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGift(i)}
                    className="hover:bg-destructive/20 text-muted-foreground hover:text-destructive shrink-0 rounded-full p-1 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="party-gradient flex-1 font-semibold text-white"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : gifts.length > 0 ? (
              "Create Invite"
            ) : (
              "Skip & Create Invite"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
