import type { Metadata } from "next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICAO Part 1 Master – 42 Flashcards",
  description:
    "Study ICAO Part 1 with 42 flashcards using the ICAO 5 answer structure.",
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
