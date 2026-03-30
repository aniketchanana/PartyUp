# PartyUp - Party Invite & RSVP App

Create stunning animated party invitations, track RSVPs, and manage gift registries.

## Tech Stack

- **Next.js 16.2** (App Router)
- **Firebase** (Auth + Firestore)
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** for animations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** > **Email/Password** sign-in method
3. Enable **Cloud Firestore** in production mode
4. Add the following Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /invites/{inviteId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.hostId == request.auth.uid;

      match /gifts/{giftId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update: if true;
        allow delete: if request.auth != null;
      }

      match /rsvps/{rsvpId} {
        allow read: if true;
        allow create: if true;
      }
    }
  }
}
```

## Features

- **Host Dashboard**: Create invites, track RSVPs, manage gift registries
- **4 Animated Templates**: Birthday, Marriage, Baby Shower, New Baby
- **Guest RSVP**: No auth required - view invite, claim gifts, submit RSVP
- **Gift Registry**: Claimed gifts hidden from future guests (Firestore transactions)
- **OG Tags**: Dynamic metadata for WhatsApp/social media link previews

## Routes

| Route | Description |
|-------|------------|
| `/` | Landing page with auth dialog |
| `/dashboard` | Host dashboard (protected) |
| `/dashboard/create` | Multi-step invite creation |
| `/invite/[id]` | Public guest invite view |
