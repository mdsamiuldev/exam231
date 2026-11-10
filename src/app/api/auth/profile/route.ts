import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function PUT(request: Request) {
  try {
    const { email, name, photoURL } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").updateOne(
      { email },
      { $set: { name, photoURL, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Profile updated successfully", name, photoURL });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
