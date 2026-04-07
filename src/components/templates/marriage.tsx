"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, Heart } from "lucide-react";
import type { Invite } from "@/lib/firestore/invites";

function FloatingHeart({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, bottom: "-20px" }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: -800, opacity: [0, 0.6, 0.6, 0] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: "easeOut" }}
    >
      <Heart
        className="text-rose-300/50"
        style={{ width: size, height: size }}
        fill="currentColor"
      />
    </motion.div>
  );
}

function FloralCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClass = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 -scale-x-100",
    bl: "bottom-0 left-0 -scale-y-100",
    br: "bottom-0 right-0 -scale-x-100 -scale-y-100",
  }[position];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`absolute ${posClass} pointer-events-none`}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <path d="M0 0 Q60 10 40 60 Q20 40 0 30Z" fill="#fda4af" fillOpacity="0.3" />
        <path d="M0 0 Q30 40 70 30 Q40 20 20 0Z" fill="#fb7185" fillOpacity="0.2" />
        <circle cx="35" cy="25" r="4" fill="#f43f5e" fillOpacity="0.4" />
        <circle cx="20" cy="40" r="3" fill="#f43f5e" fillOpacity="0.3" />
        <circle cx="50" cy="15" r="2.5" fill="#fda4af" fillOpacity="0.5" />
      </svg>
    </motion.div>
  );
}

export function MarriageTemplate({ invite, onRsvp }: { invite: Invite; onRsvp: () => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-rose-50 via-pink-50 to-amber-50">
      {/* Floating hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[14, 24, 18, 22, 16, 26, 20, 15].map((size, i) => (
          <FloatingHeart key={i} delay={i * 1.2} x={`${10 + i * 12}%`} size={size} />
        ))}
      </div>

      {/* Floral corners */}
      <FloralCorner position="tl" />
      <FloralCorner position="tr" />
      <FloralCorner position="bl" />
      <FloralCorner position="br" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-medium tracking-[0.3em] text-rose-400 uppercase"
        >
          You Are Cordially Invited
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
          className="my-4"
        >
          <Heart className="h-8 w-8 text-rose-400" fill="currentColor" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="font-heading text-center text-4xl font-extrabold text-rose-900 sm:text-5xl md:text-6xl"
        >
          {invite.heading}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-6 h-px w-48 bg-linear-to-r from-transparent via-rose-300 to-transparent"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-4 font-medium text-rose-700/80 italic"
        >
          Hosted by {invite.hostName}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-rose-700">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{format(invite.dateTime, "EEEE, MMMM do yyyy")}</span>
          </div>
          <div className="text-lg font-semibold text-rose-600">
            {format(invite.dateTime, "h:mm a")}
          </div>
          <div className="flex items-center gap-2 text-rose-700">
            <MapPin className="h-4 w-4" />
            <span>{invite.location}</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRsvp}
          className="mt-10 rounded-full border-2 border-rose-400 bg-white/80 px-10 py-4 text-lg font-bold text-rose-600 shadow-lg backdrop-blur-sm transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-xl"
        >
          RSVP with Love
        </motion.button>
      </div>
    </div>
  );
}
