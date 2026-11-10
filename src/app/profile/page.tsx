"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaCheckCircle,
  FaTasks,
  FaHandsHelping,
  FaSave,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ created: 0, joined: 0 });

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view your profile.");
      router.push("/login?redirect=/profile");
    }
  }, [user, authLoading, router]);

  const userEmail = user?.email;

  // Fetch stats with cancellation
  useEffect(() => {
    if (!userEmail) return;
    const activeEmail = userEmail;
    let ignore = false;

    async function fetchStats() {
      try {
        const [createdRes, joinedRes] = await Promise.all([
          fetch(`/api/events?creatorEmail=${encodeURIComponent(activeEmail)}`),
          fetch(`/api/joined-events?email=${encodeURIComponent(activeEmail)}`),
        ]);
        const createdData = await createdRes.json();
        const joinedData = await joinedRes.json();

        if (!ignore) {
          setStats({
            created: Array.isArray(createdData) ? createdData.length : 0,
            joined: Array.isArray(joinedData) ? joinedData.length : 0,
          });
        }
      } catch {
        // ignore
      }
    }

    fetchStats();
    return () => {
      ignore = true;
    };
  }, [userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setSaving(true);
    await updateUserProfile(name, photoURL);
    setSaving(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-stone-900 dark:bg-[#16100c] light:bg-[#faf7f2] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#c85a32] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 dark:bg-[#16100c] light:bg-[#faf7f2] text-stone-100 dark:text-[#f3ede6] light:text-[#231710] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="rounded-3xl bg-stone-800/40 dark:bg-[#1c140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-800 dark:border-amber-950/30 light:border-stone-200">
            {/* Avatar Preview */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#c85a32] shadow-xl bg-stone-900 shrink-0">
              {photoURL ? (
                <Image
                  src={photoURL}
                  alt={name || "Avatar"}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-[#c85a32] text-white">
                  {name.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#c85a32]/20 text-[#f59e0b] text-[11px] font-bold uppercase tracking-wider">
                <FaHandsHelping /> Volunteer Member
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white dark:text-[#f8f5ee] light:text-[#281a13]">
                {user.name}
              </h1>
              <p className="text-sm text-stone-400 dark:text-[#baa89c] light:text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
                <FaEnvelope className="text-[#e2764a]" /> {user.email}
              </p>
            </div>
          </div>

          {/* Stats Counters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-900/50 dark:bg-black/30 light:bg-stone-50 border border-stone-800 dark:border-amber-950/40 light:border-stone-200 text-center space-y-1">
              <div className="text-3xl font-extrabold text-[#f59e0b] font-serif">{stats.created}</div>
              <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <FaTasks className="text-[#e2764a] text-xs" /> Events Created
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-900/50 dark:bg-black/30 light:bg-stone-50 border border-stone-800 dark:border-amber-950/40 light:border-stone-200 text-center space-y-1">
              <div className="text-3xl font-extrabold text-emerald-400 font-serif">{stats.joined}</div>
              <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <FaCheckCircle className="text-emerald-400 text-xs" /> Events Joined
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <h3 className="text-lg font-bold font-serif flex items-center gap-2">
              <FaUser className="text-[#e2764a]" /> Edit Profile Information
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-sm focus:border-[#c85a32] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-2">
                Profile Picture URL
              </label>
              <div className="relative mb-3">
                <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                  <FaCamera />
                </span>
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-sm focus:border-[#c85a32] focus:outline-none"
                />
              </div>

              {/* Preset Avatars */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-stone-400">Quick avatars:</span>
                <div className="flex items-center gap-2">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoURL(url)}
                      className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        photoURL === url ? "border-[#c85a32] scale-110" : "border-stone-700 hover:border-stone-500"
                      }`}
                    >
                      <Image src={url} alt={`Preset ${i}`} fill className="object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-[#c85a32] hover:bg-[#b24c26] text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <FaSave className="text-xs" /> Save Profile Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
