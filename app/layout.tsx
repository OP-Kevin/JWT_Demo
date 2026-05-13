import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecurePanel — JWT RBAC",
  description: "Role-based access control with JWT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
