"use client";

import { useState } from "react";
import { savePostExamResult } from "@/lib/academy/career";
import { ACADEMY_CHANGE_EVENT } from "@/lib/academy/store";

export default function PostExamPanel() {
  const [level, setLevel] = useState(4);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePostExamResult(level, note.trim());
    setSaved(true);
    window.dispatchEvent(new Event(ACADEMY_CHANGE_EVENT));
  };

  if (saved) {
    return (
      <section className="cda-post-exam cda-post-exam-done">
        <h2>Welcome back, pilot</h2>
        <p>
          Captain Delta recorded your exam experience. Your new career goals are ready below.
        </p>
      </section>
    );
  }

  return (
    <section className="cda-post-exam">
      <h2>How did your exam go?</h2>
      <p>Captain Delta wants to hear about your ICAO exam — then we set your next goals.</p>
      <form onSubmit={handleSubmit} className="cda-post-exam-form">
        <label>
          ICAO level achieved
          <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
            {[3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                Level {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          Your observations
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How did you feel? What surprised you?"
            rows={3}
          />
        </label>
        <button type="submit" className="btn purple">
          Share with Captain Delta
        </button>
      </form>
    </section>
  );
}
