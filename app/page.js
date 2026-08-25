import Link from "next/link";
import registry from "@/lib/seriesRegistry.json";
import episodes from "@/lib/episodes.json";
import { themeColor } from "@/lib/themes";

export default function HomePage() {
  const episodeList = Object.values(episodes);
  const published = episodeList.filter((e) => e.status === "published");
  const recent = [...published].sort((a, b) => b.globalId - a.globalId).slice(0, 5);

  return (
    <main className="container">
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>문법카드뉴스</h1>
      <p className="muted" style={{ marginBottom: 28 }}>
        @heather._.teacher · {episodeList.length}개 회차 등록 · {published.length}개 공개
      </p>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>시리즈</h2>
      <div className="grid" style={{ marginBottom: 36 }}>
        {Object.values(registry).map((s) => {
          const count = episodeList.filter((e) => e.seriesSlug === s.slug).length;
          return (
            <Link key={s.slug} href={`/series/${encodeURIComponent(s.slug)}`} className="card">
              <span className="badge" style={{ background: themeColor(s.themeColor) }}>
                {s.name}
              </span>
              <p style={{ fontSize: 13, margin: "10px 0 0" }} className="muted">
                {s.description}
              </p>
              <p style={{ fontSize: 12, margin: "8px 0 0" }} className="muted">
                {count} / {s.totalPlanned}회차
              </p>
            </Link>
          );
        })}
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>최근 공개된 회차</h2>
      <div className="card">
        {recent.map((e) => (
          <Link key={e.globalId} href={`/episode/${e.globalId}`} className="related-item">
            <span>
              {e.globalId}회차 · {e.title}
            </span>
            <span className="muted">{e.seriesSlug}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
