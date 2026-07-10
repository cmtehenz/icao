"use client";

import { getPart1BriefPack } from "@/data/part1/briefResources";

type Props = {
  cardNum: string;
};

export default function Part1BriefResources({ cardNum }: Props) {
  const pack = getPart1BriefPack(cardNum);
  if (!pack.videos.length && !pack.links.length) return null;

  return (
    <section className="part1-brief-resources" aria-label="Briefing references">
      <p className="part1-brief-resources-lead">
        Watch before you build your answer — FAA helicopter briefing practice and CRM (crew resource
        management). Sources: FAA Rotorcraft Collective, SKYbrary OGHFA.
      </p>

      {pack.videos.length > 0 && (
        <ul className="part1-brief-video-list">
          {pack.videos.map((video) => (
            <li key={video.youtubeId} className="part1-brief-video-item">
              <div className="part1-brief-video-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="part1-brief-video-title">{video.title}</p>
              <p className="part1-brief-video-meta">
                {video.source} — {video.why}
              </p>
            </li>
          ))}
        </ul>
      )}

      {pack.links.length > 0 && (
        <ul className="part1-brief-link-list">
          {pack.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="part1-brief-link">
                {link.title}
              </a>
              <span className="part1-brief-link-meta">
                {" "}
                · {link.source} — {link.why}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
