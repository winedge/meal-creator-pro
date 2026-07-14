import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminAuth() {
  const nav = useNavigate();
  const { session, isAdmin, loading } = useAdminAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) nav("/admin", { replace: true });
  }, [session, isAdmin, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen aurora-bg flex items-center justify-center p-4 overflow-hidden">
      {/* Floating color orbs behind the glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-70 animate-floaty"
        style={{ background: "radial-gradient(circle, hsla(220,95%,60%,0.55), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-70 animate-floaty-2"
        style={{ background: "radial-gradient(circle, hsla(4,90%,55%,0.5), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-1/4 h-72 w-72 rounded-full blur-3xl opacity-60 animate-floaty"
        style={{ background: "radial-gradient(circle, hsla(38,90%,55%,0.5), transparent 70%)" }}
      />

      <div className="relative w-full max-w-md rounded-2xl glass-card p-8 animate-hero-in">
        <Link
          to="/"
          className="text-xs uppercase tracking-widest text-navy/70 hover:text-navy transition-colors"
        >
          ← Back to site
        </Link>
        <h1 className="mt-4 font-serif text-2xl font-black text-navy">Medinjury Admin</h1>
        <p className="mt-1 text-sm text-navy/70">
          {mode === "signin"
            ? "Sign in to manage submissions."
            : "Create an admin account. The first account becomes admin automatically."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-navy">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/60 border-white/70 backdrop-blur-md focus-visible:ring-navy/30"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-navy">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/60 border-white/70 backdrop-blur-md focus-visible:ring-navy/30"
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-navy hover:bg-navy-deep text-primary-foreground transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        {mode === "signup" && (
          <button
            onClick={() => setMode("signin")}
            className="mt-4 w-full text-xs text-navy/70 hover:text-navy transition-colors"
          >
            Already have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}
