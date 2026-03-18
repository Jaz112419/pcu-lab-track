import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Computer Laboratory Management System",
  description: "Blue modern admin dashboard for school computer laboratory management.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
