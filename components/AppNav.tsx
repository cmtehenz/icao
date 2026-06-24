"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNav() {
  const pathname = usePathname();
  const isStructure = pathname.startsWith("/structure");
  const isPart2 = pathname.startsWith("/part2");
  const isPart1 = !isStructure && !isPart2;

  return (
    <nav className="app-nav">
      <div className="wrap app-nav-inner">
        <Link href="/" className={`app-nav-link ${isPart1 ? "active" : ""}`}>
          ICAO 5
        </Link>
        <Link href="/structure" className={`app-nav-link ${isStructure ? "active" : ""}`}>
          ICAO 4
        </Link>
        <Link href="/part2" className={`app-nav-link ${isPart2 ? "active" : ""}`}>
          SDEA Part 2
        </Link>
      </div>
    </nav>
  );
}
