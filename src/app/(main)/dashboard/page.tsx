"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { InviteList } from "@/components/dashboard/invite-list";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, LogOut, PartyPopper, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg party-gradient">
              <PartyPopper className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading text-xl font-bold bg-linear-to-r from-party-pink to-party-purple bg-clip-text text-transparent">
              PartyUp
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-1.5 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="font-heading text-3xl font-bold">Your Invites</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your party invitations
            </p>
          </div>
          <Link href="/dashboard/create" className={cn(buttonVariants(), "party-gradient text-white font-semibold shadow-md")}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create Invite
          </Link>
        </motion.div>

        <InviteList />
      </main>
    </div>
  );
}
