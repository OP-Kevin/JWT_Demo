import { NextRequest, NextResponse } from "next/server";
import { verifyToken, unauthorized, forbidden } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return unauthorized();
  if (user.role !== "superadmin") return forbidden();

  return NextResponse.json({
    message: `Welcome ${user.name}`,
    role: user.role,
    stats: { admins: 5, totalUsers: 1248, uptime: "99.9%" },
    permissions: ["system_config", "manage_admins", "database_access", "audit_logs", "role_management"],
  });
}
