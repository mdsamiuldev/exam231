"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaEye,
  FaExclamationTriangle,
  FaTimes,
  FaCheck,
  FaHandsHelping,
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

const EVENT_TYPES = [
  "Winter Relief",
  "Donation",
  "Plantation",
  "Community Health",
  "Cleanup",
  "Education",
  "Food Drive",
];

export default function ManageEventsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editType, setEditType] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Confirmation Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingTitle, setDeletingTitle] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [minDateTime] = useState(() => new Date(Date.now() + 60000).toISOString().slice(0, 16));

  // Private route guard
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to manage your events.");
      router.push("/login?redirect=/manage-events");
    }
  }, [user, authLoading, router]);

  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) return;
    const activeEmail = userEmail;
    let ignore = false;

    async function loadMyEvents() {
      try {
        const res = await fetch(`/api/events?creatorEmail=${encodeURIComponent(activeEmail)}`);
        const data = await res.json();
        if (!ignore && Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Failed to load user events", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMyEvents();
    return () => {
      ignore = true;
    };
  }, [userEmail]);

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDesc(event.description);
    setEditType(event.eventType || event.category || EVENT_TYPES[0]);
    setEditThumbnail(event.thumbnail);
    setEditLocation(event.location);
    setEditDate(event.date ? new Date(event.date).toISOString().slice(0, 16) : "");
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !user) return;

    if (!editTitle.trim() || !editDesc.trim() || !editLocation.trim() || !editDate) {
      toast.error("All fields are required.");
      return;
    }

    // Validate future date
    const targetTime = new Date(editDate).getTime();
    if (isNaN(targetTime) || targetTime <= Date.now()) {
      toast.error("Event date must be in the future. Past dates cannot be set.");
      return;
    }

    setSavingEdit(true);

    try {
      const res = await fetch(`/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim(),
          eventType: editType,
          thumbnail: editThumbnail.trim(),
          location: editLocation.trim(),
          date: editDate,
          userEmail: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update event");
      }

      setEvents((prev) =>
        prev.map((e) =>
          e._id === editingEvent._id
            ? {
                ...e,
                title: editTitle,
                description: editDesc,
                eventType: editType,
                thumbnail: editThumbnail,
                location: editLocation,
                date: editDate,
              }
            : e
        )
      );

      toast.success("Event updated successfully!");
      setEditingEvent(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update event";
      toast.error(message);
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId || !user) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/events/${deletingId}?userEmail=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((e) => e._id !== deletingId));
      toast.success(`Event "${deletingTitle}" deleted successfully.`);
      setDeletingId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete event";
      toast.error(message);
    } finally {
      setIsDeleting(false);
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
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#291710] via-[#21120c] to-[#160c08] dark:from-[#21120c] dark:to-[#130b07] light:from-[#f3ede4] light:to-[#fcfaf7] border border-stone-800/80 dark:border-amber-950/40 light:border-stone-300 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c85a32]/20 text-[#f59e0b] text-xs font-bold uppercase tracking-wider mb-3">
            <FaHandsHelping className="text-xs" /> Organizer Dashboard
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white dark:text-[#f8f5ee] light:text-[#281a13] mb-3">
            Manage Created Events
          </h1>
          <p className="text-stone-300 dark:text-[#c4b6ab] light:text-[#5c493d] max-w-2xl mx-auto text-sm sm:text-base">
            Review, edit, or remove your organized initiatives. Changes reflect instantly on the public directory.
          </p>
        </div>

        {/* Content Table or Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-stone-800/40 dark:bg-[#1b140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 overflow-hidden animate-pulse h-80 p-6 flex flex-col justify-between"
              >
                <div className="w-full h-36 bg-stone-700/40 rounded-2xl" />
                <div className="w-2/3 h-6 bg-stone-700/40 rounded-md" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-stone-800/30 dark:bg-[#1a120d] light:bg-white rounded-3xl border border-stone-800 dark:border-amber-950/40 light:border-stone-200 p-8 max-w-xl mx-auto shadow-xl">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold font-serif mb-2">No Events Created Yet</h3>
            <p className="text-stone-400 dark:text-[#baa89c] light:text-stone-600 mb-6 text-sm">
              You have not created any events under this account ({user.email}). Start an initiative in your area today!
            </p>
            <Link
              href="/create-event"
              className="px-6 py-3 rounded-xl bg-[#c85a32] text-white font-bold text-sm inline-flex items-center gap-2"
            >
              <FaPlusCircle className="text-sm" /> Create First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="rounded-3xl bg-stone-800/40 dark:bg-[#1c140f] light:bg-white border border-stone-800/80 dark:border-amber-950/40 light:border-stone-200 overflow-hidden shadow-xl flex flex-col justify-between hover:border-[#c85a32]/60 transition-all"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-stone-900">
                    <Image
                      src={event.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"}
                      alt={event.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#f59e0b]">
                        <FaTag className="text-[10px]" /> {event.eventType || event.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold font-serif leading-snug line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-stone-400 dark:text-[#baa89c] light:text-[#5f4e43] text-sm line-clamp-2">
                      {event.description}
                    </p>

                    <div className="pt-2 space-y-1.5 text-xs text-stone-300 dark:text-[#d3c6bb] light:text-[#423329]">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#e2764a] shrink-0" />
                        <span>
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
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex items-center gap-2">
                  <Link
                    href={`/events/${event._id}`}
                    className="p-3 rounded-xl bg-stone-800 dark:bg-[#251b14] light:bg-stone-100 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                    title="View Event Page"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <button
                    onClick={() => openEditModal(event)}
                    className="grow py-2.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FaEdit className="text-xs" /> Edit Event
                  </button>
                  <button
                    onClick={() => {
                      setDeletingId(event._id);
                      setDeletingTitle(event.title);
                    }}
                    className="p-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                    title="Delete Event"
                  >
                    <FaTrashAlt className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-stone-900 dark:bg-[#1a120d] light:bg-white border border-stone-700/80 dark:border-amber-950/60 light:border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 dark:border-amber-950/30 light:border-stone-200">
              <h3 className="text-xl font-bold font-serif flex items-center gap-2">
                <FaEdit className="text-[#e2764a]" /> Update Event Data
              </h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-white cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800/80 dark:bg-black/40 light:bg-stone-50 border border-stone-700 dark:border-amber-950/40 light:border-stone-300 text-sm focus:border-[#c85a32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Event Type
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-800/80 dark:bg-black/40 light:bg-stone-50 border border-stone-700 dark:border-amber-950/40 light:border-stone-300 text-sm focus:border-[#c85a32] focus:outline-none"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-stone-900 text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Date & Time (Future Only)
                  </label>
                  <input
                    type="datetime-local"
                    value={editDate}
                    min={minDateTime}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-stone-800/80 dark:bg-black/40 light:bg-stone-50 border border-stone-700 dark:border-amber-950/40 light:border-stone-300 text-sm focus:border-[#c85a32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800/80 dark:bg-black/40 light:bg-stone-50 border border-stone-700 dark:border-amber-950/40 light:border-stone-300 text-sm focus:border-[#c85a32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={editThumbnail}
                  onChange={(e) => setEditThumbnail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800/80 dark:bg-black/40 light:bg-stone-50 border border-stone-700 dark:border-amber-950/40 light:border-stone-300 text-sm focus:border-[#c85a32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800/80 dark:bg-black/40 light:bg-stone-50 border border-stone-700 dark:border-amber-950/40 light:border-stone-300 text-sm focus:border-[#c85a32] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800 dark:border-amber-950/30 light:border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 dark:bg-[#201813] light:bg-stone-200 text-xs font-semibold hover:border-[#c85a32] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b24c26] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  {savingEdit ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <FaCheck className="text-xs" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal (no window.confirm) */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-stone-900 dark:bg-[#1b130e] light:bg-white border border-stone-700/80 dark:border-amber-950/60 light:border-stone-200 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-2xl">
              <FaExclamationTriangle />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold font-serif text-white dark:text-[#f8f5ee] light:text-[#281a13]">
                Delete This Event?
              </h3>
              <p className="text-stone-400 text-sm">
                Are you sure you want to permanently delete <strong className="text-stone-200">&ldquo;{deletingTitle}&rdquo;</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 dark:bg-[#201813] light:bg-stone-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <FaTrashAlt className="text-xs" /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
