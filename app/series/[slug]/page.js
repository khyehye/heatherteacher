import Link from "next/link";
import { notFound } from "next/navigation";
import registry from "@/lib/seriesRegistry.json";
import episodes from "@/lib/episodes.json";
import { seriesCode } from "@/lib/seriesCode";

export default function SeriesHubPage({ params, searchParams }) {
  const slug = decodeURIComponent(params.slug);
  const series = registry[slug];
  if (!series) notFound();

  const levelFilter = searchParams?.level;
  let list = Object.values(episodes)
    .filter((e) => e.seriesSlug === slug)
    .sort((a, b) => a.inSeriesNumber - b.inSeriesNumber);

  if (levelFilter) {
    list = list.filter((e) => e.level === levelFilter);
  }

  return (
    <main className="container">
      <Link href="/series" className="back-link">시리즈 전체보기</Link>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 6px" }}>
        <span className="tag-code">{seriesCode(slug)}</span>
      </div>
      <h1 className="page-title diagram-underline">{series.name}</h1>
      <p className="muted" style={{ fontSize: 13, margin: "16px 0 24px" }}>{series.description}</p>

      {series.levels?.length > 1 && (
        <div style={{ display: "flex", gap: 20, marginBottom: 24, fontFamily: "var(--mono)", fontSize: 12 }}>
          <Link href={`/series/${encodeURIComponent(slug)}`} style={{ fontWeight: !levelFilter ? 600 : 400, color: !levelFilter ? "var(--ink)" : "var(--muted)" }}>
            ALL
          </Link>
          {series.levels.map((lv) => (
            <Link
              key={lv}
              href={`/series/${encodeURIComponent(slug)}?level=${lv}`}
              style={{ fontWeight: levelFilter === lv ? 600 : 400, color: levelFilter === lv ? "var(--ink)" : "var(--muted)" }}
            >
              {lv.toUpperCase()}
            </Link>
          ))}
        </div>
      )}

      {series.examConfig?.enabled && (
        <Link href={`/exam?series=${encodeURIComponent(slug)}`} className="entry-card" style={{ display: "block", marginBottom: 24 }}>
          <span className="tag-label">시험보기 →</span>
          <p style={{ fontSize: 13, margin: "6px 0 0", color: "var(--muted)" }}>{series.examConfig.examTypeLabel}</p>
        </Link>
      )}

      {list.length === 0 ? (
        <p className="muted">아직 공개된 회차가 없어요.</p>
      ) : (
        <div className="index-list">
          {list.map((e) => (
            <Link key={e.globalId} href={`/episode/${e.globalId}`} className="index-row">
              <span className="index-num">{String(e.globalId).padStart(3, "0")}</span>
              <span className="index-title">{e.title}</span>
              <span className="index-meta">{e.level}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
