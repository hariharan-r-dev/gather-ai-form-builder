import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  defaultMode?: "signin" | "signup";
}

export default function AuthModal({ onClose, onSuccess, defaultMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "signin") {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInErr) {
          throw signInErr;
        }
      } else {
        const namePart = email.split("@")[0] || "User";
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const { error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: formattedName,
              full_name: formattedName,
            },
          },
        });

        if (signUpErr) {
          throw signUpErr;
        }
      }

      onSuccess();
    } catch (err: any) {
      console.error("[Auth] Authentication error:", err);
      const msg = err?.message || "Authentication failed. Please check your credentials.";
      if (msg.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password. If you don't have an account yet, click 'Sign up' below.");
      } else if (msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("network") || msg.toLowerCase().includes("err_name_not_resolved")) {
        setError("Unable to reach the Supabase backend. Please check your internet connection or verify your Supabase project status.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            {mode === "signin"
              ? "Sign in to continue with Gather."
              : "Start building applications with AI."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#0F172A] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-[#94A3B8]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0F172A] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder:text-[#94A3B8]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            {loading ? "Processing..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs text-[#64748B] mt-4">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setError(null);
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            className="text-[#2563EB] hover:underline font-medium cursor-pointer"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
