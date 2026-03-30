"use client";

import { useState } from "react";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { RsvpDialog } from "@/components/guest/rsvp-dialog";
import type { Invite } from "@/lib/firestore/invites";

interface SerializedInvite {
  id: string;
  hostId: string;
  location: string;
  dateTime: string;
  heading: string;
  hostName: string;
  templateType: "birthday" | "marriage" | "baby-shower" | "new-baby";
  createdAt: string;
}

export function InviteClient({ invite: raw }: { invite: SerializedInvite }) {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  const invite: Invite = {
    ...raw,
    dateTime: new Date(raw.dateTime),
    createdAt: new Date(raw.createdAt),
  };

  return (
    <>
      <TemplateRenderer invite={invite} onRsvp={() => setRsvpOpen(true)} />
      <RsvpDialog
        inviteId={invite.id}
        open={rsvpOpen}
        onOpenChange={setRsvpOpen}
      />
    </>
  );
}
