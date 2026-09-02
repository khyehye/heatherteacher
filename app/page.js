import Link from "next/link";
import registry from "@/lib/seriesRegistry.json";
import episodes from "@/lib/episodes.json";
import { seriesCode } from "@/lib/seriesCode";

export default function HomePage() {
  const episodeList = Object.values(episodes);
  const published = episodeList.filter((e) => e.status === "published");
  const recent = [...published].sort((a, b) => b.globalId - a.globalId).slice(0, 6);

  return (
    <main className="container">
      <p className="eyebrow" style={{ marginBottom: 8 }}>@heather._.teacher</p>
      <h1 className="page-title diagram-underline">문법카드뉴스</h1>
      <p className="muted" style={{ fontSize: 13, margin: "16px 0 40px", fontFamily: "var(--mono)" }}>
        {episodeList.length} REGISTERED · {published.length} PUBLISHED
      </p>

      <p className="eyebrow" style={{ marginBottom: 12 }}>Series</p>
      <div className="series-grid" style={{ marginBottom: 48 }}>
        {Object.values(registry).map((s) => {
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

      <p className="eyebrow" style={{ marginBottom: 12 }}>Recent</p>
      <div className="index-list">
        {recent.map((e) => (
          <Link key={e.globalId} href={`/episode/${e.globalId}`} className="index-row">
            <span className="index-num">{String(e.globalId).padStart(3, "0")}</span>
            <span className="index-title">{e.title}</span>
            <span className="index-meta">{seriesCode(e.seriesSlug)}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
