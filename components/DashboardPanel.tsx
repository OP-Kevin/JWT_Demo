"use client";
import type { UserPayload, DashboardData } from "@/lib/types";

const ROLE_CONFIG = {
  superadmin: {
    label: "Super Admin",
    icon: "★",
    accent: "var(--sa)",
    accentBright: "var(--sa-bright)",
    accentBg: "var(--sa-bg)",
    accentBorder: "var(--sa-border)",
    accentGlow: "var(--sa-glow)",
    headerBg: "radial-gradient(ellipse 120% 120% at 0% 0%, rgba(129,140,248,0.12) 0%, transparent 100%), #0b0d1a",
    headerBorder: "rgba(129,140,248,0.12)",
    statLabels: ["Admins", "Total Users", "Uptime"],
    gradient: "linear-gradient(135deg, #818cf8, #6366f1)",
    glowShadow: "0 0 32px rgba(129,140,248,0.2)",
  },
  admin: {
    label: "Admin",
    icon: "▲",
    accent: "var(--ad)",
    accentBright: "var(--ad-bright)",
    accentBg: "var(--ad-bg)",
    accentBorder: "var(--ad-border)",
    accentGlow: "var(--ad-glow)",
    headerBg: "radial-gradient(ellipse 120% 120% at 0% 0%, rgba(245,158,11,0.1) 0%, transparent 100%), #110d03",
    headerBorder: "rgba(245,158,11,0.12)",
    statLabels: ["Total Users", "Active Today", "Pending"],
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    glowShadow: "0 0 32px rgba(245,158,11,0.2)",
  },
  user: {
    label: "User",
    icon: "✓",
    accent: "var(--us)",
    accentBright: "var(--us-bright)",
    accentBg: "var(--us-bg)",
    accentBorder: "var(--us-border)",
    accentGlow: "var(--us-glow)",
    headerBg: "radial-gradient(ellipse 120% 120% at 0% 0%, rgba(16,185,129,0.1) 0%, transparent 100%), #040f0b",
    headerBorder: "rgba(16,185,129,0.12)",
    statLabels: ["My Tasks", "In Progress", "Completed"],
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    glowShadow: "0 0 32px rgba(16,185,129,0.2)",
  },
};

const PERM_META: Record<string, { icon: string; label: string }> = {
  system_config:      { icon: "🛡", label: "Full system configuration" },
  manage_admins:      { icon: "👑", label: "Manage all admin accounts" },
  database_access:    { icon: "🗄", label: "Database & server access" },
  audit_logs:         { icon: "📋", label: "Complete audit logs" },
  role_management:    { icon: "🔑", label: "Role & permission management" },
  manage_users:       { icon: "👥", label: "Manage users & permissions" },
  edit_content:       { icon: "📝", label: "Create & edit content" },
  view_analytics:     { icon: "📊", label: "View analytics reports" },
  send_announcements: { icon: "📢", label: "Send announcements" },
  view_projects:      { icon: "📁", label: "View your projects & files" },
  edit_profile:       { icon: "✏", label: "Edit personal profile" },
  messages:           { icon: "💬", label: "Messages & notifications" },
  account_settings:   { icon: "⚙", label: "Account settings" },
};

export default function DashboardPanel({
  user, dashboard, onLogout,
}: {
  user: UserPayload;
  dashboard: DashboardData;
  onLogout: () => void;
}) {
  const role = user.role as keyof typeof ROLE_CONFIG;
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const initials = user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const statVals = Object.values(dashboard.stats);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .perm-item { transition: background 0.15s, transform 0.15s; }
        .perm-item:hover { background: rgba(255,255,255,0.03); transform: translateX(3px); }
        .logout-btn { transition: all 0.2s; }
        .logout-btn:hover { border-color: var(--err) !important; color: var(--err) !important; background: rgba(248,113,113,0.06) !important; }
        .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-2px); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480, animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>

        {/* Header */}
        <div style={{
          background: cfg.headerBg,
          borderRadius: "18px 18px 0 0",
          padding: "1.6rem 1.8rem",
          border: `1px solid ${cfg.accentBorder}`,
          borderBottom: "none",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Glow orb */}
          <div style={{
            position: "absolute", top: -30, right: -30,
            width: 160, height: 160, borderRadius: "50%",
            background: cfg.accentGlow, filter: "blur(40px)", pointerEvents: "none",
          }} />

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: cfg.accentBg, border: `1px solid ${cfg.accentBorder}`, marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: cfg.accent }}>{cfg.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>{cfg.label}</span>
          </div>

          <div style={{ fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 2 }}>
            {role === "superadmin" ? "Super Admin Control" : role === "admin" ? "Admin Dashboard" : "My Dashboard"}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted2)" }}>
            {role === "superadmin" ? "Full system access — all permissions granted" :
             role === "admin" ? "Content & user management access" :
             "Personal workspace & account settings"}
          </div>
        </div>

        {/* Body */}
        <div style={{ background: "var(--surface)", border: `1px solid ${cfg.accentBorder}`, borderTop: "none", borderRadius: "0 0 18px 18px", padding: "1.6rem 1.8rem", boxShadow: `0 24px 80px rgba(0,0,0,0.5), ${cfg.glowShadow}` }}>

          {/* User row */}
          <div style={{ display: "flex", alignItems: "center", gap: 13, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "13px 15px", marginBottom: "1.2rem", animation: "slideRight 0.4s 0.1s both" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: cfg.accentBg, border: `1px solid ${cfg.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: cfg.accent, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Geist Mono', monospace", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
              <div style={{ fontSize: 10, color: cfg.accent, marginTop: 2, fontWeight: 500 }}>Role from DB: {user.role}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.6)", flexShrink: 0 }} />
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.2rem" }}>
            {statVals.map((val, i) => (
              <div key={i} className="stat-card" style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 11, padding: "12px 13px", animation: `countUp 0.5s ${0.15 + i * 0.08}s both` }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "'Geist Mono', monospace", color: cfg.accentBright, letterSpacing: "-0.03em" }}>{val}</div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{cfg.statLabels[i]}</div>
              </div>
            ))}
          </div>

          {/* Permissions */}
          <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 11, overflow: "hidden", marginBottom: "1.2rem" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Access Permissions
            </div>
            {dashboard.permissions.map((p, i) => {
              const meta = PERM_META[p] || { icon: "•", label: p };
              return (
                <div key={p} className="perm-item" style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 14px", borderBottom: i < dashboard.permissions.length - 1 ? "1px solid var(--border)" : "none", animation: `slideRight 0.4s ${0.25 + i * 0.06}s both` }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: cfg.accentBg, border: `1px solid ${cfg.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                    {meta.icon}
                  </div>
                  <span style={{ fontSize: 13 }}>{meta.label}</span>
                </div>
              );
            })}
          </div>

          {/* JWT token info strip */}
          <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 13px", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.accent, boxShadow: `0 0 6px ${cfg.accentGlow}` }} />
            <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Geist Mono', monospace" }}>
              Authenticated via JWT · role assigned by server · expires in 1h
            </span>
          </div>

          {/* Logout */}
          <button className="logout-btn" style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--muted2)", fontSize: 13, fontWeight: 500, fontFamily: "inherit", cursor: "pointer" }} onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
