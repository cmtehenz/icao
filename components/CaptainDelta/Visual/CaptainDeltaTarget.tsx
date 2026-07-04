"use client";

import { type ElementType, type ReactNode } from "react";
import { useCaptainDeltaVisual } from "@/components/CaptainDelta/Visual/CaptainDeltaVisualProvider";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** When collapsed by Captain, hide this target (default true). */
  hideWhenCollapsed?: boolean;
};

export default function CaptainDeltaTarget({
  id,
  children,
  className = "",
  as: Tag = "span",
  hideWhenCollapsed = true,
}: Props) {
  const visual = useCaptainDeltaVisual();
  const hl = visual?.highlightClass(id) ?? "";
  const collapsed = visual?.isCollapsed(id) ?? false;

  if (collapsed && hideWhenCollapsed) {
    return null;
  }

  return (
    <Tag
      data-captain-target={id}
      className={`cdv-target ${className} ${hl}`.trim()}
    >
      {children}
    </Tag>
  );
}
