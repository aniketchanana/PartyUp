"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, User } from "lucide-react";
import type { Invite } from "@/lib/firestore/invites";

function Footprint({ x, y, delay, rotation }: { x: string; y: string; delay: number; rotation: number }) {
  return (
    <motion.div
      className="absolute text-pink-200"
      style={{ left: x, top: y, transform: `rotate(${rotation}deg)` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.5, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
    >
      <svg width="24" height="32" viewBox="0 0 24 32" fill="currentColor">
        <ellipse cx="12" cy="18" rx="8" ry="12" />
        <circle cx="6" cy="4" r="3" />
        <circle cx="12" cy="2" r="2.5" />
        <circle cx="17" cy="4" r="2.5" />
        <circle cx="20" cy="8" r="2" />
      </svg>
    </motion.div>
  );
}

function FloatingBubble({ delay, x, size, duration }: { delay: number; x: string; size: number; duration: number }) {
  return (
    <motion.div
      className="absolute bottom-0 rounded-full bg-linear-to-t from-pink-200 to-yellow-100"
      style={{ left: x, width: size, height: size }}
      initial={{ y: 0, opacity: 0.6 }}
      animate={{ y: -600, opacity: [0.6, 0.4, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

const bubbleData = [
  { size: 14, duration: 7.2 }, { size: 22, duration: 8.5 }, { size: 10, duration: 6.8 },
  { size: 26, duration: 9.1 }, { size: 12, duration: 7.6 }, { size: 18, duration: 8.0 },
  { size: 20, duration: 6.3 }, { size: 15, duration: 9.4 }, { size: 24, duration: 7.0 },
  { size: 11, duration: 8.8 }, { size: 16, duration: 7.4 }, { size: 28, duration: 9.2 },
];

export function NewBabyTemplate({
  invite,
  onRsvp,
}: {
  invite: Invite;
  onRsvp: () => void;
}) {
  const footprints = [
    { x: "15%", y: "20%", delay: 0.5, rotation: -20 },
    { x: "25%", y: "35%", delay: 0.8, rotation: -15 },
    { x: "70%", y: "25%", delay: 0.6, rotation: 15 },
    { x: "80%", y: "45%", delay: 1.0, rotation: 20 },
    { x: "60%", y: "65%", delay: 1.2, rotation: 10 },
    { x: "20%", y: "70%", delay: 1.4, rotation: -10 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-amber-50 via-pink-50 to-rose-50">
      {/* Footprints */}
      <div className="pointer-events-none absolute inset-0">
        {footprints.map((fp, i) => (
          <Footprint key={i} {...fp} />
        ))}
      </div>

      {/* Floating bubbles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {bubbleData.map((b, i) => (
          <FloatingBubble
            key={i}
            delay={i * 0.8}
            x={`${5 + i * 8}%`}
            size={b.size}
            duration={b.duration}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.3 }}
          className="text-7xl mb-4"
        >
          👶
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm uppercase tracking-[0.25em] text-rose-400 font-medium"
        >
          Come Celebrate Our New Arrival
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-3 font-heading text-4xl font-extrabold text-center sm:text-5xl md:text-6xl bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent"
        >
          {invite.heading}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 h-px w-32 bg-linear-to-r from-transparent via-pink-300 to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-pink-100 p-6 shadow-sm max-w-sm w-full space-y-3"
        >
          <div className="flex items-center gap-3 text-rose-700">
            <User className="h-5 w-5 text-rose-400" />
            <span className="font-medium">Hosted by {invite.hostName}</span>
          </div>
          <div className="flex items-center gap-3 text-rose-700">
            <Calendar className="h-5 w-5 text-rose-400" />
            <span>
              {format(invite.dateTime, "EEEE, MMMM do yyyy 'at' h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-3 text-rose-700">
            <MapPin className="h-5 w-5 text-rose-400" />
            <span>{invite.location}</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRsvp}
          className="mt-8 rounded-full bg-linear-to-r from-rose-400 via-pink-400 to-amber-400 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-rose-400/25 transition-shadow hover:shadow-2xl"
        >
          RSVP Now 💕
        </motion.button>
      </div>
    </div>
  );
}
