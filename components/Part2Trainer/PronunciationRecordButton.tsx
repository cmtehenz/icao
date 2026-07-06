"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  createRecordClickGuard,
  traceRecordStep,
} from "@/lib/captainDelta/pronunciationRecordTrace";

type Props = {
  onRecord: () => void | Promise<void>;
  label?: string;
  preparing?: boolean;
  disabled?: boolean;
};

const PronunciationRecordButton = forwardRef<HTMLButtonElement, Props>(
  function PronunciationRecordButton(
    { onRecord, label = "Record", preparing = false, disabled = false },
    ref,
  ) {
    const btnRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => btnRef.current as HTMLButtonElement);
    const onRecordRef = useRef(onRecord);
    onRecordRef.current = onRecord;
    const clickGuardRef = useRef(createRecordClickGuard(500));

    const handleClick = () => {
      if (disabled || preparing) return;
      if (!clickGuardRef.current.tryAcquire()) return;

      traceRecordStep("onClick");
      void Promise.resolve(onRecordRef.current()).finally(() => {
        clickGuardRef.current.release();
      });
    };

    const isDisabled = disabled || preparing;

    return (
      <div className="pron-record-v2-wrap" data-recorder-version="2">
        <span className="pron-recorder-v2-badge" aria-hidden>
          Recorder v2 connected
        </span>
        <button
          ref={btnRef}
          type="button"
          className={`btn green pronunciation-record-btn${preparing ? " preparing" : ""}`}
          data-record-source="pronunciation-mission-card"
          data-recorder-version="2"
          data-record-handler="attached"
          disabled={isDisabled}
          aria-busy={preparing || undefined}
          onPointerDown={() => {
            console.info("[RecordTrace] pointerdown");
          }}
          onMouseDown={() => {
            console.info("[RecordTrace] mousedown");
          }}
          onClick={handleClick}
        >
          {preparing ? (
            <>
              <span className="pron-record-spinner" aria-hidden />
              Preparing…
            </>
          ) : (
            label
          )}
        </button>
      </div>
    );
  },
);

export default PronunciationRecordButton;
