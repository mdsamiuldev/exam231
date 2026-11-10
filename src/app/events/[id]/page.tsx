"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaUsers,
  FaArrowLeft,
  FaCheckCircle,
  FaShareAlt,
  FaUser,
  FaShieldAlt,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  category: string;
  thumbnail: string;
  location: string;
  date: string;
  creatorEmail: string;
  creatorName: string;
  attendees: number;
}

function EventDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    async function fetchEventData() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) {
          throw new Error("Event not found");
        }
        const data = await res.json();
        if (!ignore) {
          setEvent(data);
        }

        // Check if current logged in user has joined
        if (user?.email) {
          const joinCheck = await fetch(`/api/events/${id}/join?email=${encodeURIComponent(user.email)}`);
          if (joinCheck.ok) {
            const joinData = await joinCheck.json();
            if (!ignore) {
              setHasJoined(Boolean(joinData.hasJoined));
            }
          }
        }
      } catch {
        if (!ignore) {
          setError("Event could not be found or loaded.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchEventData();
    return () => {
      ignore = true;
    };
  }, [id, user?.email]);

  const handleJoin = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login first to join this social event!");
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    if (!id || hasJoined) return;
    setJoining(true);

    try {
      const res = await fetch(`/api/events/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to join event");
        return;
      }

      setHasJoined(true);
      if (event) {
        setEvent({
          ...event,
          attendees: data.attendees ?? (event.attendees || 0) + 1,
        });
      }
      toast.success("Successfully registered! You have joined this community event.");
    } catch {
      toast.error("Network error while trying to join event.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!user || !id) return;
    try {
      const res = await fetch(`/api/events/${id}/join?email=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHasJoined(false);
        if (event) {
          setEvent({
            ...event,
            attendees: Math.max(0, (event.attendees || 1) - 1),
          });
        }
        toast.success("You have cancelled your participation.");
      }
    } catch {
      toast.error("Failed to update participation.");
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Event link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard unavailable
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 dark:bg-[#16100c] light:bg-[#faf7f2] text-stone-100 dark:text-[#f3ede6] light:text-[#231710] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-stone-400 dark:text-[#bcae9f] light:text-stone-600 hover:text-white dark:hover:text-[#f8f5ee] light:hover:text-stone-900 text-sm font-semibold transition-colors cursor-pointer"
          >
            <FaArrowLeft className="text-xs text-[#e2764a]" /> Back to All Events
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-stone-800/80 dark:bg-[#201712] light:bg-white border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-[#c85a32]"
          >
            <FaShareAlt className="text-xs text-[#e2764a]" /> {copied ? "Copied!" : "Share Event"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-[#c85a32] border-t-transparent animate-spin" />
          </div>
        ) : error || !event ? (
          <div className="text-center py-20 bg-stone-800/40 dark:bg-[#1b140f] light:bg-white border border-stone-800 dark:border-amber-950/40 light:border-stone-200 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold font-serif mb-2">Event Not Found</h3>
            <p className="text-stone-400 dark:text-[#baa89c] light:text-stone-600 mb-6 text-sm">{error || "The event could not be found."}</p>
            <Link
              href="/events"
              className="px-6 py-3 rounded-xl bg-[#c85a32] text-white font-bold text-sm inline-block"
            >
              Browse All Events
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl bg-stone-800/40 dark:bg-[#1c140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 shadow-2xl overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-stone-900">
              <Image
                src={event.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"}
                alt={event.title}
                fill
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#f59e0b] shadow-md">
                  <FaTag className="text-[10px]" /> {event.eventType || event.category}
                </span>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Quick Details Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 sm:p-8 border-b border-stone-800/80 dark:border-amber-950/30 light:border-stone-200 bg-stone-900/40 dark:bg-[#150f0b]/60 light:bg-[#f6f2ea]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c85a32]/20 flex items-center justify-center text-[#e2764a]">
                  <FaCalendarAlt />
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 dark:text-[#a89b90] light:text-stone-500 font-semibold uppercase tracking-wider">Date & Time</div>
                  <div className="text-xs sm:text-sm font-bold">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 dark:text-[#a89b90] light:text-stone-500 font-semibold uppercase tracking-wider">Location</div>
                  <div className="text-xs sm:text-sm font-bold truncate max-w-[180px]">{event.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FaUsers />
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 dark:text-[#a89b90] light:text-stone-500 font-semibold uppercase tracking-wider">Volunteers</div>
                  <div className="text-xs sm:text-sm font-bold">{event.attendees || 1} people participating</div>
                </div>
              </div>
            </div>

            {/* Description & Action Section */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Event Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-serif flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-[#c85a32] rounded-full inline-block" />
                  Initiative Overview
                </h3>
                <p className="text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] leading-relaxed text-sm sm:text-base whitespace-pre-line bg-stone-900/30 dark:bg-[#150f0b]/40 light:bg-stone-50 p-6 rounded-2xl border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200">
                  {event.description}
                </p>
              </div>

              {/* Organizer Card */}
              <div className="p-5 rounded-2xl bg-stone-900/40 dark:bg-[#17100c] light:bg-[#f9f6f0] border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c85a32]/20 flex items-center justify-center text-[#e2764a]">
                    <FaUser />
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 dark:text-[#a89b90] light:text-stone-500">Organized By</div>
                    <div className="text-sm font-bold">{event.creatorName || "Community Member"}</div>
                    <div className="text-[11px] text-stone-400 dark:text-stone-400 light:text-stone-500">{event.creatorEmail}</div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <FaShieldAlt /> Verified Organizer
                </div>
              </div>

              {/* Join Action Card */}
              <div className="rounded-3xl bg-gradient-to-r from-[#291710] via-[#21120c] to-[#160c08] dark:from-[#21120c] dark:to-[#130b07] light:from-[#f3ede4] light:to-[#fcfaf7] border border-stone-800/80 dark:border-amber-950/40 light:border-stone-300 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h4 className="text-lg font-bold font-serif text-white dark:text-[#f8f5ee] light:text-[#281a13] mb-1">
                    {hasJoined ? "You are registered as a volunteer!" : "Ready to take part in this cause?"}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 dark:text-[#c4b6ab] light:text-[#5c493d]">
                    {hasJoined
                      ? "Thank you for volunteering! Assemble at the venue 15 minutes before the scheduled time."
                      : user
                      ? "Click below to secure your volunteer spot and receive logistical updates."
                      : "Login to your account to sign up as a volunteer for this initiative."}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {hasJoined ? (
                    <div className="flex items-center gap-3">
                      <span className="px-5 py-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-xs sm:text-sm font-bold flex items-center gap-2">
                        <FaCheckCircle /> Joined
                      </span>
                      <button
                        onClick={handleLeave}
                        className="text-xs text-stone-400 hover:text-rose-400 underline transition-colors cursor-pointer"
                      >
                        Leave Event
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleJoin}
                      disabled={joining}
                      className="px-8 py-3.5 rounded-xl bg-[#c85a32] hover:bg-[#b24c26] text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {joining ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <FaUsers /> Join Event
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-900 dark:bg-[#16100c] light:bg-[#faf7f2] flex justify-center items-center py-24">
          <div className="w-10 h-10 rounded-full border-2 border-[#c85a32] border-t-transparent animate-spin" />
        </div>
      }
    >
      <EventDetailContent />
    </Suspense>
  );
}
