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
  FaCheckCircle,
  FaHandsHelping,
  FaShieldAlt,
  FaChartLine,
  FaEnvelope,
  FaPaperPlane,
  FaPlay,
} from "react-icons/fa";
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
  attendees: number;
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchRecentUpcomingEvents() {
      try {
        const res = await fetch("/api/events?limit=6&upcomingOnly=true");
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

    fetchRecentUpcomingEvents();
    return () => {
      ignore = true;
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    toast.success("Thank you for subscribing to Kindred community bulletins!");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-stone-900 dark:bg-[#16100c] light:bg-[#faf7f2] text-stone-100 dark:text-[#f3ede6] light:text-[#231710] transition-colors duration-300">
      {/* 1. Hero / Banner Section - Inspired by the warm vintage design reference */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2b1912] via-[#21130d] to-[#150d09] dark:from-[#23140e] dark:via-[#1a0e0a] dark:to-[#120a07] light:from-[#f3ede4] light:via-[#faf6ef] light:to-[#faf7f2] text-white dark:text-[#fdfaf5] light:text-[#281a13] border-b border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 light:bg-stone-200/80 backdrop-blur-md border border-white/15 dark:border-amber-950/40 light:border-stone-300 text-[#f59e0b] dark:text-amber-300 light:text-[#c85a32] text-xs font-semibold uppercase tracking-wider">
                <FaHandsHelping className="text-sm text-[#f59e0b]" /> Community Action Platform • Dhaka
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-serif leading-[1.08]">
                Your community <br />
                impact <span className="text-[#f59e0b] underline decoration-[#c85a32]/60 decoration-wavy decoration-2">starts</span> with us today
              </h1>

              <p className="text-stone-300 dark:text-[#d3c6bb] light:text-[#534034] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
                Connect with local volunteers, mobilize winter relief drives in Mirpur, coordinate blanket distributions in Mohammadpur, and plant trees across Dhaka city parks.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/events"
                  className="px-8 py-4 rounded-2xl bg-[#c85a32] hover:bg-[#b34c26] text-white font-bold text-base shadow-xl shadow-orange-950/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5"
                >
                  Explore Upcoming Events <FaArrowRight className="text-xs" />
                </Link>
                <Link
                  href="/create-event"
                  className="px-8 py-4 rounded-2xl bg-white/10 dark:bg-white/5 light:bg-stone-200/90 hover:bg-white/20 dark:hover:bg-white/10 light:hover:bg-stone-300/80 border border-white/20 dark:border-amber-950/40 light:border-stone-300 font-bold text-base transition-all flex items-center gap-2"
                >
                  Organize an Event
                </Link>
              </div>

              {/* Stats & Badge row from reference image */}
              <div className="pt-8 border-t border-white/10 dark:border-amber-950/40 light:border-stone-300/80 grid grid-cols-2 sm:grid-cols-3 gap-6 items-center">
                <div className="flex items-center gap-4">
                  <div className="text-4xl sm:text-5xl font-extrabold text-[#f59e0b] font-serif">12k+</div>
                  <div className="text-xs text-stone-300 dark:text-[#baa89c] light:text-stone-600 leading-snug">
                    Lives touched across Dhaka initiatives
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-4xl sm:text-5xl font-extrabold text-[#e2764a] font-serif">480+</div>
                  <div className="text-xs text-stone-300 dark:text-[#baa89c] light:text-stone-600 leading-snug">
                    Community service events hosted
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                  {/* Circular Presentation Badge */}
                  <div className="relative w-14 h-14 rounded-full border border-dashed border-amber-400/60 flex items-center justify-center animate-spin-slow">
                    <FaPlay className="text-sm text-amber-400 ml-0.5" />
                  </div>
                  <div className="text-[11px] text-stone-400 dark:text-stone-400 light:text-stone-600 uppercase tracking-widest font-semibold">
                    Verified NGOs & Youth Teams
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 dark:border-amber-950/50 light:border-stone-300 shadow-2xl bg-stone-900/50">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                  alt="Volunteers organizing community relief in Dhaka"
                  width={600}
                  height={500}
                  className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                  priority
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

                {/* Floating banner on image */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-stone-900/80 dark:bg-[#1a120d]/90 light:bg-white/95 backdrop-blur-md border border-white/20 dark:border-amber-950/40 light:border-stone-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider">Active Drive</span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Now
                    </span>
                  </div>
                  <h4 className="font-bold text-white dark:text-[#f8f5ee] light:text-[#281a13] text-sm sm:text-base">
                    Winter Clothes Distribution – Mirpur 10
                  </h4>
                  <p className="text-xs text-stone-300 dark:text-[#baa89c] light:text-stone-600 mt-0.5">
                    Meeting point: Mirpur 10 Roundabout • 42 volunteers joined
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c85a32]/10 text-[#c85a32] text-xs font-bold uppercase tracking-wider">
            Why Kindred
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight">
            Built for Grassroots Social Impact
          </h2>
          <p className="text-stone-400 dark:text-[#bdaea2] light:text-[#5f4e43] text-base sm:text-lg">
            Empowering every neighborhood with modern organizing tools to build resilient, caring communities together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-stone-800/40 dark:bg-[#1d1612]/60 light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 hover:border-[#c85a32]/50 transition-all hover:-translate-y-1 shadow-lg group">
            <div className="w-12 h-12 rounded-2xl bg-[#c85a32]/15 text-[#e2764a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-xl">
              <FaMapMarkerAlt />
            </div>
            <h3 className="text-xl font-bold font-serif mb-2">Neighborhood Centric</h3>
            <p className="text-sm text-stone-400 dark:text-[#baa89c] light:text-stone-600 leading-relaxed">
              Find and organize events in specific localities like Mirpur, Mohammadpur, Dhanmondi, and Uttara.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-stone-800/40 dark:bg-[#1d1612]/60 light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 hover:border-[#c85a32]/50 transition-all hover:-translate-y-1 shadow-lg group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-xl">
              <FaHandsHelping />
            </div>
            <h3 className="text-xl font-bold font-serif mb-2">Instant RSVP</h3>
            <p className="text-sm text-stone-400 dark:text-[#baa89c] light:text-stone-600 leading-relaxed">
              Join social service events in a single click, coordinate with co-volunteers, and track attendance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-stone-800/40 dark:bg-[#1d1612]/60 light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 hover:border-[#c85a32]/50 transition-all hover:-translate-y-1 shadow-lg group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-xl">
              <FaShieldAlt />
            </div>
            <h3 className="text-xl font-bold font-serif mb-2">Verified Initiatives</h3>
            <p className="text-sm text-stone-400 dark:text-[#baa89c] light:text-stone-600 leading-relaxed">
              Strict validation ensures all upcoming events are genuine, upcoming, and coordinated by real people.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-3xl bg-stone-800/40 dark:bg-[#1d1612]/60 light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 hover:border-[#c85a32]/50 transition-all hover:-translate-y-1 shadow-lg group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-xl">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-bold font-serif mb-2">Community Growth</h3>
            <p className="text-sm text-stone-400 dark:text-[#baa89c] light:text-stone-600 leading-relaxed">
              Track your volunteer portfolio, update initiatives, and celebrate collective social development milestones.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Recent Upcoming Events Section (Dynamic 6 items using .limit() from MongoDB) */}
      <section className="py-20 bg-stone-950/50 dark:bg-[#120c09] light:bg-[#f4efe6] border-y border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c85a32]/10 text-[#c85a32] text-xs font-bold uppercase tracking-wider mb-2">
                Action Highlights
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight">
                Recent Upcoming Events
              </h2>
              <p className="text-stone-400 dark:text-[#baa89c] light:text-stone-600 text-sm sm:text-base mt-1">
                Showing the top 6 upcoming community drives curated from our real-time database.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-800/80 dark:bg-[#201712] light:bg-white border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 font-semibold text-sm hover:border-[#c85a32] transition-colors self-start md:self-auto"
            >
              Explore All Events <FaArrowRight className="text-xs text-[#e2764a]" />
            </Link>
          </div>

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
                  </div>
                  <div className="w-full h-12 bg-stone-700/40 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-stone-800/30 dark:bg-[#1a120d] light:bg-white rounded-3xl border border-stone-800 dark:border-amber-950/40 light:border-stone-200 p-8 max-w-xl mx-auto">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold font-serif mb-2">No Upcoming Events</h3>
              <p className="text-stone-400 dark:text-[#baa89c] light:text-stone-600 mb-6 text-sm">
                Be the pioneer to kickstart an initiative in your local neighborhood!
              </p>
              <Link
                href="/create-event"
                className="px-6 py-3 rounded-xl bg-[#c85a32] text-white font-bold text-sm inline-flex items-center gap-2"
              >
                Create First Event <FaArrowRight className="text-xs" />
              </Link>
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

                  {/* Card Action */}
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
      </section>

      {/* 4. Gallery Section (Photographs of community service events) */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c85a32]/10 text-[#c85a32] text-xs font-bold uppercase tracking-wider">
            Moments of Empathy
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight">
            Fieldwork & Community Gallery
          </h2>
          <p className="text-stone-400 dark:text-[#bdaea2] light:text-[#5f4e43] text-sm sm:text-base">
            Glimpses from volunteer-driven relief drives, blood camps, and canal restorations across Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group relative h-72 rounded-3xl overflow-hidden border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Winter clothes collection drive"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b]">Mirpur 10, Dhaka</span>
              <h4 className="text-base font-bold font-serif">Winter Warmth Distribution</h4>
            </div>
          </div>

          <div className="group relative h-72 rounded-3xl overflow-hidden border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
              alt="Blanket distribution"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b]">Mohammadpur, Dhaka</span>
              <h4 className="text-base font-bold font-serif">Late-Night Blanket Handout</h4>
            </div>
          </div>

          <div className="group relative h-72 rounded-3xl overflow-hidden border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=800&q=80"
              alt="Tree plantation drive"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b]">Dhanmondi Lake</span>
              <h4 className="text-base font-bold font-serif">300 Saplings Planting Drive</h4>
            </div>
          </div>

          <div className="group relative h-72 rounded-3xl overflow-hidden border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80"
              alt="Blood donation campaign"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b]">Uttara Community Center</span>
              <h4 className="text-base font-bold font-serif">Red Crescent Blood Camp</h4>
            </div>
          </div>

          <div className="group relative h-72 rounded-3xl overflow-hidden border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80"
              alt="Clean hatirjheel eco campaign"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b]">Hatirjheel Waters</span>
              <h4 className="text-base font-bold font-serif">Plastic Interception Drive</h4>
            </div>
          </div>

          <div className="group relative h-72 rounded-3xl overflow-hidden border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
              alt="Hot meal distribution"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b]">Kawran Bazar</span>
              <h4 className="text-base font-bold font-serif">Night Shelter Hot Meals</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#291710] via-[#21120c] to-[#160c08] dark:from-[#21120c] dark:to-[#140b07] light:from-[#f3ede4] light:to-[#fcfaf7] border border-stone-800/80 dark:border-amber-950/40 light:border-stone-300 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#c85a32]/20 border border-[#c85a32]/30 flex items-center justify-center mx-auto text-[#f59e0b] text-xl">
              <FaEnvelope />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white dark:text-[#f8f5ee] light:text-[#281a13]">
              Stay Informed with Weekly Community Dispatches
            </h2>

            <p className="text-stone-300 dark:text-[#c4b6ab] light:text-[#5c493d] text-base leading-relaxed">
              Subscribe to get notified about upcoming relief missions, urgent blood requests, and neighborhood cleanup schedules in your locality.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-2 text-sm font-semibold">
                <FaCheckCircle className="text-lg" /> You are subscribed to Kindred dispatches!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="grow px-5 py-3.5 rounded-xl bg-black/40 dark:bg-black/50 light:bg-white border border-stone-700/80 dark:border-amber-950/40 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-[#c85a32] text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-[#c85a32] hover:bg-[#b24c26] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <FaPaperPlane className="text-xs" /> Subscribe
                </button>
              </form>
            )}

            <p className="text-xs text-stone-500 dark:text-stone-400 light:text-stone-500">
              Zero spam. Unsubscribe at any time with one click.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
