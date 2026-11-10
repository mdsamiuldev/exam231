import { NextResponse } from "next/server";
import clientPromise, { EventDocument } from "@/lib/mongodb";

// Fetch events with filtering, search, sorting, and limit
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const upcomingOnly = searchParams.get("upcomingOnly") === "true";
    const creatorEmail = searchParams.get("creatorEmail");
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase().trim();

    const client = await clientPromise;
    const db = client.db();

    const filter: Record<string, unknown> = {};

    if (creatorEmail) {
      filter.creatorEmail = creatorEmail;
    }

    if (category && category !== "All") {
      filter.eventType = category;
    }

    const eventsCollection = db.collection<EventDocument>("events");
    const cursor = eventsCollection.find(filter).sort({ date: 1 });

    let events = await cursor.toArray();

    // Upcoming events filter (no past events)
    if (upcomingOnly) {
      const now = new Date();
      events = events.filter((e) => new Date(e.date) >= now);
    }

    // Text search filter
    if (search) {
      events = events.filter((e) => {
        const titleMatch = e.title?.toLowerCase().includes(search);
        const locMatch = e.location?.toLowerCase().includes(search);
        const descMatch = e.description?.toLowerCase().includes(search);
        const typeMatch = e.eventType?.toLowerCase().includes(search);
        return titleMatch || locMatch || descMatch || typeMatch;
      });
    }

    // Limit parameter (e.g. 6 recent upcoming events)
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        events = events.slice(0, limit);
      }
    }

    return NextResponse.json(events, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// Create new event (Protected: creatorEmail required, no past dates)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      eventType,
      thumbnail,
      location,
      date,
      creatorEmail,
      creatorName,
    } = body;

    // Validation
    if (!title || !description || !eventType || !location || !date || !creatorEmail) {
      return NextResponse.json(
        { error: "All required fields must be filled: title, description, eventType, location, date, creatorEmail." },
        { status: 400 }
      );
    }

    // Ensure no past date can be added
    const eventTime = new Date(date).getTime();
    const currentTime = Date.now();
    if (isNaN(eventTime) || eventTime <= currentTime) {
      return NextResponse.json(
        { error: "Event date must be in the future. Past dates cannot be added." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const newEvent: Omit<EventDocument, "_id"> = {
      title: title.trim(),
      description: description.trim(),
      eventType: eventType.trim(),
      category: eventType.trim(),
      thumbnail:
        thumbnail?.trim() ||
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      location: location.trim(),
      date,
      creatorEmail: creatorEmail.trim(),
      creatorName: creatorName?.trim() || creatorEmail.split("@")[0],
      attendees: 1, // creator is first participant
      createdAt: new Date(),
    };

    const result = await db.collection("events").insertOne(newEvent);

    // Also automatically register the creator as joined
    await db.collection("joined_events").insertOne({
      eventId: result.insertedId,
      userEmail: creatorEmail.trim(),
      userName: creatorName?.trim() || creatorEmail.split("@")[0],
      joinedAt: new Date(),
      event: { ...newEvent, _id: result.insertedId },
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        eventId: result.insertedId,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
