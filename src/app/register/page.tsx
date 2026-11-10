"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaUserPlus, FaArrowRight, FaCheck } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
];

function RegisterContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState(PRESET_AVATARS[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation rule:
    // Must have uppercase, lowercase, length >= 6
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasValidLength = password.length >= 6;

    if (!hasValidLength) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!hasUpperCase) {
      toast.error("Password must contain at least one uppercase letter (A-Z).");
      return;
    }
    if (!hasLowerCase) {
      toast.error("Password must contain at least one lowercase letter (a-z).");
      return;
    }

    setLoading(true);
    const success = await register(name.trim(), email.trim(), password, photoURL);
    setLoading(false);

    if (success) {
      router.push("/");
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const success = await loginWithGoogle();
    setLoading(false);
    if (success) {
      router.push("/");
    }
  };

  // Live password checklist
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasValidLength = password.length >= 6;

  return (
    <div className="min-h-[85vh] py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-stone-800/40 dark:bg-[#1c140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#c85a32]/20 border border-[#c85a32]/30 flex items-center justify-center mx-auto text-[#f59e0b] shadow-md text-xl">
            <FaUserPlus />
          </div>
          <h1 className="text-3xl font-extrabold font-serif tracking-tight text-white dark:text-[#f8f5ee] light:text-[#281a13]">
            Join Kindred
          </h1>
          <p className="text-xs text-stone-400 dark:text-[#bdaea2] light:text-[#5f4e43]">
            Create a volunteer profile to launch and participate in social service drives
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                <FaUser />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Samiul Hasan"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-sm focus:outline-none focus:border-[#c85a32]"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                <FaEnvelope />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="samiul@example.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-sm focus:outline-none focus:border-[#c85a32]"
              />
            </div>
          </div>

          {/* photoURL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-1.5">
              Photo URL
            </label>
            <div className="relative mb-2">
              <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                <FaCamera />
              </span>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-sm focus:outline-none focus:border-[#c85a32]"
              />
            </div>
            {/* Quick avatar selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-400">Presets:</span>
              <div className="flex items-center gap-1.5">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoURL(url)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      photoURL === url ? "border-[#c85a32] scale-110" : "border-stone-600 opacity-60"
                    }`}
                    style={{ backgroundImage: `url(${url})`, backgroundSize: "cover" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-1.5">
              Password *
            </label>
            <div className="relative mb-2">
              <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                <FaLock />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-sm focus:outline-none focus:border-[#c85a32]"
              />
            </div>

            {/* Live Password Rules Indicator */}
            <div className="p-3 rounded-xl bg-stone-900/40 dark:bg-black/30 light:bg-stone-100 space-y-1 text-[11px]">
              <div className={`flex items-center gap-1.5 ${hasValidLength ? "text-emerald-400" : "text-stone-400"}`}>
                <FaCheck className={`text-xs ${hasValidLength ? "opacity-100" : "opacity-40"}`} />
                <span>At least 6 characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUpperCase ? "text-emerald-400" : "text-stone-400"}`}>
                <FaCheck className={`text-xs ${hasUpperCase ? "opacity-100" : "opacity-40"}`} />
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasLowerCase ? "text-emerald-400" : "text-stone-400"}`}>
                <FaCheck className={`text-xs ${hasLowerCase ? "opacity-100" : "opacity-40"}`} />
                <span>At least one lowercase letter (a-z)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#c85a32] hover:bg-[#b24c26] text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Create Account <FaArrowRight className="text-xs" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center">
          <div className="grow border-t border-stone-800 dark:border-amber-950/30 light:border-stone-200" />
          <span className="shrink mx-4 text-stone-400 text-xs font-bold uppercase tracking-widest">OR</span>
          <div className="grow border-t border-stone-800 dark:border-amber-950/30 light:border-stone-200" />
        </div>

        {/* Google Signup */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-stone-800/80 dark:bg-[#201813] light:bg-stone-100 hover:bg-stone-700/80 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-stone-200 dark:text-stone-200 light:text-stone-800 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-stone-400 dark:text-[#bdaea2] light:text-[#5f4e43]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#e2764a] font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#c85a32] border-t-transparent animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
