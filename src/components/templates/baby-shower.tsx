"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, User } from "lucide-react";
import type { Invite } from "@/lib/firestore/invites";

function Cloud({ x, y, scale, delay }: { x: string; y: string; scale: number; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 0.6, x: 0 }}
      transition={{ delay, duration: 1.5 }}
    >
      <motion.div
        animate={{ x: [-8, 8, -8] }}
        transition={{ duration: 6 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width={120 * scale}
          height={50 * scale}
          viewBox="0 0 120 50"
          fill="white"
        >
          <ellipse cx="60" cy="35" rx="50" ry="15" />
          <ellipse cx="40" cy="25" rx="25" ry="20" />
          <ellipse cx="75" cy="28" rx="20" ry="15" />
          <ellipse cx="55" cy="20" rx="18" ry="15" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function Star({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute text-yellow-300"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 3 }}
    >
      ✦
    </motion.div>
  );
}

const starPositions = [
  { x: "12%", y: "15%" }, { x: "45%", y: "22%" }, { x: "78%", y: "18%" },
  { x: "25%", y: "42%" }, { x: "63%", y: "35%" }, { x: "88%", y: "48%" },
  { x: "35%", y: "58%" }, { x: "52%", y: "12%" }, { x: "70%", y: "62%" },
  { x: "18%", y: "68%" },
];

export function BabyShowerTemplate({
  invite,
  onRsvp,
}: {
  invite: Invite;
  onRsvp: () => void;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-sky-100 via-blue-50 to-teal-50">
      {/* Clouds */}
      <div className="pointer-events-none absolute inset-0">
        <Cloud x="5%" y="10%" scale={1} delay={0} />
        <Cloud x="60%" y="5%" scale={0.8} delay={0.3} />
        <Cloud x="30%" y="20%" scale={0.6} delay={0.6} />
        <Cloud x="75%" y="18%" scale={0.7} delay={0.4} />
      </div>

      {/* Stars */}
      <div className="pointer-events-none absolute inset-0">
        {starPositions.map((pos, i) => (
          <Star key={i} x={pos.x} y={pos.y} delay={i * 0.5} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
          className="text-7xl mb-2"
        >
          🍼
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm uppercase tracking-[0.25em] text-sky-400 font-medium mb-2"
        >
          You&apos;re Invited to a
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="font-heading text-4xl font-extrabold text-center sm:text-5xl md:text-6xl text-sky-900"
        >
          {invite.heading}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 rounded-2xl bg-white/70 backdrop-blur-sm p-6 shadow-lg max-w-sm w-full space-y-3"
        >
          <div className="flex items-center gap-3 text-sky-700">
            <User className="h-5 w-5 text-sky-400" />
            <span className="font-medium">Hosted by {invite.hostName}</span>
          </div>
          <div className="flex items-center gap-3 text-sky-700">
            <Calendar className="h-5 w-5 text-sky-400" />
            <span>
              {format(invite.dateTime, "EEEE, MMMM do yyyy 'at' h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sky-700">
            <MapPin className="h-5 w-5 text-sky-400" />
            <span>{invite.location}</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRsvp}
          className="mt-8 rounded-full bg-linear-to-r from-sky-400 to-teal-400 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-sky-400/25 transition-shadow hover:shadow-2xl"
        >
          RSVP Now 🎀
        </motion.button>
      </div>
    </div>
  );
}
