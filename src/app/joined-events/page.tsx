"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaArrowRight,
  FaCheckCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface JoinedRecord {
  _id: string;
  eventId: string;
  userEmail: string;
  userName: string;
  joinedAt: string;
  event: {
    _id: string;
    title: string;
    description: string;
    eventType: string;
    category: string;
    thumbnail: string;
    location: string;
    date: string;
    attendees?: number;
  };
}

export default function JoinedEventsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState<JoinedRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Private route guard
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view your joined events.");
      router.push("/login?redirect=/joined-events");
    }
  }, [user, authLoading, router]);

  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) return;
    const activeEmail = userEmail;
    let ignore = false;

    async function loadJoinedEvents() {
      try {
        const res = await fetch(`/api/joined-events?email=${encodeURIComponent(activeEmail)}`);
        const data = await res.json();
        if (!ignore && Array.isArray(data)) {
          setJoinedEvents(data);
        }
      } catch (err) {
        console.error("Failed to load joined events", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadJoinedEvents();
    return () => {
      ignore = true;
    };
  }, [userEmail]);

  const handleCancelParticipation = async (eventId: string, title: string) => {
    if (!user?.email) return;

    try {
      const res = await fetch(`/api/events/${eventId}/join?email=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel participation");
      }

      setJoinedEvents((prev) => prev.filter((item) => item.eventId !== eventId));
      toast.success(`Cancelled participation for "${title}"`);
    } catch {
      toast.error("Could not cancel participation.");
    }
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
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#291710] via-[#21120c] to-[#160c08] dark:from-[#21120c] dark:to-[#130b07] light:from-[#f3ede4] light:to-[#fcfaf7] border border-stone-800/80 dark:border-amber-950/40 light:border-stone-300 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <FaCheckCircle className="text-xs" /> Volunteer Log
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white dark:text-[#f8f5ee] light:text-[#281a13] mb-3">
            My Joined Initiatives
          </h1>
          <p className="text-stone-300 dark:text-[#c4b6ab] light:text-[#5c493d] max-w-2xl mx-auto text-sm sm:text-base">
            Keep track of all the community drives and social welfare activities you have committed to attend, sorted chronologically by event date.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-stone-800/40 dark:bg-[#1b140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 overflow-hidden animate-pulse h-96 p-6 flex flex-col justify-between"
              >
                <div className="w-full h-44 bg-stone-700/40 rounded-2xl" />
                <div className="space-y-2">
                  <div className="w-1/2 h-5 bg-stone-700/40 rounded-md" />
                  <div className="w-3/4 h-5 bg-stone-700/40 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : joinedEvents.length === 0 ? (
          <div className="text-center py-20 bg-stone-800/30 dark:bg-[#1a120d] light:bg-white rounded-3xl border border-stone-800 dark:border-amber-950/40 light:border-stone-200 p-8 max-w-xl mx-auto shadow-xl">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold font-serif mb-2">No Joined Events Yet</h3>
            <p className="text-stone-400 dark:text-[#baa89c] light:text-stone-600 mb-6 text-sm leading-relaxed">
              You haven&apos;t joined any social initiatives yet. Browse upcoming winter clothes distributions, blanket drives, or blood camps to make an impact.
            </p>
            <Link
              href="/events"
              className="px-6 py-3 rounded-xl bg-[#c85a32] text-white font-bold text-sm inline-flex items-center gap-2"
            >
              Explore Upcoming Events <FaArrowRight className="text-xs" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {joinedEvents.map((record) => {
              const event = record.event || {};
              const eventId = record.eventId || event._id;

              return (
                <div
                  key={record._id}
                  className="rounded-3xl bg-stone-800/40 dark:bg-[#1c140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 overflow-hidden shadow-xl flex flex-col justify-between hover:border-[#c85a32]/50 transition-all"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                      <Image
                        src={event.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"}
                        alt={event.title || "Event image"}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#f59e0b]">
                          <FaTag className="text-[10px]" /> {event.eventType || event.category || "Community Service"}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold backdrop-blur-md border border-emerald-500/40">
                          <FaCheckCircle className="text-xs" /> Registered Volunteer
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold font-serif leading-snug line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-stone-400 dark:text-[#baa89c] light:text-[#5f4e43] text-sm line-clamp-2">
                        {event.description}
                      </p>

                      <div className="pt-2 space-y-2 text-xs text-stone-300 dark:text-[#d3c6bb] light:text-[#423329]">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-[#e2764a] shrink-0" />
                          <span className="font-medium">
                            {event.date
                              ? new Date(event.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Date to be confirmed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-rose-400 shrink-0" />
                          <span className="font-medium truncate">{event.location || "Dhaka, Bangladesh"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex items-center gap-3">
                    <Link
                      href={`/events/${eventId}`}
                      className="grow py-3 px-4 rounded-xl bg-stone-800 dark:bg-[#251b14] light:bg-stone-100 hover:bg-[#c85a32] text-stone-200 dark:text-stone-200 light:text-stone-800 hover:text-white font-semibold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      View Details <FaArrowRight className="text-xs" />
                    </Link>

                    <button
                      onClick={() => handleCancelParticipation(eventId, event.title)}
                      className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                      title="Cancel Participation"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
