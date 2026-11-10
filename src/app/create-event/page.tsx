"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaHeading,
  FaAlignLeft,
  FaPlusCircle,
  FaArrowRight,
  FaImage,
  FaHandsHelping,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const EVENT_TYPES = [
  "Winter Relief",
  "Donation",
  "Plantation",
  "Community Health",
  "Cleanup",
  "Education",
  "Food Drive",
];

const PRESET_THUMBNAILS = [
  {
    name: "Winter Relief",
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Blanket Drive",
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tree Plantation",
    url: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Blood Donation",
    url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Canal Cleanup",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Food Relief",
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
  },
];

export default function CreateEventPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Winter Relief");
  const [thumbnail, setThumbnail] = useState(PRESET_THUMBNAILS[0].url);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [minDateTime] = useState(() => new Date(Date.now() + 60000).toISOString().slice(0, 16));

  // Private route protection
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("You must be logged in to create an event.");
      router.push("/login?redirect=/create-event");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      toast.error("Please login to create an event.");
      router.push("/login");
      return;
    }

    // Validation
    if (!title.trim()) {
      setError("Event title is required.");
      toast.error("Event title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Event description is required.");
      toast.error("Event description is required.");
      return;
    }

    if (!location.trim()) {
      setError("Event location is required.");
      toast.error("Event location is required.");
      return;
    }

    if (!date) {
      setError("Please specify an event date and time.");
      toast.error("Please specify an event date.");
      return;
    }

    // Validate that date is strictly in the future
    const eventTime = new Date(date).getTime();
    if (isNaN(eventTime) || eventTime <= Date.now()) {
      const msg = "Event date must be in the future. Past dates cannot be added.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          thumbnail: thumbnail.trim() || PRESET_THUMBNAILS[0].url,
          location: location.trim(),
          date,
          creatorEmail: user.email,
          creatorName: user.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      toast.success("Event created successfully! Redirecting to upcoming events...");
      router.push("/events");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
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
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl bg-stone-800/40 dark:bg-[#1c140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 p-8 sm:p-12 shadow-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#c85a32]/20 border border-[#c85a32]/30 flex items-center justify-center mx-auto text-[#f59e0b] text-2xl shadow-md">
              <FaPlusCircle />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white dark:text-[#f8f5ee] light:text-[#281a13]">
              Organize a Social Event
            </h1>
            <p className="text-stone-400 dark:text-[#bdaea2] light:text-[#5f4e43] text-sm max-w-lg mx-auto">
              Mobilize community members for winter relief, blood donation camps, cleanups, and local tree plantation drives in Dhaka.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-2">
                Event Title *
              </label>
              <div className="relative">
                <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                  <FaHeading />
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-stone-100 dark:text-stone-100 light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-[#c85a32] text-sm"
                />
              </div>
            </div>

            {/* Event Type & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-2">
                  Event Type *
                </label>
                <div className="relative">
                  <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                    <FaTag />
                  </span>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-stone-100 dark:text-stone-100 light:text-stone-900 focus:outline-none focus:border-[#c85a32] text-sm"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-stone-900 text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-2">
                  Event Date & Time (Future Only) *
                </label>
                <div className="relative">
                  <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                    <FaCalendarAlt />
                  </span>
                  <input
                    type="datetime-local"
                    value={date}
                    min={minDateTime}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-stone-100 dark:text-stone-100 light:text-stone-900 focus:outline-none focus:border-[#c85a32] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-2">
                Event Location *
              </label>
              <div className="relative">
                <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                  <FaMapMarkerAlt />
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mohammadpur Town Hall, Dhaka"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-stone-100 dark:text-stone-100 light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-[#c85a32] text-sm"
                />
              </div>
            </div>

            {/* Thumbnail URL with Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329]">
                  Thumbnail Image URL *
                </label>
                <span className="text-[11px] text-stone-400">Choose preset or enter custom URL</span>
              </div>
              <div className="relative mb-3">
                <span className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                  <FaImage />
                </span>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-stone-100 dark:text-stone-100 light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-[#c85a32] text-sm"
                />
              </div>

              {/* Preset Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {PRESET_THUMBNAILS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setThumbnail(preset.url)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
                      thumbnail === preset.url
                        ? "bg-[#c85a32] text-white shadow-sm font-semibold"
                        : "bg-stone-800/60 dark:bg-[#201813] light:bg-stone-100 text-stone-300 dark:text-stone-300 light:text-stone-700 border border-stone-700/60 hover:border-[#c85a32]"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 dark:text-[#d3c6bb] light:text-[#423329] mb-2">
                Event Description *
              </label>
              <div className="relative">
                <span className="text-stone-400 absolute left-4 top-4 text-sm">
                  <FaAlignLeft />
                </span>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the mission, assembly point, supplies needed, and how volunteers can participate..."
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-900/50 dark:bg-black/40 light:bg-stone-50 border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-stone-100 dark:text-stone-100 light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-[#c85a32] text-sm"
                />
              </div>
            </div>

            {/* Creator Attribution Preview */}
            <div className="p-4 rounded-2xl bg-stone-900/30 dark:bg-black/20 light:bg-stone-100/60 border border-stone-800 dark:border-amber-950/30 light:border-stone-200 text-xs text-stone-400 flex items-center justify-between">
              <span>Creator Record: <strong className="text-white dark:text-white light:text-stone-900">{user.email}</strong></span>
              <span className="text-[#f59e0b] flex items-center gap-1 font-medium">
                <FaHandsHelping /> Authenticated Organizer
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#c85a32] hover:bg-[#b24c26] text-white font-bold text-base shadow-xl shadow-orange-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  Publish Event <FaArrowRight className="text-xs" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
