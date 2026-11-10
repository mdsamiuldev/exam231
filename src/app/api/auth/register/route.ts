import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { name, email, password, photoURL } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    // Password validation rule
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasValidLength = password.length >= 6;

    if (!hasValidLength || !hasUpperCase || !hasLowerCase) {
      return NextResponse.json(
        { error: "Password must have at least 6 characters, one uppercase, and one lowercase letter" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const newUser = {
      name,
      email,
      password,
      photoURL:
        photoURL ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      createdAt: new Date(),
    };

    const res = await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      {
        id: res.insertedId,
        name: newUser.name,
        email: newUser.email,
        photoURL: newUser.photoURL,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
