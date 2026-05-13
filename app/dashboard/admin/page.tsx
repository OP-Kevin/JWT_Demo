"use client";
import { useState, useEffect } from "react";
import type { UserPayload, DashboardData } from "@/lib/types";
import DashboardPanel from "@/components/DashboardPanel";

function decodeJWT(token: string): UserPayload | null {
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch { return null; }
}

export default function AdminDashboard() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { window.location.href = "/"; return; }
    const payload = decodeJWT(token);
    if (!payload || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem("auth_token"); window.location.href = "/"; return;
    }
    // Role guard — only admin allowed here
    if (payload.role !== "admin") {
      window.location.href = `/dashboard/${payload.role}`; return;
    }
    setUser(payload);
    fetch("/api/admin", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setDashboard(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function handleLogout() { localStorage.removeItem("auth_token"); window.location.href = "/"; }

  const BG = (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 10% 60%, rgba(129,140,248,0.07) 0%, transparent 100%), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(16,185,129,0.05) 0%, transparent 100%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
    </div>
  );

  if (loading) return (<>{BG}<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><style>{`@keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}`}</style><div style={{ display: "flex", gap: 7 }}>{[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ad)", animation: `bounce 1s ${i*0.15}s infinite`, opacity: 0.8 }} />)}</div></div></>);
  if (!user || !dashboard) return null;
  return (<>{BG}<div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}><DashboardPanel user={user} dashboard={dashboard} onLogout={handleLogout} /></div></>);
}
