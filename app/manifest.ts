import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ICAO Delta",
    short_name: "ICAO Delta",
    description: "SDEA helicopter exam trainer — real exams 23C–26C, Part 1 & Part 2.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
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
