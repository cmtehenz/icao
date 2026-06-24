"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer(durationSeconds: number) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (ref.current) clearInterval(ref.current);
    ref.current = null;
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
  }, [stop]);

  const start = useCallback(() => {
    stop();
    setElapsed(0);
    setRunning(true);
  }, [stop]);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= durationSeconds) {
          if (ref.current) clearInterval(ref.current);
          ref.current = null;
          setRunning(false);
        }
        return prev + 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, durationSeconds]);

  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const progress = Math.min(100, (elapsed / durationSeconds) * 100);
  const finished = elapsed >= durationSeconds && !running;

  return { elapsed, running, finished, clock, progress, start, stop, reset };
}
