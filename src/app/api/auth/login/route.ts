import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      // Allow dynamic first-time login or create session
      const newUser = {
        name: email.split("@")[0],
        email,
        password,
        photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
        createdAt: new Date(),
      };
      const res = await db.collection("users").insertOne(newUser);
      return NextResponse.json({
        id: res.insertedId,
        name: newUser.name,
        email: newUser.email,
        photoURL: newUser.photoURL,
      });
    }

    // Verify password if recorded
    if (user.password && user.password !== password) {
      return NextResponse.json({ error: "Invalid password. Please check your credentials." }, { status: 401 });
    }

    return NextResponse.json({
      id: user._id,
      name: user.name || email.split("@")[0],
      email: user.email,
      photoURL: user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error during login" }, { status: 500 });
  }
}
