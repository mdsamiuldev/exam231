"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaArrowRight,
  FaUsers,
  FaSearch,
  FaFilter,
  FaHandsHelping,
} from "react-icons/fa";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  category: string;
  thumbnail: string;
  location: string;
  date: string;
  attendees: number;
}

const CATEGORIES = [
  "All",
  "Winter Relief",
  "Donation",
  "Plantation",
  "Community Health",
  "Cleanup",
  "Education",
  "Food Drive",
];

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchUpcomingEvents() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          upcomingOnly: "true",
        });

        if (selectedCategory !== "All") {
          queryParams.set("category", selectedCategory);
        }

        if (searchQuery.trim()) {
          queryParams.set("search", searchQuery.trim());
        }

        const res = await fetch(`/api/events?${queryParams.toString()}`);
        const data = await res.json();
        if (!ignore && Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    const debounce = setTimeout(() => {
      fetchUpcomingEvents();
    }, 250);

    return () => {
      ignore = true;
      clearTimeout(debounce);
    };
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-900 dark:bg-[#16100c] light:bg-[#faf7f2] text-stone-100 dark:text-[#f3ede6] light:text-[#231710] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#291710] via-[#21120c] to-[#160c08] dark:from-[#21120c] dark:to-[#130b07] light:from-[#f3ede4] light:to-[#fcfaf7] border border-stone-800/80 dark:border-amber-950/40 light:border-stone-300 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c85a32]/20 text-[#f59e0b] text-xs font-bold uppercase tracking-wider mb-3">
            <FaHandsHelping className="text-xs" /> Community Directory
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white dark:text-[#f8f5ee] light:text-[#281a13] mb-3">
            Upcoming Social Events
          </h1>
          <p className="text-stone-300 dark:text-[#c4b6ab] light:text-[#5c493d] max-w-2xl mx-auto text-sm sm:text-base">
            Discover scheduled community action projects across Mirpur, Mohammadpur, Dhanmondi, and Uttara. Every upcoming event has verified dates and welcome volunteers.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <FaSearch className="text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event title, location, or tag..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-800/60 dark:bg-[#1d1612] light:bg-white border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-stone-100 dark:text-stone-100 light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-[#c85a32] text-sm shadow-sm"
              />
            </div>

            {/* Quick Actions */}
            <Link
              href="/create-event"
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-[#c85a32] hover:bg-[#b24c26] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              Organize New Event <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 mr-1 shrink-0">
              <FaFilter className="text-[#e2764a] text-xs" /> Filter:
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#c85a32] text-white shadow-md"
                    : "bg-stone-800/50 dark:bg-[#1f1712] light:bg-white text-stone-300 dark:text-[#c4b6ab] light:text-[#524136] border border-stone-700/60 dark:border-amber-950/40 light:border-stone-300 hover:border-[#c85a32]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-stone-800/40 dark:bg-[#1b140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 overflow-hidden animate-pulse h-[460px] flex flex-col justify-between p-6"
              >
                <div className="w-full h-48 bg-stone-700/40 rounded-2xl mb-4" />
                <div className="space-y-3">
                  <div className="w-1/3 h-6 bg-stone-700/40 rounded-full" />
                  <div className="w-3/4 h-6 bg-stone-700/40 rounded-md" />
                  <div className="w-full h-12 bg-stone-700/40 rounded-md" />
                </div>
                <div className="w-full h-12 bg-stone-700/40 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-stone-800/30 dark:bg-[#1a120d] light:bg-white rounded-3xl border border-stone-800 dark:border-amber-950/40 light:border-stone-200 p-8 max-w-xl mx-auto shadow-xl">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold font-serif mb-2">No Matching Events Found</h3>
            <p className="text-stone-400 dark:text-[#baa89c] light:text-stone-600 mb-6 text-sm leading-relaxed">
              We couldn&apos;t find any upcoming initiatives matching your current category filter or search keywords.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 rounded-xl bg-stone-800 dark:bg-[#251b14] light:bg-stone-200 text-xs font-semibold hover:border-[#c85a32] border border-stone-700 cursor-pointer"
              >
                Clear Filters
              </button>
              <Link
                href="/create-event"
                className="px-6 py-2.5 rounded-xl bg-[#c85a32] text-white text-xs font-bold"
              >
                Create Event
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="rounded-3xl bg-stone-800/40 dark:bg-[#1c140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 overflow-hidden shadow-xl hover:border-[#c85a32]/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-stone-900">
                    <Image
                      src={event.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#f59e0b] shadow-md">
                        <FaTag className="text-[10px]" /> {event.eventType || event.category}
                      </span>
                    </div>

                    {/* Attendees Counter */}
                    <div className="absolute bottom-3 right-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-stone-200">
                        <FaUsers className="text-emerald-400 text-xs" /> {event.attendees || 1} volunteers
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold font-serif leading-snug group-hover:text-[#e2764a] transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-stone-400 dark:text-[#baa89c] light:text-[#5f4e43] text-sm line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Meta Information */}
                    <div className="pt-3 space-y-2 text-xs text-stone-300 dark:text-[#d3c6bb] light:text-[#423329]">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#e2764a] shrink-0" />
                        <span className="font-medium">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-rose-400 shrink-0" />
                        <span className="font-medium truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Event Button */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/events/${event._id}`}
                    className="w-full py-3.5 px-4 rounded-xl bg-stone-800 dark:bg-[#251b14] light:bg-stone-100 group-hover:bg-[#c85a32] text-stone-200 dark:text-stone-200 light:text-stone-800 group-hover:text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm border border-stone-700/60 dark:border-amber-950/40 light:border-stone-200 group-hover:border-transparent"
                  >
                    View Event <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
