"use client";

import Link from "next/link";
import {
  FaHandsHelping,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaHeart,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // New X logo!

export default function Footer() {
  return (
    <footer className="bg-stone-950 dark:bg-[#120d0a] light:bg-[#ede8df] text-stone-300 dark:text-[#cec2b7] light:text-[#3d2f25] border-t border-stone-800/80 dark:border-amber-950/40 light:border-stone-300 transition-colors duration-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80 dark:border-amber-950/30 light:border-stone-300">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c85a32] to-[#e6834d] flex items-center justify-center text-white text-base shadow-md">
                <FaHandsHelping />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white dark:text-[#f8f5ee] light:text-[#281c14] font-serif">
                Kindred <span className="text-[#e2764a] text-sm font-sans tracking-widest uppercase font-semibold">Events</span>
              </span>
            </Link>
            <p className="text-stone-400 dark:text-[#a89b90] light:text-[#635144] text-sm leading-relaxed max-w-sm">
              A community-driven event management platform empowering citizens to create, join, and track grassroots social welfare and environmental initiatives across Bangladesh.
            </p>
            {/* Social Icons with new X Twitter logo */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-[#1f1712] light:bg-stone-200/90 border border-stone-800 dark:border-amber-950/40 light:border-stone-300 flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-800 hover:text-[#e2764a] hover:border-[#e2764a]/60 transition-all"
              >
                <FaXTwitter className="text-sm" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-[#1f1712] light:bg-stone-200/90 border border-stone-800 dark:border-amber-950/40 light:border-stone-300 flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-800 hover:text-[#e2764a] hover:border-[#e2764a]/60 transition-all"
              >
                <FaFacebookF className="text-xs" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-[#1f1712] light:bg-stone-200/90 border border-stone-800 dark:border-amber-950/40 light:border-stone-300 flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-800 hover:text-[#e2764a] hover:border-[#e2764a]/60 transition-all"
              >
                <FaLinkedinIn className="text-xs" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-[#1f1712] light:bg-stone-200/90 border border-stone-800 dark:border-amber-950/40 light:border-stone-300 flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-800 hover:text-[#e2764a] hover:border-[#e2764a]/60 transition-all"
              >
                <FaInstagram className="text-xs" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-[#1f1712] light:bg-stone-200/90 border border-stone-800 dark:border-amber-950/40 light:border-stone-300 flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-800 hover:text-[#e2764a] hover:border-[#e2764a]/60 transition-all"
              >
                <FaGithub className="text-xs" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#e2764a]">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white dark:hover:text-[#f8f5ee] light:hover:text-stone-950 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white dark:hover:text-[#f8f5ee] light:hover:text-stone-950 transition-colors">
                  Upcoming Social Events
                </Link>
              </li>
              <li>
                <Link href="/create-event" className="hover:text-white dark:hover:text-[#f8f5ee] light:hover:text-stone-950 transition-colors">
                  Organize an Event
                </Link>
              </li>
              <li>
                <Link href="/joined-events" className="hover:text-white dark:hover:text-[#f8f5ee] light:hover:text-stone-950 transition-colors">
                  My Joined Initiatives
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Event Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#e2764a]">Causes</h4>
            <ul className="space-y-2 text-sm text-stone-400 dark:text-[#a89b90] light:text-[#635144]">
              <li>Winter Relief & Blankets</li>
              <li>Blood Donation & Health</li>
              <li>Tree Plantation & Parks</li>
              <li>City Cleanups & Recycling</li>
              <li>Youth Education & Books</li>
              <li>Shelter Food Distribution</li>
            </ul>
          </div>

          {/* Column 4: Contact & Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#e2764a]">Central Hub</h4>
            <div className="space-y-2.5 text-xs text-stone-400 dark:text-[#a89b90] light:text-[#635144]">
              <div className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-[#e2764a] shrink-0 mt-0.5 text-xs" />
                <span>House 14, Road 7, Dhanmondi, Dhaka 1205, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-[#e2764a] shrink-0 text-xs" />
                <span>support@kindredevents.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhone className="text-[#e2764a] shrink-0 text-xs" />
                <span>+880 1712-345678</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-[#887a70] light:text-stone-600 gap-4">
          <p>© 2026 Kindred Social Development Events Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-stone-400 dark:text-[#a89b90] light:text-stone-600">
            <span>Built with devotion for community empowerment</span>
            <FaHeart className="text-rose-500 text-xs" />
          </div>
        </div>
      </div>
    </footer>
  );
}
