import Link from "next/link";
import registry from "@/lib/seriesRegistry.json";
import episodes from "@/lib/episodes.json";
import { seriesCode } from "@/lib/seriesCode";
import BackLink from "@/components/BackLink";

export default function SeriesListPage() {
  const episodeList = Object.values(episodes);
  const newTracks = Object.values(registry).filter((s) => s.levelScheme === "per-episode-3tier");
  const legacyTracks = Object.values(registry).filter((s) => s.levelScheme === "sequential-tier");

  const renderGrid = (list) => (
    <div className="series-grid" style={{ marginBottom: 48 }}>
      {list.map((s) => {
        const count = episodeList.filter((e) => e.seriesSlug === s.slug).length;
        return (
          <Link key={s.slug} href={`/series/${encodeURIComponent(s.slug)}`} className="series-cell">
            <div className="tag-code">{seriesCode(s.slug)}</div>
            <p className="name">{s.name}</p>
            <p className="desc">{s.description}</p>
            <p className="count">{count} / {s.totalPlanned}</p>
          </Link>
        );
      })}
    </div>
  );

  return (
    <main className="container">
      <BackLink label="홈" />
      <h1 className="page-title diagram-underline" style={{ margin: "12px 0 32px" }}>시리즈 전체보기</h1>

      <p className="eyebrow" style={{ marginBottom: 12 }}>101–600 · 5 tracks</p>
      {renderGrid(newTracks)}

      <p className="eyebrow" style={{ marginBottom: 12 }}>1–100 · foundation</p>
      {renderGrid(legacyTracks)}
    </main>
  );
}