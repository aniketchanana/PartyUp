import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Metadata } from "next";
import { InviteClient } from "./invite-client";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchInvite(id: string) {
  const snap = await getDoc(doc(db, "invites", id));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: snap.id,
    hostId: d.hostId as string,
    location: d.location as string,
    dateTime: d.dateTime.toDate() as Date,
    heading: d.heading as string,
    hostName: d.hostName as string,
    templateType: d.templateType as "birthday" | "marriage" | "baby-shower" | "new-baby",
    createdAt: d.createdAt.toDate() as Date,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const invite = await fetchInvite(id);

  if (!invite) {
    return { title: "Invite Not Found" };
  }

  return {
    title: invite.heading,
    description: `${invite.hostName} invites you! Join us at ${invite.location}`,
    openGraph: {
      title: invite.heading,
      description: `Hosted by ${invite.hostName} | ${invite.location}`,
      type: "website",
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { id } = await params;
  const invite = await fetchInvite(id);

  if (!invite) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-muted-foreground text-4xl font-bold">404</h1>
          <p className="text-muted-foreground mt-2">
            This invite doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const serialized = {
    ...invite,
    dateTime: invite.dateTime.toISOString(),
    createdAt: invite.createdAt.toISOString(),
  };

  return <InviteClient invite={serialized} />;
}
