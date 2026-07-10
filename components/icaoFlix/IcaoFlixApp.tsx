"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { CATEGORIES, type Category } from "@/lib/categories";
import {
  EUROSAFETY_CHANNEL_URL,
  ICAO_FLIX_VIDEOS,
  getEuroSafetyVideos,
  getVideosByCategory,
  isEuroSafetyVideo,
  youtubeThumbnailUrl,
  type IcaoFlixVideo,
} from "@/data/icaoFlix/catalog";
import { buildDifficultyInsights } from "@/lib/difficultyInsights";
import {
  buildIcaoFlixRecommendations,
  pinnedRecommendations,
  type IcaoFlixRecommendation,
} from "@/lib/icaoFlix/recommendations";
import {
  ICAO_FLIX_CHANGE_EVENT,
  isVideoWatched,
  loadIcaoFlixProgress,
  markVideoWatched,
  type IcaoFlixProgress,
} from "@/lib/icaoFlix/progress";
import IcaoFlixVideoDetail from "./IcaoFlixVideoDetail";

type CategoryFilter = Category | "all" | "eurosafety";

export default function IcaoFlixApp() {
  const { theme, toggle: toggleTheme, hydrated } = useTheme();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [progress, setProgress] = useState<IcaoFlixProgress>(() => loadIcaoFlixProgress());
  const [selectedVideo, setSelectedVideo] = useState<IcaoFlixVideo | null>(null);

  const refreshProgress = useCallback(() => {
    setProgress(loadIcaoFlixProgress());
  }, []);

  useEffect(() => {
    refreshProgress();
    window.addEventListener(ICAO_FLIX_CHANGE_EVENT, refreshProgress);
    return () => window.removeEventListener(ICAO_FLIX_CHANGE_EVENT, refreshProgress);
  }, [refreshProgress]);

  const recommendations = useMemo(() => {
    const insights = buildDifficultyInsights(5);
    return buildIcaoFlixRecommendations(insights, progress, 6);
  }, [progress]);

  const pinned = useMemo(() => pinnedRecommendations(recommendations), [recommendations]);
  const euroSafetyVideos = useMemo(() => getEuroSafetyVideos(), []);

  const filteredVideos = useMemo(() => {
    if (category === "eurosafety") return euroSafetyVideos;
    return getVideosByCategory(category);
  }, [category, euroSafetyVideos]);

  const watchedCount = progress.watchedVideoIds.length;

  const handleMarkWatched = (videoId: string) => {
    markVideoWatched(videoId);
    refreshProgress();
  };

  return (
    <>
      <header className="header delta-header iflix-header">
        <div className="wrap delta-topbar">
          <div className="delta-brand">
            <span className="delta-logo iflix-logo">🎬</span>
            <div>
              <strong>ICAOFlix</strong>
              <span>Curated aviation video library</span>
            </div>
          </div>
          {hydrated && (
            <button type="button" className="btn icon-btn secondary" onClick={toggleTheme} aria-label="Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}
        </div>
      </header>

      <section className="hero hero-compact hero-delta iflix-hero">
        <div className="wrap hero-delta-inner iflix-hero-inner">
          <div className="iflix-hero-copy">
            <p className="iflix-eyebrow">Secondary library · speak-first mission unchanged</p>
            <h1>ICAOFlix</h1>
            <p className="sub hero-sub-compact iflix-hero-sub">
              Vídeos curados por categoria — FAA, EuroSafety Training e CRM. Complementa a missão diária;
              você controla quando apertar play.
            </p>
          </div>
          <div className="delta-dashboard delta-dashboard-compact iflix-stats" aria-label="Video progress">
            <div className="delta-stat mastered iflix-stat">
              <strong>{watchedCount}</strong>
              <span>vistos</span>
            </div>
            <div className="delta-stat iflix-stat">
              <strong>{ICAO_FLIX_VIDEOS.length}</strong>
              <span>no catálogo</span>
            </div>
            <div className="delta-stat difficult iflix-stat">
              <strong>{pinned.length}</strong>
              <span>Captain recomenda</span>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap iflix-body">
        {pinned.length > 0 && (
          <section className="iflix-section iflix-section-pinned" aria-label="Captain recommends">
            <div className="iflix-section-head">
              <div>
                <h2 className="iflix-section-title">Captain recomenda</h2>
                <p className="iflix-section-lead">
                  Assista pelo menos uma vez — destaque some quando você marcar como visto.
                </p>
              </div>
              <span className="iflix-section-badge">Prioridade</span>
            </div>
            <div className="iflix-scroll-row">
              {pinned.map((rec) => (
                <RecommendationCard
                  key={rec.video.id}
                  recommendation={rec}
                  watched={isVideoWatched(rec.video.id, progress)}
                  onSelect={() => setSelectedVideo(rec.video)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="iflix-section iflix-section-channel" aria-label="EuroSafety Training">
          <div className="iflix-channel-banner">
            <div className="iflix-channel-copy">
              <span className="iflix-channel-badge">Parceiro curado</span>
              <h2 className="iflix-section-title">EuroSafety Training</h2>
              <p className="iflix-section-lead">
                Cockpit real, preflight, rádio e emergências em helicóptero — vocabulário operacional de
                alto nível para Part 1 e Part 2.
              </p>
              <a
                href={EUROSAFETY_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="iflix-channel-link"
              >
                Ver canal no YouTube ↗
              </a>
            </div>
            <div className="iflix-scroll-row iflix-scroll-row-compact">
              {euroSafetyVideos.slice(0, 4).map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  watched={isVideoWatched(video.id, progress)}
                  compact
                  onSelect={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="iflix-section" aria-label="Browse by category">
          <h2 className="iflix-section-title">Explorar por categoria</h2>
          <div className="iflix-filters" role="tablist" aria-label="Category filters">
            <button
              type="button"
              role="tab"
              className={`iflix-filter-chip${category === "all" ? " active" : ""}`}
              aria-selected={category === "all"}
              onClick={() => setCategory("all")}
            >
              Todos
            </button>
            <button
              type="button"
              role="tab"
              className={`iflix-filter-chip iflix-filter-chip-euro${category === "eurosafety" ? " active" : ""}`}
              aria-selected={category === "eurosafety"}
              onClick={() => setCategory("eurosafety")}
            >
              EuroSafety
            </button>
            {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                className={`iflix-filter-chip${category === key ? " active" : ""}`}
                aria-selected={category === key}
                onClick={() => setCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="iflix-grid">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                watched={isVideoWatched(video.id, progress)}
                onSelect={() => setSelectedVideo(video)}
              />
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <p className="iflix-empty">Nenhum vídeo nesta categoria ainda.</p>
          )}
        </section>
      </div>

      {selectedVideo && (
        <IcaoFlixVideoDetail
          video={selectedVideo}
          watched={isVideoWatched(selectedVideo.id, progress)}
          onClose={() => setSelectedVideo(null)}
          onMarkWatched={() => handleMarkWatched(selectedVideo.id)}
        />
      )}
    </>
  );
}

function VideoCard({
  video,
  watched,
  compact = false,
  onSelect,
}: {
  video: IcaoFlixVideo;
  watched: boolean;
  compact?: boolean;
  onSelect: () => void;
}) {
  const isEuro = isEuroSafetyVideo(video);

  return (
    <button
      type="button"
      className={`iflix-card${watched ? " watched" : ""}${compact ? " compact" : ""}${isEuro ? " euro" : ""}`}
      onClick={onSelect}
    >
      <div className="iflix-card-thumb">
        <img src={youtubeThumbnailUrl(video.youtubeId)} alt="" loading="lazy" />
        <span className="iflix-play-icon" aria-hidden="true">
          ▶
        </span>
        {video.durationMin != null && (
          <span className="iflix-duration">{video.durationMin} min</span>
        )}
        {watched && <span className="iflix-watched-badge">Visto</span>}
      </div>
      <div className="iflix-card-body">
        <div className="iflix-card-badges">
          <span className="iflix-cat-badge">{CATEGORIES[video.category]}</span>
          {isEuro && <span className="iflix-source-badge">EuroSafety</span>}
        </div>
        <h3>{video.title}</h3>
        <p className="iflix-card-meta">{video.source}</p>
        {!compact && <p className="iflix-card-why">{video.why}</p>}
      </div>
    </button>
  );
}

function RecommendationCard({
  recommendation,
  watched,
  onSelect,
}: {
  recommendation: IcaoFlixRecommendation;
  watched: boolean;
  onSelect: () => void;
}) {
  const { video, reason } = recommendation;

  return (
    <button
      type="button"
      className={`iflix-card iflix-card-pinned${watched ? " watched" : ""}`}
      onClick={onSelect}
    >
      <div className="iflix-card-thumb">
        <img src={youtubeThumbnailUrl(video.youtubeId)} alt="" loading="lazy" />
        <span className="iflix-play-icon" aria-hidden="true">
          ▶
        </span>
        <span className="iflix-pin-badge">Captain</span>
      </div>
      <div className="iflix-card-body">
        <p className="iflix-card-reason">{reason}</p>
        <h3>{video.title}</h3>
        <p className="iflix-card-meta">{video.source}</p>
      </div>
    </button>
  );
}
