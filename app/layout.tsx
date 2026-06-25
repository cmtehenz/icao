import type { Metadata, Viewport } from "next";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/components/AuthProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "ICAO Delta — Helicopter Part 1 Trainer",
  description:
    "Train ICAO Part 1 answers daily. Keywords, exam mode, and ICAO 4/5 structures for helicopter pilots.",
  appleWebApp: {
    capable: true,
    title: "ICAO Delta",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
