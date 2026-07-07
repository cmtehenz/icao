import type { KnowledgeReviewMeta } from "@/lib/knowledge/review";

type Props = {
  review: KnowledgeReviewMeta;
};

export default function KnowledgeReviewPanel({ review }: Props) {
  return (
    <aside className="word-mission-knowledge-review" aria-label="Knowledge review">
      <p className="word-mission-knowledge-review-title">Knowledge Review</p>
      <dl className="word-mission-knowledge-review-list">
        <div>
          <dt>Source</dt>
          <dd>{review.primarySource ?? "Legacy fallback"}</dd>
        </div>
        <div>
          <dt>Entry</dt>
          <dd>{review.entryId ?? "—"}</dd>
        </div>
        <div>
          <dt>Version</dt>
          <dd>{review.version ?? "—"}</dd>
        </div>
        <div>
          <dt>Curated</dt>
          <dd>{review.curated ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt>Fallback</dt>
          <dd>{review.fallbackUsed ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt>Generated</dt>
          <dd>{review.generated ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt>References</dt>
          <dd>{review.referenceCount}</dd>
        </div>
      </dl>
    </aside>
  );
}
