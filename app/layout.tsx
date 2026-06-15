import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICAO Part 1 Master – 42 Flashcards",
  description:
    "Study ICAO Part 1 with 42 flashcards using the ICAO 5 answer structure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
