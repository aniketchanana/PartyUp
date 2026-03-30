"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Cake, Heart, Baby, Sparkles, ArrowLeft } from "lucide-react";

export type TemplateType = "birthday" | "marriage" | "baby-shower" | "new-baby";

const templates: {
  id: TemplateType;
  label: string;
  icon: React.ElementType;
  colors: string;
  description: string;
}[] = [
  {
    id: "birthday",
    label: "Birthday Party",
    icon: Cake,
    colors: "from-party-pink to-party-orange",
    description: "Fun balloons, confetti, and cake vibes",
  },
  {
    id: "marriage",
    label: "Marriage",
    icon: Heart,
    colors: "from-party-pink to-party-purple",
    description: "Elegant florals and romantic animations",
  },
  {
    id: "baby-shower",
    label: "Baby Shower",
    icon: Baby,
    colors: "from-party-blue to-party-green",
    description: "Soft pastels with gentle floating effects",
  },
  {
    id: "new-baby",
    label: "New Baby Party",
    icon: Sparkles,
    colors: "from-party-yellow to-party-pink",
    description: "Warm and tender celebration theme",
  },
];

export function TemplatePicker({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: TemplateType | null;
  onSelect: (t: TemplateType) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl">
          Choose a Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {templates.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`relative rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
                selected === t.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {selected === t.id && (
                <motion.div
                  layoutId="template-check"
                  className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.div>
              )}
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br ${t.colors}`}
              >
                <t.icon className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-heading font-semibold">{t.label}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {t.description}
              </p>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!selected}
            className="flex-1 party-gradient text-white font-semibold"
          >
            Next: Gift Registry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
