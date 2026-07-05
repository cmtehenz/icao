"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCaptainDelta } from "@/components/CaptainDelta/CaptainDeltaProvider";

/** Home has its own Flight Academy briefing — keep Captain panel closed unless user opens the FAB. */
export default function AcademyHomeCaptainBridge() {
  const pathname = usePathname();
  const { setOpen, open, currentMessage, voice } = useCaptainDelta();

  useEffect(() => {
    if (pathname !== "/") return;
    setOpen(false);
    voice.stop();
  }, [pathname, open, currentMessage?.id, setOpen, voice]);

  return null;
}
