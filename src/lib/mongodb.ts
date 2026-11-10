import { MongoClient, ObjectId } from "mongodb";

export interface EventDocument {
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
  createdAt: Date;
  [key: string]: unknown;
}

export interface JoinedEventDocument {
  _id: string;
  eventId: string;
  userEmail: string;
  userName: string;
  joinedAt: Date;
  event: EventDocument;
  [key: string]: unknown;
}

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password?: string;
  photoURL: string;
  createdAt: Date;
}

// Initial realistic community events inspired by the assignment specifications
const now = Date.now();
const day = 86400000;

const initialEvents: EventDocument[] = [
  {
    _id: "evt-001",
    title: "Winter Clothes Distribution",
    description: "Collecting and handing out warm jackets, sweaters, and thermals to vulnerable families and children in the Mirpur area before the severe cold wave hits. Every warm donation helps save lives.",
    eventType: "Winter Relief",
    category: "Winter Relief",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    location: "Mirpur 10, Dhaka",
    date: new Date(now + day * 3).toISOString().slice(0, 16),
    creatorEmail: "organizer@communityevents.org",
    creatorName: "Dhaka Youth Social Foundation",
    attendees: 42,
    createdAt: new Date(now - day * 2),
  },
  {
    _id: "evt-002",
    title: "Blanket Distribution for the Needy",
    description: "Organizing our midnight distribution drive of high-grade wool blankets to street-dwellers and elderly homeless individuals across Mohammadpur and surrounding neighborhoods.",
    eventType: "Donation",
    category: "Donation",
    thumbnail: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    location: "Mohammadpur, Dhaka",
    date: new Date(now + day * 5).toISOString().slice(0, 16),
    creatorEmail: "relief@humanitarianhope.org",
    creatorName: "Hope Bangladesh Initiative",
    attendees: 68,
    createdAt: new Date(now - day * 3),
  },
  {
    _id: "evt-003",
    title: "Tree Plantation & Lake Beautification",
    description: "Join our green city team to plant 300 neem, bakul, and fruit saplings along the walkways of Dhanmondi Lake. Gardening gloves, tools, and organic fertilizer will be provided.",
    eventType: "Plantation",
    category: "Plantation",
    thumbnail: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1200&q=80",
    location: "Dhanmondi Lake (Rabindra Sarobar), Dhaka",
    date: new Date(now + day * 8).toISOString().slice(0, 16),
    creatorEmail: "green@ecodhaka.org",
    creatorName: "Eco Bangladesh Collective",
    attendees: 55,
    createdAt: new Date(now - day * 1),
  },
  {
    _id: "evt-004",
    title: "Free Medical & Blood Donation Camp",
    description: "A comprehensive free health checkup camp offering basic vital screening, blood group typing, and voluntary blood donation in coordination with national blood banks.",
    eventType: "Community Health",
    category: "Community Health",
    thumbnail: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80",
    location: "Uttara Sector 7 Community Center, Dhaka",
    date: new Date(now + day * 11).toISOString().slice(0, 16),
    creatorEmail: "health@redcrescentvolunteers.org",
    creatorName: "Red Crescent Youth Wing",
    attendees: 84,
    createdAt: new Date(now - day * 4),
  },
  {
    _id: "evt-005",
    title: "Clean Hatirjheel Eco Drive",
    description: "Community cleanup brigade targeting shoreline plastic pollution, floating debris, and non-biodegradable waste. Recycling disposal bags and safety grabbers supplied on site.",
    eventType: "Cleanup",
    category: "Cleanup",
    thumbnail: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
    location: "Hatirjheel Amphitheater Area, Dhaka",
    date: new Date(now + day * 14).toISOString().slice(0, 16),
    creatorEmail: "clean@zerowastedhaka.org",
    creatorName: "Clean Dhaka Movement",
    attendees: 37,
    createdAt: new Date(now - day * 2),
  },
  {
    _id: "evt-006",
    title: "Youth Digital Literacy & Mentorship",
    description: "A volunteer-led weekend workshop introducing computer basics, internet safety, and foundational coding to children from underserved community schools.",
    eventType: "Education",
    category: "Education",
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    location: "Public Library Conference Hall, Shahbagh, Dhaka",
    date: new Date(now + day * 17).toISOString().slice(0, 16),
    creatorEmail: "education@brightfuture.org",
    creatorName: "Bright Future Scholars",
    attendees: 29,
    createdAt: new Date(now - day * 5),
  },
  {
    _id: "evt-007",
    title: "Hot Meal Distribution for Shelter Homes",
    description: "Preparing and packaging 500 freshly cooked nutritious meals for nighttime distribution at temporary urban shelters and railway station platforms.",
    eventType: "Food Drive",
    category: "Food Drive",
    thumbnail: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
    location: "Kawran Bazar Railgate Area, Dhaka",
    date: new Date(now + day * 21).toISOString().slice(0, 16),
    creatorEmail: "relief@feeddhaka.org",
    creatorName: "Feed the Hungry Community",
    attendees: 63,
    createdAt: new Date(now - day * 6),
  },
];

type StoreRecord = Record<string, unknown>;

// Persistent global mock storage across hot reloads and worker threads
const globalWithStore = global as typeof globalThis & {
  _mockCollections?: Record<string, StoreRecord[]>;
};

