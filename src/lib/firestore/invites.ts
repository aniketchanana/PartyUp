import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Invite {
  id: string;
  hostId: string;
  location: string;
  dateTime: Date;
  heading: string;
  hostName: string;
  templateType: "birthday" | "marriage" | "baby-shower" | "new-baby";
  createdAt: Date;
}

export interface InviteFormData {
  location: string;
  dateTime: Date;
  heading: string;
  hostName: string;
  templateType: "birthday" | "marriage" | "baby-shower" | "new-baby";
}

const COLLECTION = "invites";

export async function createInvite(
  hostId: string,
  data: InviteFormData
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    hostId,
    location: data.location,
    dateTime: Timestamp.fromDate(data.dateTime),
    heading: data.heading,
    hostName: data.hostName,
    templateType: data.templateType,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getInvite(inviteId: string): Promise<Invite | null> {
  const snap = await getDoc(doc(db, COLLECTION, inviteId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: snap.id,
    hostId: d.hostId,
    location: d.location,
    dateTime: d.dateTime.toDate(),
    heading: d.heading,
    hostName: d.hostName,
    templateType: d.templateType,
    createdAt: d.createdAt.toDate(),
  };
}

export async function getInvitesByHost(hostId: string): Promise<Invite[]> {
  const q = query(
    collection(db, COLLECTION),
    where("hostId", "==", hostId)
  );
  const snap = await getDocs(q);
  const invites = snap.docs.map((s) => {
    const d = s.data();
    return {
      id: s.id,
      hostId: d.hostId,
      location: d.location,
      dateTime: d.dateTime.toDate(),
      heading: d.heading,
      hostName: d.hostName,
      templateType: d.templateType,
      createdAt: d.createdAt.toDate(),
    };
  });
  return invites.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function deleteInvite(inviteId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, inviteId));
}
