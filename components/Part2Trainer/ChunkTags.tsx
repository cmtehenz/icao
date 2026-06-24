import type { ReadbackChunk, ReadbackChunkType } from "@/lib/part2/types";

const CHUNK_LABELS: Record<ReadbackChunkType, string> = {
  callsign: "Callsign",
  altitude: "Altitude",
  heading: "Heading",
  frequency: "Frequency",
  runway: "Runway",
  route: "Route",
  clearance: "Clearance",
  other: "Other",
};

type Props = {
  chunks: ReadbackChunk[];
};

export default function ChunkTags({ chunks }: Props) {
  return (
    <div className="chunk-tags">
      {chunks.map((chunk, i) => (
        <div key={`${chunk.type}-${i}`} className={`chunk-tag chunk-${chunk.type}`}>
          <span className="chunk-label">{CHUNK_LABELS[chunk.type]}</span>
          <span className="chunk-text">{chunk.text}</span>
        </div>
      ))}
    </div>
  );
}
