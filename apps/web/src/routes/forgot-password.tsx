/**
 * Forgot Password Page
 *
 * Allows users to request a password reset email.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/stores/auth-store";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // better-auth uses forgetPassword for the password reset request flow
      await (authClient as any).forgetPassword({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSubmitted(true);
      toast.success("Password reset email sent!");
    } catch {
      // Even if the API call fails, show success to prevent email enumeration
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-6">
            If an account exists for <strong>{email}</strong>, we've sent a
            password reset link.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-4"
          >
            <ArrowLeft className="mr-1 size-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="inline-flex items-center font-medium text-primary underline underline-offset-4"
            >
              <ArrowLeft className="mr-1 size-4" />
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
