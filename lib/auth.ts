import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "securepanel_jwt_secret_2024";

export interface JWTPayload {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function verifyToken(req: NextRequest): JWTPayload | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(auth.slice(7), SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ message: "Access forbidden: insufficient role" }, { status: 403 });
}
