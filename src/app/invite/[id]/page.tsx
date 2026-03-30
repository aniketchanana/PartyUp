import type { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
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
    templateType: d.templateType as
      | "birthday"
      | "marriage"
      | "baby-shower"
      | "new-baby",
    createdAt: d.createdAt.toDate() as Date,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const invite = await fetchInvite(id);

  if (!invite) {
    return { title: "Invite Not Found" };
  }

  const dateStr = format(invite.dateTime, "EEEE, MMMM do yyyy 'at' h:mm a");

  return {
    title: invite.heading,
    description: `${invite.hostName} invites you! Join us at ${invite.location} on ${dateStr}`,
    openGraph: {
      title: invite.heading,
      description: `Hosted by ${invite.hostName} | ${invite.location} | ${dateStr}`,
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
          <h1 className="font-heading text-4xl font-bold text-muted-foreground">
            404
          </h1>
          <p className="mt-2 text-muted-foreground">
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
