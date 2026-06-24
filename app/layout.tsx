import type { Metadata } from "next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICAO Delta — Helicopter Part 1 Trainer",
  description:
    "Train ICAO Part 1 answers daily. Keywords, exam mode, and ICAO 4/5 structures for helicopter pilots.",
  appleWebApp: {
    capable: true,
    title: "ICAO Part 1",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
