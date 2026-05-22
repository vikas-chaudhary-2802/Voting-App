import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email;
  const password = body.password;
  
  // Use environment variables or fallback to a default for testing
  const adminEmail = process.env.ADMIN_EMAIL || "admin@inspireindia.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "inspire2026";

  if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
    const response = NextResponse.json({ success: true });
    
    // Set a secure HttpOnly cookie for the session
    response.cookies.set({
      name: "admin_session",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    return response;
  }

  return NextResponse.json({ message: "Invalid password" }, { status: 401 });
}
