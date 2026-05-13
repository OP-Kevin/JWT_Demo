import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "securepanel_jwt_secret_2024";

// Simulated DB — replace with real DB query
const users = [
  { id: 1, name: "Super Administrator", email: "superadmin@company.com", password: "super@321", role: "superadmin" },
  { id: 2, name: "Admin User",          email: "admin@company.com",      password: "admin@123", role: "admin" },
  { id: 3, name: "Regular User",        email: "user@company.com",       password: "user@456",  role: "user" },
];

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ message: "Email and password required" }, { status: 400 });

  const user = users.find(u => u.email === email.toLowerCase() && u.password === password);
  if (!user)
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });

  const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

  return NextResponse.json({ token, user: { name: user.name, email: user.email, role: user.role } });
}
