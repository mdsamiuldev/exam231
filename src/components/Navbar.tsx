"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  FaCalendarAlt,
  FaPlusCircle,
  FaTasks,
  FaCheckCircle,
  FaUser,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaHandsHelping,
  FaChevronDown,
} from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-stone-900/90 dark:bg-[#18120e]/95 light:bg-[#faf7f2]/95 border-b border-stone-800/60 dark:border-amber-950/40 light:border-stone-200 transition-colors duration-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" onClick={closeMenus} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c85a32] via-[#d96738] to-[#e6834d] flex items-center justify-center shadow-lg shadow-orange-950/20 group-hover:scale-105 transition-transform text-white text-lg">
            <FaHandsHelping />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white dark:text-[#f8f5ee] light:text-[#281c14] font-serif flex items-center gap-1.5">
              Kindred <span className="text-[#e2764a] text-xs font-sans tracking-widest uppercase font-semibold">Events</span>
            </span>
            <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-[#bdafa4] light:text-stone-500 font-medium -mt-1">
              Social Action Network
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 font-medium text-sm">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              isActive("/")
                ? "bg-[#c85a32] text-white shadow-sm font-semibold"
                : "text-stone-300 dark:text-[#d3c7bc] light:text-[#423329] hover:bg-white/10 dark:hover:bg-white/5 light:hover:bg-stone-200/60"
            }`}
          >
            Home
          </Link>
          <Link
            href="/events"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              isActive("/events")
                ? "bg-[#c85a32] text-white shadow-sm font-semibold"
                : "text-stone-300 dark:text-[#d3c7bc] light:text-[#423329] hover:bg-white/10 dark:hover:bg-white/5 light:hover:bg-stone-200/60"
            }`}
          >
            <FaCalendarAlt className="text-xs" /> Upcoming Events
          </Link>

          {user && (
            <>
              <Link
                href="/create-event"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive("/create-event")
                    ? "bg-[#c85a32] text-white shadow-sm font-semibold"
                    : "text-stone-300 dark:text-[#d3c7bc] light:text-[#423329] hover:bg-white/10 dark:hover:bg-white/5 light:hover:bg-stone-200/60"
                }`}
              >
                <FaPlusCircle className="text-xs" /> Create Event
              </Link>
              <Link
                href="/joined-events"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive("/joined-events")
                    ? "bg-[#c85a32] text-white shadow-sm font-semibold"
                    : "text-stone-300 dark:text-[#d3c7bc] light:text-[#423329] hover:bg-white/10 dark:hover:bg-white/5 light:hover:bg-stone-200/60"
                }`}
              >
                <FaCheckCircle className="text-xs text-emerald-400" /> Joined Events
              </Link>
            </>
          )}
        </div>

        {/* Right Section: Theme Toggle & Auth */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark and Light theme"
            className="w-10 h-10 rounded-xl bg-stone-800/80 dark:bg-[#251e19] light:bg-stone-200/80 border border-stone-700/60 dark:border-amber-950/50 light:border-stone-300 text-stone-200 dark:text-amber-200 light:text-stone-700 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-sm text-sm"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <FaSun className="text-amber-300" /> : <FaMoon className="text-stone-700" />}
          </button>

          {/* Conditional Auth User Profile or Login/Register */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div className="group relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-stone-800/70 dark:bg-[#231a15] light:bg-stone-200/80 border border-stone-700/60 dark:border-amber-950/50 light:border-stone-300 text-white dark:text-stone-200 light:text-stone-800 hover:border-[#c85a32] transition-all cursor-pointer"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden relative border border-stone-600 bg-[#c85a32]/20">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.name || "User profile"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-[#c85a32]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  <FaChevronDown className="text-[10px] text-stone-400" />
                </button>

                {/* Hover Display Name Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-stone-900 text-stone-100 text-[11px] rounded-lg shadow-xl border border-stone-700 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {user.name}
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-stone-900 dark:bg-[#201813] light:bg-white border border-stone-700/80 dark:border-amber-950/60 light:border-stone-200 shadow-2xl py-2 z-50 text-stone-200 dark:text-[#eee4db] light:text-stone-800">
                  <div className="px-4 py-3 border-b border-stone-800 dark:border-amber-950/40 light:border-stone-100">
                    <p className="text-xs text-stone-400 dark:text-[#a89a8f] light:text-stone-500">Signed in as</p>
                    <p className="text-sm font-bold truncate text-white dark:text-[#f8f5ee] light:text-stone-900">{user.name}</p>
                    <p className="text-[11px] text-stone-400 dark:text-stone-400 light:text-stone-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1 text-sm font-medium">
                    <Link
                      href="/create-event"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 dark:hover:bg-[#2d221b] light:hover:bg-stone-100 transition-colors"
                    >
                      <FaPlusCircle className="text-sm text-[#c85a32]" />
                      <span>Create Event</span>
                    </Link>
                    <Link
                      href="/manage-events"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 dark:hover:bg-[#2d221b] light:hover:bg-stone-100 transition-colors"
                    >
                      <FaTasks className="text-sm text-[#c85a32]" />
                      <span>Manage Events</span>
                    </Link>
                    <Link
                      href="/joined-events"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 dark:hover:bg-[#2d221b] light:hover:bg-stone-100 transition-colors"
                    >
                      <FaCheckCircle className="text-sm text-emerald-400" />
                      <span>Joined Events</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-800 dark:hover:bg-[#2d221b] light:hover:bg-stone-100 transition-colors"
                    >
                      <FaUser className="text-sm text-blue-400" />
                      <span>My Profile</span>
                    </Link>
                  </div>

                  <div className="border-t border-stone-800 dark:border-amber-950/40 light:border-stone-100 pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 transition-colors text-left text-sm font-medium cursor-pointer"
                    >
                      <FaSignOutAlt className="text-sm" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-stone-700/80 dark:border-amber-900/40 light:border-stone-300 text-stone-200 dark:text-stone-200 light:text-stone-800 hover:bg-white/10 dark:hover:bg-white/5 light:hover:bg-stone-200/60 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#c85a32] hover:bg-[#b54f2a] text-white shadow-md transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-stone-800/60 text-stone-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-stone-900 dark:bg-[#1a1410] light:bg-[#f6f3ed] border-b border-stone-800 dark:border-amber-950/50 light:border-stone-200 space-y-2">
          <Link
            href="/"
            onClick={closeMenus}
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
              isActive("/") ? "bg-[#c85a32] text-white" : "text-stone-300 dark:text-stone-300 light:text-stone-800"
            }`}
          >
            Home
          </Link>
          <Link
            href="/events"
            onClick={closeMenus}
            className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
              isActive("/events") ? "bg-[#c85a32] text-white" : "text-stone-300 dark:text-stone-300 light:text-stone-800"
            }`}
          >
            Upcoming Events
          </Link>

          {user && (
            <>
              <Link
                href="/create-event"
                onClick={closeMenus}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive("/create-event") ? "bg-[#c85a32] text-white" : "text-stone-300 dark:text-stone-300 light:text-stone-800"
                }`}
              >
                Create Event
              </Link>
              <Link
                href="/manage-events"
                onClick={closeMenus}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive("/manage-events") ? "bg-[#c85a32] text-white" : "text-stone-300 dark:text-stone-300 light:text-stone-800"
                }`}
              >
                Manage Events
              </Link>
              <Link
                href="/joined-events"
                onClick={closeMenus}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive("/joined-events") ? "bg-[#c85a32] text-white" : "text-stone-300 dark:text-stone-300 light:text-stone-800"
                }`}
              >
                Joined Events
              </Link>
              <Link
                href="/profile"
                onClick={closeMenus}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive("/profile") ? "bg-[#c85a32] text-white" : "text-stone-300 dark:text-stone-300 light:text-stone-800"
                }`}
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  closeMenus();
                  logout();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              >
                Sign Out ({user.name})
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
