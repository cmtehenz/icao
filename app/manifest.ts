import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ICAO Delta",
    short_name: "ICAO Delta",
    description: "Helicopter ICAO Part 1 trainer — keywords, exam mode, daily practice.",
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
