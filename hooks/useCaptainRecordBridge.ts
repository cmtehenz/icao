"use client";

import { useLayoutEffect, useRef } from "react";
import {
  registerCaptainDeltaRecordBridge,
  type CaptainDeltaRecordBridge,
} from "@/lib/captainDelta/lessonContext";

export type CaptainRecordBridgeImpl = CaptainDeltaRecordBridge & {
  onSecondaryAction?: (actionId: string) => void;
};

/**
 * Register exactly one Captain record bridge for this component instance.
 * Bridge methods read latest impl via ref — no re-register on assessing/recording toggles.
 */
export function useCaptainRecordBridge(
  scope: string,
  impl: CaptainRecordBridgeImpl,
): void {
  const implRef = useRef(impl);
  implRef.current = impl;

  const ownerIdRef = useRef<string | null>(null);
  if (!ownerIdRef.current) {
    ownerIdRef.current = `${scope}-${Math.random().toString(36).slice(2, 9)}`;
  }

  const bridgeRef = useRef<CaptainDeltaRecordBridge | null>(null);
  if (!bridgeRef.current) {
    bridgeRef.current = {
      canRecord: () => implRef.current.canRecord(),
      getRecordBlockReason: () => implRef.current.getRecordBlockReason?.() ?? null,
      startRecord: () => implRef.current.startRecord(),
      stopRecord: () => implRef.current.stopRecord(),
      isRecording: () => implRef.current.isRecording(),
    };
  }

  useLayoutEffect(() => {
    const ownerId = ownerIdRef.current!;
    registerCaptainDeltaRecordBridge(ownerId, bridgeRef.current!, {
      onSecondaryAction: (actionId) => implRef.current.onSecondaryAction?.(actionId),
    });
    return () => registerCaptainDeltaRecordBridge(ownerId, null);
  }, []);
}
