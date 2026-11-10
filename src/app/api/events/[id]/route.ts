import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface EventDoc {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  attendees?: number;
  createdAt?: Date;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    const event = await db.collection<EventDoc>("events").findOne({ _id: id });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    const eventsCollection = db.collection<EventDoc>("events");
    const event = await eventsCollection.findOne({ _id: id });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const currentAttendees = (event.attendees as number) || 0;
    await eventsCollection.updateOne(
      { _id: id },
      { $set: { attendees: currentAttendees + 1 } }
    );

    return NextResponse.json(
      { message: "Successfully joined the event!", attendees: currentAttendees + 1 },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to join event" }, { status: 500 });
  }
}
