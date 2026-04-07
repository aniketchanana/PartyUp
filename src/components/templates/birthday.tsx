"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, User } from "lucide-react";
import type { Invite } from "@/lib/firestore/invites";

function Balloon({ x, color, delay }: { x: string; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute bottom-0"
      style={{ left: x }}
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: -40, opacity: 1 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="48" height="64" viewBox="0 0 48 64" fill="none">
          <ellipse cx="24" cy="22" rx="20" ry="22" fill={color} />
          <ellipse cx="24" cy="22" rx="20" ry="22" fill="white" fillOpacity="0.15" />
          <ellipse
            cx="18"
            cy="14"
            rx="5"
            ry="7"
            fill="white"
            fillOpacity="0.3"
            transform="rotate(-15 18 14)"
          />
          <polygon points="24,44 21,48 27,48" fill={color} />
          <line x1="24" y1="48" x2="24" y2="64" stroke={color} strokeWidth="1" opacity="0.6" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

interface ConfettiData {
  x: number;
  color: string;
  rotation: number;
  size: number;
  direction: number;
  drift: number;
  duration: number;
}

const confettiColors = ["#f472b6", "#a78bfa", "#fb923c", "#facc15", "#34d399", "#60a5fa"];

function seededRandom(seed: number) {
  const s = Math.sin(seed * 9301 + 49297) * 49297;
  return s - Math.floor(s);
}

const confettiData: ConfettiData[] = Array.from({ length: 30 }, (_, i) => ({
  x: seededRandom(i * 7 + 1) * 100,
  color: confettiColors[Math.floor(seededRandom(i * 13 + 3) * confettiColors.length)],
  rotation: seededRandom(i * 17 + 5) * 360,
  size: 4 + seededRandom(i * 23 + 7) * 6,
  direction: seededRandom(i * 31 + 11) > 0.5 ? 1 : -1,
  drift: (seededRandom(i * 37 + 13) - 0.5) * 200,
  duration: 3 + seededRandom(i * 41 + 17) * 2,
}));

function Confetti({ delay, data }: { delay: number; data: ConfettiData }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${data.x}%`, top: -10 }}
      initial={{ y: -20, opacity: 1, rotate: data.rotation }}
      animate={{
        y: 600,
        opacity: 0,
        rotate: data.rotation + 360 * data.direction,
        x: data.drift,
      }}
      transition={{ duration: data.duration, delay, ease: "easeIn" }}
    >
      <div
        style={{
          width: data.size,
          height: data.size * 1.5,
          background: data.color,
          borderRadius: 1,
        }}
      />
    </motion.div>
  );
}

export function BirthdayTemplate({ invite, onRsvp }: { invite: Invite; onRsvp: () => void }) {
  const balloonColors = ["#f472b6", "#a78bfa", "#fb923c", "#facc15", "#34d399"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-fuchsia-50 via-amber-50 to-orange-50">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confettiData.map((data, i) => (
          <Confetti key={i} delay={0.5 + i * 0.1} data={data} />
        ))}
      </div>

      {/* Balloons */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full overflow-hidden">
        {balloonColors.map((color, i) => (
          <Balloon key={i} x={`${10 + i * 20}%`} color={color} delay={0.3 + i * 0.2} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
          className="mb-4 text-7xl"
        >
          🎂
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-heading bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-center text-4xl font-extrabold text-transparent sm:text-5xl md:text-6xl"
        >
          {invite.heading}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col items-center gap-3 text-gray-600"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 shadow-sm backdrop-blur-sm">
            <User className="h-4 w-4 text-pink-500" />
            <span className="font-medium">Hosted by {invite.hostName}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 shadow-sm backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>{format(invite.dateTime, "EEEE, MMMM do yyyy 'at' h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 shadow-sm backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span>{invite.location}</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRsvp}
          className="mt-10 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-pink-500/25 transition-shadow hover:shadow-2xl hover:shadow-pink-500/30"
        >
          RSVP Now 🎉
        </motion.button>
      </div>
    </div>
  );
}
