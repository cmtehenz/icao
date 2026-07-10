"use client";

import { CATEGORIES } from "@/lib/categories";
import {
  EUROSAFETY_CHANNEL_URL,
  isEuroSafetyVideo,
  youtubeEmbedUrl,
  type IcaoFlixVideo,
} from "@/data/icaoFlix/catalog";

type Props = {
  video: IcaoFlixVideo;
  watched: boolean;
  onClose: () => void;
  onMarkWatched: () => void;
};

export default function IcaoFlixVideoDetail({ video, watched, onClose, onMarkWatched }: Props) {
  const isEuro = isEuroSafetyVideo(video);

  return (
    <div className="iflix-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="iflix-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="iflix-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="iflix-modal-header">
          <div className="iflix-modal-title-wrap">
            <div className="iflix-card-badges">
              <span className="iflix-cat-badge">{CATEGORIES[video.category]}</span>
              {isEuro && <span className="iflix-source-badge">EuroSafety</span>}
            </div>
            <h2 id="iflix-modal-title">{video.title}</h2>
          </div>
          <button type="button" className="btn icon-btn secondary iflix-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="iflix-modal-player part1-brief-video-frame">
          <iframe
            src={youtubeEmbedUrl(video.youtubeId)}
            title={video.title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="iflix-modal-body">
          <p className="iflix-modal-meta">{video.source}</p>
          <p className="iflix-modal-why">{video.why}</p>
          {video.tags.length > 0 && (
            <ul className="iflix-tag-list" aria-label="Tags">
              {video.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
          {isEuro && (
            <a
              href={EUROSAFETY_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="iflix-channel-link iflix-modal-channel-link"
            >
              Mais vídeos no canal EuroSafety Training ↗
            </a>
          )}
        </div>

        <footer className="iflix-modal-footer">
          {watched ? (
            <span className="iflix-watched-label">✓ Marcado como visto</span>
          ) : (
            <button type="button" className="btn primary" onClick={onMarkWatched}>
              Marcar como visto
            </button>
          )}
          <button type="button" className="btn secondary" onClick={onClose}>
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}
