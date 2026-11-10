import { NextResponse } from "next/server";
import clientPromise, { JoinedEventDocument } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email query parameter is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const joinedCollection = db.collection<JoinedEventDocument>("joined_events");
    const records = await joinedCollection.find({ userEmail: email }).toArray();

    // Sort by event date
    const sorted = records.sort((a, b) => {
      const dateA = new Date(a.event?.date || a.joinedAt).getTime();
      const dateB = new Date(b.event?.date || b.joinedAt).getTime();
      return dateA - dateB;
    });

    return NextResponse.json(sorted, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch joined events" }, { status: 500 });
  }
}
