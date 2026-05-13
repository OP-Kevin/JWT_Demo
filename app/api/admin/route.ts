import { NextRequest, NextResponse } from "next/server";
import { verifyToken, unauthorized, forbidden } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return unauthorized();
  if (!["admin", "superadmin"].includes(user.role)) return forbidden();

  return NextResponse.json({
    message: `Welcome ${user.name}`,
    role: user.role,
    stats: { totalUsers: 1248, activeToday: 87, pending: 12 },
    permissions: ["manage_users", "edit_content", "view_analytics", "send_announcements"],
  });
}
