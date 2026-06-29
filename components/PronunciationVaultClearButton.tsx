"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { usePronunciationVault } from "@/hooks/usePronunciationVault";
import { clearVault, loadVault } from "@/lib/pronunciationVault";

type Props = {
  onCleared?: () => void;
  className?: string;
  label?: string;
  disabled?: boolean;
};

export default function PronunciationVaultClearButton({
  onCleared,
  className = "btn orange btn-sm",
  label = "Apagar todas as palavras",
  disabled,
}: Props) {
  const { user, syncVault } = useAuth();
  const { total } = usePronunciationVault();
  const [busy, setBusy] = useState(false);

  const handleClear = async () => {
    const count = loadVault().length;
    if (!count) return;

    const cloudNote = user ? " Isso também apaga na sua conta (nuvem)." : "";
    const ok = window.confirm(
      `Apagar todas as ${count} palavra${count > 1 ? "s" : ""} do banco de pronúncia?${cloudNote}`,
    );
    if (!ok) return;

    setBusy(true);
    try {
      clearVault();
      if (user) await syncVault();
      onCleared?.();
    } finally {
      setBusy(false);
    }
  };

  const isDisabled = disabled || busy || total === 0;

  return (
    <button
      type="button"
      className={className}
      onClick={() => void handleClear()}
      disabled={isDisabled}
    >
      {busy ? "Apagando…" : label}
    </button>
  );
}
