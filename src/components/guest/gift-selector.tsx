"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Gift } from "@/lib/firestore/gifts";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Gift as GiftIcon } from "lucide-react";

export function GiftSelector({
  gifts,
  selectedIds,
  onToggle,
}: {
  gifts: Gift[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  if (gifts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <GiftIcon className="text-primary h-4 w-4" />
        <h4 className="font-heading text-base font-semibold sm:text-sm">
          Pick a Gift <span className="text-muted-foreground font-normal">(optional)</span>
        </h4>
      </div>
      <div
        className={cn(
          "space-y-2",
          // Mobile: no inner scroll — one scroll on the dialog (taller sheet, less jank)
          "max-sm:overflow-visible",
          // Tablet/desktop modal: keep a capped list with its own scroll
          "sm:max-h-48 sm:overflow-y-auto sm:pr-1",
        )}
      >
        <AnimatePresence>
          {gifts.map((gift, i) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "hover:bg-muted/50 flex items-center gap-3 rounded-xl border p-3.5 transition-colors sm:rounded-lg sm:p-3",
              )}
            >
              <div className={cn("flex min-w-0 flex-1 items-center gap-3")}>
                <Checkbox
                  id={`gift-${gift.id}`}
                  checked={selectedIds.includes(gift.id)}
                  onCheckedChange={() => onToggle(gift.id)}
                  disabled={gift.isClaimed}
                />
                <div className="min-w-0 flex-1">
                  <Label
                    htmlFor={`gift-${gift.id}`}
                    className={cn(
                      "font-normal",
                      gift.isClaimed
                        ? "text-muted-foreground cursor-default line-through"
                        : "cursor-pointer",
                    )}
                  >
                    {gift.itemName}
                  </Label>
                  {gift.link && (
                    <a
                      href={gift.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "mt-0.5 flex items-center gap-1 truncate text-xs",
                        gift.isClaimed
                          ? "text-muted-foreground cursor-default line-through"
                          : "text-primary hover:underline",
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      <span className="truncate">View product</span>
                    </a>
                  )}
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  gift.isClaimed
                    ? "text-party-green border-party-green line-through"
                    : "text-party-pink border-party-pink",
                )}
              >
                Available
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
