import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ICAO Part 1 Master",
    short_name: "ICAO Part 1",
    description: "Study ICAO Part 1 with flashcards, exam mode, and simulator.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8ff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
