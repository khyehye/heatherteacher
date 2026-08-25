import Link from "next/link";
import registry from "@/lib/seriesRegistry.json";
import episodes from "@/lib/episodes.json";
import { themeColor } from "@/lib/themes";

export default function SeriesListPage() {
  const episodeList = Object.values(episodes);
  const newTracks = Object.values(registry).filter((s) => s.levelScheme === "per-episode-3tier");
  const legacyTracks = Object.values(registry).filter((s) => s.levelScheme === "sequential-tier");

  const renderGrid = (list) => (
    <div className="grid" style={{ marginBottom: 32 }}>
      {list.map((s) => {
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
  );

  return (
    <main className="container">
      <Link href="/" className="muted" style={{ fontSize: 13 }}>
        ← 홈
      </Link>
      <h1 style={{ fontSize: 24, margin: "12px 0 24px" }}>시리즈 전체보기</h1>

      <h2 style={{ fontSize: 16, marginBottom: 10 }}>101~600회차 · 5대 테마 트랙</h2>
      {renderGrid(newTracks)}

      <h2 style={{ fontSize: 16, marginBottom: 10 }}>1~100회차 · 기초 문법 커리큘럼</h2>
      {renderGrid(legacyTracks)}
    </main>
  );
}
