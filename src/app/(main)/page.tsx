"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/auth/auth-form";
import { motion } from "framer-motion";
import { PartyPopper, Sparkles, Gift, Users } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <PartyPopper className="h-10 w-10 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-party-pink/20 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-party-purple/20 blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-party-orange/15 blur-3xl"
            animate={{ x: [0, 25, 0], y: [0, -35, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Hero + Auth side-by-side */}
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: branding + tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl party-gradient shadow-lg shadow-primary/25 lg:mx-0"
            >
              <PartyPopper className="h-10 w-10 text-white" />
            </motion.div>

            <h1 className="font-heading text-5xl font-extrabold tracking-tight sm:text-6xl">
              <span className="bg-linear-to-r from-party-pink via-party-purple to-party-blue bg-clip-text text-transparent">
                PartyUp
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 max-w-md text-lg text-muted-foreground sm:text-xl"
            >
              Create stunning animated invitations, track RSVPs, and manage gift
              registries — all in one place.
            </motion.p>

            {/* Inline feature list */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col gap-3"
            >
              {[
                { icon: Sparkles, text: "Beautiful animated invite templates" },
                { icon: Users, text: "Real-time RSVP tracking with guest counts" },
                { icon: Gift, text: "Gift registry — claimed gifts stay hidden" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 text-sm text-muted-foreground lg:text-base"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  {item.text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: auth form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-sm shrink-0"
          >
            <AuthForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
