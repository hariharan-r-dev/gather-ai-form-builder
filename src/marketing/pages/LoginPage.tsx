import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth, useUIState } from "../../app/AppProvider";
import MarketingNavbar from "../components/MarketingNavbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setIsSignedIn, pendingCreatePrompt, setPendingCreatePrompt } = useAuth();
  const { setGeneratePrompt } = useUIState();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInErr) throw signInErr;

      setIsSignedIn(true);

      // Check if there was a pending prompt from marketing hero
      let savedPrompt = pendingCreatePrompt;
      if (!savedPrompt) {
        try {
          savedPrompt = localStorage.getItem("gather_pending_prompt");
        } catch {}
      }

      if (savedPrompt) {
        setGeneratePrompt(savedPrompt);
        setPendingCreatePrompt(null);
        try {
          localStorage.removeItem("gather_pending_prompt");
        } catch {}
        navigate("/app/applications/generating");
      } else {
        navigate("/app");
      }
    } catch (err: any) {
      console.error("[Auth] Login error:", err);
      const msg = err?.message || "Invalid email or password.";
      if (msg.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password. If you haven't registered this email yet, click 'Create an account' below.");
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 flex items-center justify-center pt-28 pb-16 px-5 sm:px-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                G
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0F172A]">Gather</span>
            </Link>
            <h1 className="text-2xl font-bold text-[#0F172A]">Welcome back</h1>
            <p className="text-xs text-[#64748B] mt-1">Sign in to your Gather workspace</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all placeholder:text-[#94A3B8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all placeholder:text-[#94A3B8]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] text-white text-xs font-semibold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#F1F5F9] text-center text-xs text-[#64748B]">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-[#2563EB] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
