import { NextRequest, NextResponse } from "next/server";
import { verifyToken, unauthorized } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return unauthorized();

  return NextResponse.json({
    message: `Welcome ${user.name}`,
    role: user.role,
    stats: { myTasks: 24, inProgress: 7, completed: 17 },
    permissions: ["view_projects", "edit_profile", "messages", "account_settings"],
  });
}
