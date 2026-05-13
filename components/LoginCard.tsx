"use client";
import { useState, KeyboardEvent } from "react";

const S = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border-bright)",
    borderRadius: 20,
    padding: "2.2rem 2rem",
    width: "100%",
    maxWidth: 440,
    position: "relative" as const,
    overflow: "hidden" as const,
    animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
  },
  topBar: { position: "absolute" as const, top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--sa), var(--us), var(--ad))" },
  brand: { display: "flex", alignItems: "center", gap: 11, marginBottom: "1.8rem" },
  brandIcon: { width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, var(--sa), var(--us))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, boxShadow: "0 4px 16px rgba(129,140,248,0.3)" },
  heading: { fontSize: "1.45rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 2 },
  sub: { fontSize: 13, color: "var(--muted2)", marginBottom: "1.8rem" },
  label: { display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  input: { width: "100%", background: "var(--surface2)", border: "1px solid var(--border-bright)", borderRadius: 10, padding: "11px 14px", color: "var(--text)", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", marginBottom: 14 },
  demoBox: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", marginBottom: "1.4rem" },
  demoTitle: { fontSize: 10, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600 },
  demoRow: { display: "flex", alignItems: "center", gap: 9, fontSize: 12, fontFamily: "'Geist Mono', monospace", cursor: "pointer", padding: "5px 8px", borderRadius: 7, transition: "background 0.15s", userSelect: "none" as const },
  dot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  badge: { fontSize: 10, padding: "2px 8px", borderRadius: 20, fontFamily: "inherit" },
  btn: { width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg, var(--sa), #6366f1)", color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", transition: "opacity 0.2s, transform 0.15s", boxShadow: "0 4px 20px rgba(129,140,248,0.25)" },
};

const DEMO = [
  { email: "superadmin@company.com", pass: "super@321", role: "superadmin", label: "Super Admin", color: "var(--sa)", bg: "var(--sa-bg)", url: "/dashboard/superadmin" },
  { email: "admin@company.com",      pass: "admin@123", role: "admin",      label: "Admin",       color: "var(--ad)", bg: "var(--ad-bg)", url: "/dashboard/admin" },
  { email: "user@company.com",       pass: "user@456",  role: "user",       label: "User",        color: "var(--us)", bg: "var(--us-bg)", url: "/dashboard/user" },
];

export default function LoginCard({ onLogin }: { onLogin: (token: string, role: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  function fill(e: string, p: string) { setEmail(e); setPassword(p); setError(""); }

  async function login() {
    if (!email || !password) { setError("Please enter email and password."); return; }
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed."); setBusy(false); return; }
      onLogin(data.token, data.user.role);
    } catch {
      setError("Cannot connect. Is the server running?");
      setBusy(false);
    }
  }

  function onKey(e: KeyboardEvent) { if (e.key === "Enter") login(); }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .login-input:focus { border-color: var(--sa) !important; box-shadow: 0 0 0 3px rgba(129,140,248,0.12) !important; }
        .demo-row-hover:hover { background: rgba(255,255,255,0.04); }
        .login-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>
      <div style={S.card}>
        <div style={S.topBar} />
        <div style={S.brand}>
          <div style={S.brandIcon}>🔒</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>SecurePanel</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>JWT Role-Based Access Control</div>
          </div>
        </div>

        <div style={S.heading}>Welcome back</div>
        <p style={S.sub}>Sign in — URL changes based on your role automatically.</p>

        <label style={S.label}>Email Address</label>
        <input className="login-input" style={{ ...S.input, borderColor: emailFocus ? "var(--sa)" : "var(--border-bright)" }}
          type="email" placeholder="you@company.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)}
          onKeyDown={e => { if (e.key === "Enter") document.getElementById("pass-input")?.focus(); }}
        />

        <label style={S.label}>Password</label>
        <input id="pass-input" className="login-input"
          style={{ ...S.input, borderColor: passFocus ? "var(--sa)" : "var(--border-bright)", marginBottom: "1.4rem" }}
          type="password" placeholder="Enter password" value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => setPassFocus(true)} onBlur={() => setPassFocus(false)}
          onKeyDown={onKey}
        />

        {/* Demo accounts with route preview */}
        <div style={S.demoBox}>
          <div style={S.demoTitle}>Demo accounts — click to autofill</div>
          {DEMO.map(d => (
            <div key={d.email} className="demo-row-hover" style={S.demoRow} onClick={() => fill(d.email, d.pass)}>
              <span style={{ ...S.dot, background: d.color }} />
              <span style={{ flex: 1, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.email}</span>
              <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "inherit" }}>{d.url}</span>
              <span style={{ ...S.badge, background: d.bg, color: d.color }}>{d.label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ fontSize: 13, color: "var(--err)", background: "var(--err-bg)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "9px 12px", marginBottom: "1rem" }}>
            ✕ {error}
          </div>
        )}

        <button className="login-btn" style={S.btn} onClick={login} disabled={busy}>
          {busy ? "Signing in…" : "Sign In →"}
        </button>
      </div>
    </>
  );
}
