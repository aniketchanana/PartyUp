"use client";

import type { Invite } from "@/lib/firestore/invites";
import { BirthdayTemplate } from "./birthday";
import { MarriageTemplate } from "./marriage";
import { BabyShowerTemplate } from "./baby-shower";
import { NewBabyTemplate } from "./new-baby";

const templateMap: Record<string, React.ComponentType<{ invite: Invite; onRsvp: () => void }>> = {
  birthday: BirthdayTemplate,
  marriage: MarriageTemplate,
  "baby-shower": BabyShowerTemplate,
  "new-baby": NewBabyTemplate,
};

export function TemplateRenderer({ invite, onRsvp }: { invite: Invite; onRsvp: () => void }) {
  const Component = templateMap[invite.templateType] ?? BirthdayTemplate;
  return <Component invite={invite} onRsvp={onRsvp} />;
}