if (!globalWithStore._mockCollections) {
  globalWithStore._mockCollections = {
    events: [...initialEvents] as unknown as StoreRecord[],
    joined_events: [
      {
        _id: "join-001",
        eventId: "evt-001",
        userEmail: "demo@user.com",
        userName: "Demo Volunteer",
        joinedAt: new Date(),
        event: initialEvents[0] as unknown as StoreRecord,
      },
      {
        _id: "join-002",
        eventId: "evt-003",
        userEmail: "demo@user.com",
        userName: "Demo Volunteer",
        joinedAt: new Date(),
        event: initialEvents[2] as unknown as StoreRecord,
      },
    ],
    users: [
      {
        _id: "usr-001",
        name: "Demo Volunteer",
        email: "demo@user.com",
        password: "Password123",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        createdAt: new Date(),
      },
    ],
    sessions: [],
    accounts: [],
    verifications: [],
  };
}

function matchFilter(item: StoreRecord, filter: Record<string, unknown>): boolean {
  return Object.entries(filter).every(([k, v]) => {
    if (v === undefined) return true;
    if (k === "$or" && Array.isArray(v)) {
      return v.some((cond) => matchFilter(item, cond as Record<string, unknown>));
    }
    if (k === "date" && typeof v === "object" && v !== null) {
      const dateVal = new Date(String(item.date || "")).getTime();
      const filterObj = v as Record<string, unknown>;
      if (filterObj.$gte) {
        return dateVal >= new Date(String(filterObj.$gte)).getTime();
      }
      if (filterObj.$gt) {
        return dateVal > new Date(String(filterObj.$gt)).getTime();
      }
    }
    return item[k] === v || String(item[k]) === String(v);
  });
}

function createMockCollection(name: string) {
  const collections = globalWithStore._mockCollections!;
  if (!collections[name]) {
    collections[name] = [];
  }
  const store = collections[name];

  return {
    find: (filter: Record<string, unknown> = {}) => {
      let filtered = store.filter((item) => matchFilter(item, filter));
      let limitCount: number | null = null;

      const cursor = {
        sort: (sortSpec: Record<string, number> = {}) => {
          const entries = Object.entries(sortSpec);
          if (entries.length > 0) {
            const [sortKey, sortDir] = entries[0];
            filtered = [...filtered].sort((a, b) => {
              const aVal = String(a[sortKey] ?? "");
              const bVal = String(b[sortKey] ?? "");
              if (aVal < bVal) return sortDir === -1 ? 1 : -1;
              if (aVal > bVal) return sortDir === -1 ? -1 : 1;
              return 0;
            });
          }
          return cursor;
        },
        limit: (n: number) => {
          limitCount = n;
          return cursor;
        },
        toArray: async () => {
          if (limitCount !== null && limitCount >= 0) {
            return [...filtered.slice(0, limitCount)];
          }
          return [...filtered];
        },
      };

      return cursor;
    },
    findOne: async (filter: Record<string, unknown> = {}) => {
      return store.find((item) => matchFilter(item, filter)) || null;
    },
    insertOne: async (doc: StoreRecord) => {
      const _id = (doc._id as string) || new ObjectId().toHexString();
      const newDoc = { ...doc, _id };
      store.push(newDoc);
      return { insertedId: _id, acknowledged: true };
    },
    insertMany: async (docs: StoreRecord[]) => {
      const insertedIds: Record<number, unknown> = {};
      docs.forEach((d, idx) => {
        const _id = (d._id as string) || new ObjectId().toHexString();
        store.push({ ...d, _id });
        insertedIds[idx] = _id;
      });
      return { insertedIds, acknowledged: true };
    },
    updateOne: async (
      filter: Record<string, unknown>,
      update: Record<string, unknown>
    ) => {
      const index = store.findIndex((item) => matchFilter(item, filter));
      if (index !== -1) {
        const setOps = (update.$set as StoreRecord) || update;
        store[index] = { ...store[index], ...setOps };
        return { modifiedCount: 1, matchedCount: 1, acknowledged: true };
      }
      return { modifiedCount: 0, matchedCount: 0, acknowledged: true };
    },
    deleteOne: async (filter: Record<string, unknown>) => {
      const index = store.findIndex((item) => matchFilter(item, filter));
      if (index !== -1) {
        store.splice(index, 1);
        return { deletedCount: 1, acknowledged: true };
      }
      return { deletedCount: 0, acknowledged: true };
    },
    deleteMany: async (filter: Record<string, unknown>) => {
      let count = 0;
      for (let i = store.length - 1; i >= 0; i--) {
        if (matchFilter(store[i], filter)) {
          store.splice(i, 1);
          count++;
        }
      }
      return { deletedCount: count, acknowledged: true };
    },
    createIndex: async () => "idx_ok",
    indexes: async () => [],
    countDocuments: async () => store.length,
  };
}

function createMockDb() {
  return {
    collection: (name: string) => createMockCollection(name),
  };
}

function createMockClient(): MongoClient {
  return {
    db: () => createMockDb(),
    close: async () => {},
  } as unknown as MongoClient;
}

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient>;

if (process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      });
      globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
        console.warn("[AI Studio] MongoDB connection failed, using in-memory mock store:", err.message);
        return createMockClient();
      });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    clientPromise = client.connect().catch((err) => {
      console.warn("[AI Studio] MongoDB connection failed, using in-memory mock store:", err.message);
      return createMockClient();
    });
  }
} else {
  // Safe in-memory fallback when external MongoDB URI is not set
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = Promise.resolve(createMockClient());
  }
  clientPromise = globalWithMongo._mongoClientPromise;
}

export default clientPromise;
