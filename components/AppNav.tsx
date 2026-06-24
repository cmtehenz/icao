import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNav() {
  const pathname = usePathname();
  const isStructure = pathname.startsWith("/structure");

  return (
    <nav className="app-nav">
      <div className="wrap app-nav-inner">
        <Link href="/" className={`app-nav-link ${!isStructure ? "active" : ""}`}>
          ICAO 5 · Delta
        </Link>
        <Link href="/structure" className={`app-nav-link ${isStructure ? "active" : ""}`}>
          ICAO 4
        </Link>
      </div>
    </nav>
  );
}
