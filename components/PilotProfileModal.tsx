"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_PROFILE,
  formatFlightHours,
  saveProfile,
  type PilotProfile,
} from "@/lib/profile";

type Props = {
  open: boolean;
  profile: PilotProfile;
  onClose: () => void;
  onSave: (profile: PilotProfile) => void;
};

export default function PilotProfileModal({ open, profile, onClose, onSave }: Props) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (open) setDraft(profile);
  }, [open, profile]);

  if (!open) return null;

  const update = (key: keyof PilotProfile, value: string | number) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const next = {
      ...draft,
      hours: Math.max(0, Number(draft.hours) || 0),
    };
    saveProfile(next);
    onSave(next);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>👤 Pilot Profile</h2>
        <p className="modal-sub">
          Personal answers will use your profile instead of the default helicopter/H130
          example.
        </p>
        <label className="field">
          <span>Role</span>
          <input
            value={draft.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="helicopter pilot"
          />
        </label>
        <label className="field">
          <span>Main aircraft</span>
          <input
            value={draft.aircraft}
            onChange={(e) => update("aircraft", e.target.value)}
            placeholder="H130"
          />
        </label>
        <label className="field">
          <span>Flight hours</span>
          <input
            type="number"
            min={0}
            value={draft.hours}
            onChange={(e) => update("hours", Number(e.target.value))}
          />
          <small>Spoken as: {formatFlightHours(Math.max(0, Number(draft.hours) || 0))}</small>
        </label>
        <label className="field">
          <span>Aircraft type (singular)</span>
          <input
            value={draft.aircraftType}
            onChange={(e) => update("aircraftType", e.target.value)}
            placeholder="helicopter"
          />
        </label>
        <label className="field">
          <span>Operation type</span>
          <input
            value={draft.operationType}
            onChange={(e) => update("operationType", e.target.value)}
            placeholder="helicopter operations"
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => setDraft(DEFAULT_PROFILE)}
          >
            Reset default
          </button>
          <button type="button" className="btn green" onClick={handleSave}>
            Save profile
          </button>
        </div>
      </div>
    </div>
  );
}
