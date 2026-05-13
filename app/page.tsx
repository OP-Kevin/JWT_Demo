"use client";
import { useEffect } from "react";
import LoginCard from "@/components/LoginCard";

function getRedirectPath(role: string): string {
  const routes: Record<string, string> = {
    superadmin: "/dashboard/superadmin",
    admin: "/dashboard/admin",
    user: "/dashboard/user",
  };
  return routes[role] || "/dashboard/user";
}

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          window.location.href = getRedirectPath(payload.role);
          return;
        }
      } catch {}
      localStorage.removeItem("auth_token");
    }
  }, []);

  function handleLogin(token: string, role: string) {
    localStorage.setItem("auth_token", token);
    window.location.href = getRedirectPath(role);
  }

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 10% 60%, rgba(129,140,248,0.07) 0%, transparent 100%), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(16,185,129,0.05) 0%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
      </div>
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <LoginCard onLogin={handleLogin} />
      </div>
    </>
  );
}
