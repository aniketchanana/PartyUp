import { collection, addDoc, getDocs, Timestamp, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface RSVP {
  id: string;
  guestName: string;
  pax: number;
  timestamp: Date;
}

function rsvpsRef(inviteId: string) {
  return collection(db, "invites", inviteId, "rsvps");
}

export async function createRSVP(
  inviteId: string,
  guestName: string,
  pax: number,
): Promise<string> {
  const docRef = await addDoc(rsvpsRef(inviteId), {
    guestName,
    pax,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
}

export async function getRSVPs(inviteId: string): Promise<RSVP[]> {
  const q = query(rsvpsRef(inviteId), orderBy("timestamp", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((s) => {
    const d = s.data();
    return {
      id: s.id,
      guestName: d.guestName,
      pax: d.pax,
      timestamp: d.timestamp.toDate(),
    };
  });
}
