"use client";

import { type ReactNode } from "react";
import type { CopySegment } from "./constants";

// Renders a run of copy segments: plain text plus highlighted keywords.
export function Copy({ segments }: { segments: CopySegment[] }) {
  return (
    <>
      {segments.map((segment, i) =>
        typeof segment === "string" ? (
          segment
        ) : (
          <Keyword key={i} tooltip={segment.tooltip}>
            {segment.keyword}
          </Keyword>
        ),
      )}
    </>
  );
}

export function Keyword({
  children,
  tooltip,
}: {
  children: ReactNode;
  tooltip: string;
}) {
  return (
    <span
      className="keyword"
      data-tooltip={tooltip}
      data-cuelume-hover="tick"
      tabIndex={0}
    >
      {children}
    </span>
  );
}
