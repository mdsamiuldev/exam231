"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEnvelope, FaLock, FaSignInAlt, FaArrowRight } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    const success = await login(email.trim(), password);
    setLoading(false);

    if (success) {
      router.push(redirectUrl);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const success = await loginWithGoogle();
    setLoading(false);
    if (success) {
      router.push(redirectUrl);
    }
  };

  return (
    <div className="min-h-[80vh] py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-stone-800/40 dark:bg-[#1c140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#c85a32]/20 border border-[#c85a32]/30 flex items-center justify-center mx-auto text-[#f59e0b] shadow-md text-xl">
            <FaSignInAlt />
          </div>
          <h1 className="text-3xl font-extrabold font-serif tracking-tight text-white dark:text-[#f8f5ee] light:text-[#281a13]">
            Welcome Back
          </h1>
          <p className="text-xs text-stone-400 dark:text-[#bdaea2] light:text-[#5f4e43]">
            Sign in to coordinate community events and manage initiatives
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                <FaEnvelope />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="volunteer@example.com"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-sm focus:outline-none focus:border-[#c85a32]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-2">
              Password
            </label>
            <div className="relative">
              <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                <FaLock />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-sm focus:outline-none focus:border-[#c85a32]"
              />
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
                Sign In <FaArrowRight className="text-xs" />
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

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-stone-800/80 dark:bg-[#201813] light:bg-stone-100 hover:bg-stone-700/80 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-stone-200 dark:text-stone-200 light:text-stone-800 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-stone-400 dark:text-[#bdaea2] light:text-[#5f4e43]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#e2764a] font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#c85a32] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
