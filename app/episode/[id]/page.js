import Link from "next/link";
import { notFound } from "next/navigation";
import episodes from "@/lib/episodes.json";
import registry from "@/lib/seriesRegistry.json";
import { themeColor, slideImageUrl } from "@/lib/themes";

export default function EpisodeImagePage({ params }) {
  const episode = episodes[params.id];
  if (!episode) notFound();
  const series = registry[episode.seriesSlug];

  const relatedList = Object.values(episodes)
    .filter((e) => e.category === episode.category && e.globalId !== episode.globalId)
    .slice(0, 3);

  return (
    <main className="container">
      <Link href={`/series/${encodeURIComponent(episode.seriesSlug)}`} className="muted" style={{ fontSize: 13 }}>
        ← {episode.seriesSlug}
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0 6px" }}>
        <span className="badge" style={{ background: themeColor(series?.themeColor) }}>
          {episode.seriesSlug}
        </span>
        <span className="muted" style={{ fontSize: 13 }}>
          {episode.level} · {episode.kind === "overview" ? "개관" : "상세"}
        </span>
      </div>
      <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>
        {episode.globalId}회차 · {episode.title}
      </h1>
      <p className="muted" style={{ marginBottom: 16 }}>{episode.summary}</p>

      <div className="carousel" style={{ marginBottom: 8 }}>
        {Array.from({ length: episode.slideCount }, (_, i) => i + 1).map((n) => (
          <img
            key={n}
            src={slideImageUrl(episode.imageFolder, n)}
            alt={`${episode.globalId}회차 슬라이드 ${n}`}
            loading="lazy"
          />
        ))}
      </div>
      <p className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
        이미지는 lib/themes.js의 IMAGE_BASE_URL(jsDelivr) 경로에서 불러옵니다.
      </p>

      <div className="toggle-row">
        <Link href={`/episode/${episode.globalId}`} className="active">이미지로 보기</Link>
        <Link href={`/episode/${episode.globalId}/note`}>텍스트로 보기</Link>
      </div>

      {relatedList.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <p className="muted" style={{ fontSize: 12, marginBottom: 4 }}>관련 회차</p>
          {relatedList.map((e) => (
            <Link key={e.globalId} href={`/episode/${e.globalId}`} className="related-item">
              <span>{e.globalId}회차 · {e.title}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
