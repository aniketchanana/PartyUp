"use client";

import type { Gift } from "@/lib/firestore/gifts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Gift as GiftIcon, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        <GiftIcon className="h-4 w-4 text-primary" />
        <h4 className="font-heading font-semibold text-sm">
          Pick a Gift{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </h4>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        <AnimatePresence>
          {gifts.map((gift, i) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <Checkbox
                id={`gift-${gift.id}`}
                checked={selectedIds.includes(gift.id)}
                onCheckedChange={() => onToggle(gift.id)}
              />
              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={`gift-${gift.id}`}
                  className="cursor-pointer font-normal"
                >
                  {gift.itemName}
                </Label>
                {gift.link && (
                  <a
                    href={gift.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5 truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">View product</span>
                  </a>
                )}
              </div>
              <Badge
                variant="outline"
                className="text-xs text-party-green border-party-green"
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
