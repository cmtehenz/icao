"use client";

import { useEffect, useRef } from "react";
import { addStudySeconds, type StudySection } from "@/lib/studyTime";

function sectionFromPath(pathname: string): StudySection | null {
  if (pathname === "/") return "part1";
  if (pathname.startsWith("/part2")) return "part2";
  return null;
}

export function useStudyTimeTracker(pathname: string) {
  const pendingRef = useRef(0);
  const sectionRef = useRef<StudySection | null>(sectionFromPath(pathname));
  sectionRef.current = sectionFromPath(pathname);

  useEffect(() => {
    const flush = () => {
      const section = sectionRef.current;
      if (!section || pendingRef.current <= 0) return;
      addStudySeconds(section, pendingRef.current);
      pendingRef.current = 0;
    };

    const tick = () => {
      if (!sectionRef.current || document.visibilityState !== "visible") return;
      pendingRef.current += 1;
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    const tickInterval = window.setInterval(tick, 1000);
    const saveInterval = window.setInterval(flush, 10000);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", flush);
    window.addEventListener("pagehide", flush);

    return () => {
      window.clearInterval(tickInterval);
      window.clearInterval(saveInterval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", flush);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [pathname]);
}
