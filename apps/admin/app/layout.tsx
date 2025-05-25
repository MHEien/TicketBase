import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { AuthErrorHandler } from "@/components/ui/auth-error-handler";

export const metadata: Metadata = {
  title: "Tickets Admin",
  description: "Ticket management platform admin dashboard",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthErrorHandler />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
