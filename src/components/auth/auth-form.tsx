"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AuthForm() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm border shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Button
            type="button"
            className="party-gradient w-full font-semibold text-white"
            disabled={loading}
            onClick={handleGoogle}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
              </>
            )}
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Sign in to create and manage your party invitations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
