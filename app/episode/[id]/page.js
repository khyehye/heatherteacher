import Link from "next/link";
import { notFound } from "next/navigation";
import episodes from "@/lib/episodes.json";
import { seriesCode } from "@/lib/seriesCode";
import { slideImageUrl } from "@/lib/themes";

export default function EpisodeImagePage({ params }) {
  const episode = episodes[params.id];
  if (!episode) notFound();

  const relatedList = Object.values(episodes)
    .filter((e) => e.category === episode.category && e.globalId !== episode.globalId)
    .slice(0, 3);

  return (
    <main className="container">
      <Link href={`/series/${encodeURIComponent(episode.seriesSlug)}`} className="back-link">
        {episode.seriesSlug}
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 6px" }}>
        <span className="tag-code">{seriesCode(episode.seriesSlug)}</span>
        <span className="tag-label">{episode.level} · {episode.kind === "overview" ? "개관" : "상세"}</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--muted)", marginRight: 8 }}>
          No. {String(episode.globalId).padStart(3, "0")}
        </span>
        {episode.title}
      </h1>
      <p className="muted" style={{ fontSize: 13, margin: "10px 0 20px" }}>{episode.summary}</p>

      <div className="tab-row">
        <Link href={`/episode/${episode.globalId}`} className="tab-item active">이미지</Link>
        <Link href={`/episode/${episode.globalId}/note`} className="tab-item">텍스트</Link>
      </div>

      <div className="carousel">
        {Array.from({ length: episode.slideCount }, (_, i) => i + 1).map((n) => (
          <img
            key={n}
            src={slideImageUrl(episode.imageFolder, n)}
            alt={`${episode.globalId}회차 슬라이드 ${n}`}
            loading="lazy"
          />
        ))}
      </div>

      {relatedList.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Related</p>
          <div className="index-list">
            {relatedList.map((e) => (
              <Link key={e.globalId} href={`/episode/${e.globalId}`} className="index-row">
                <span className="index-num">{String(e.globalId).padStart(3, "0")}</span>
                <span className="index-title">{e.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
