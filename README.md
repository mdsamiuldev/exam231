# Kindred — Social Development Events Platform

A community-driven event management platform where citizens, grassroots volunteers, and non-profits create, join, and track social welfare and environmental initiatives across Dhaka and greater Bangladesh.



## ✨ Key Platform Features

1. **Neighborhood-Centric Event Discovery & Management**:
   - Discover grassroots social service events filtered by local areas (e.g., *Winter Clothes Distribution in Mirpur 10*, *Blanket Distribution for the Needy in Mohammadpur*, *Tree Plantation in Dhanmondi Lake*, and *Blood Donation in Uttara*).
   - Dynamic 6-item recent events section powered by the database `.limit(6)` query operator.

2. **Full-Featured Private Event Creation with Strict Validation**:
   - Logged-in users can organize community events with title, description, category, thumbnail image URL, location, and date.
   - Built-in date validation ensures no past dates can ever be submitted—only future dates are permitted.
   - Includes convenient one-click preset image thumbnails for winter relief, food distribution, cleanups, blood drives, and tree planting.

3. **Instant One-Click Event Joining & RSVP Tracking**:
   - Public visitors can view detailed event agendas without barriers.
   - Logged-in volunteers can join an event in real-time, instantly registering attendance, updating participant counts, and storing records in MongoDB.
   - Prevents duplicate joins and allows volunteers to cancel participation whenever necessary.

4. **Dedicated Joined Events & Event Management Hubs**:
   - **Joined Events (`/joined-events`)**: Chronologically sorted list of all upcoming initiatives the user has committed to attend, with quick cancellation options.
   - **Manage Events (`/manage-events`)**: Full CRUD capabilities where organizers can inspect, update event details via a clean modal, or delete their own created events with custom safety confirmation modals (no browser alerts).

5. **Robust Authentication with Password Security Rules**:
   - Email/password authentication with client-side & server-side validation requiring at least one uppercase letter `[A-Z]`, one lowercase letter `[a-z]`, and a minimum length of 6 characters.
   - Integrated with one-click Google social authentication.
   - Reload-safe session state prevents private routes from flashing or redirecting logged-in users on page refresh.

6. **Interactive Theme Customization & Modern Vintage Design**:
   - Complete Light and Dark theme toggle persisted across sessions in `localStorage`.
   - Rich warm espresso, terracotta, and gold palette inspired by vintage design aesthetics.
   - Rebranded footer featuring the modern X logo, category breakdowns, central hub contact, and real community photo gallery.

7. **User Profile Customization**:
   - Dedicated profile management page (`/profile`) allowing volunteers to update their display name and avatar photo with real-time counters of events created and attended.

---

## 💻 Tech Stack

- **Frontend:** Next.js (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS, Custom Google Typography (Playfair Display & Inter)
- **Database:** MongoDB (with resilient in-memory fallback mock database)
- **State & Notifications:** React Context (`AuthContext`, `ThemeContext`), `react-hot-toast`
- **Icons:** `lucide-react`, `react-icons` (including `FaXTwitter`)

---

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd social-events-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *(Optional: configure `MONGODB_URI` and OAuth keys; the application boots seamlessly with the built-in mock database if unset).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
