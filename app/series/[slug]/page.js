import Link from "next/link";
import { notFound } from "next/navigation";
import registry from "@/lib/seriesRegistry.json";
import episodes from "@/lib/episodes.json";
import { themeColor } from "@/lib/themes";

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
      <Link href="/series" className="muted" style={{ fontSize: 13 }}>
        ← 시리즈 전체보기
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 6px" }}>
        <span className="badge" style={{ background: themeColor(series.themeColor) }}>
          {series.name}
        </span>
      </div>
      <h1 style={{ fontSize: 24, margin: "0 0 8px" }}>{series.name}</h1>
      <p className="muted" style={{ marginBottom: 20 }}>{series.description}</p>

      {series.levels?.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <Link href={`/series/${encodeURIComponent(slug)}`} className="badge"
            style={{ background: !levelFilter ? "#333" : "#ccc" }}>
            전체
          </Link>
          {series.levels.map((lv) => (
            <Link
              key={lv}
              href={`/series/${encodeURIComponent(slug)}?level=${lv}`}
              className="badge"
              style={{ background: levelFilter === lv ? "#333" : "#ccc" }}
            >
              {lv}
            </Link>
          ))}
        </div>
      )}

      {series.examConfig?.enabled && (
        <Link href={`/exam?series=${encodeURIComponent(slug)}`} className="card" style={{ display: "block", marginBottom: 20 }}>
          <strong>{series.name} 시험보기 →</strong>
          <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>{series.examConfig.examTypeLabel}</p>
        </Link>
      )}

      {list.length === 0 ? (
        <p className="muted">아직 공개된 회차가 없어요.</p>
      ) : (
        <div className="grid">
          {list.map((e) => (
            <Link key={e.globalId} href={`/episode/${e.globalId}`} className="card">
              <p style={{ fontSize: 12 }} className="muted">
                {e.globalId}회차 · {e.level}
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, margin: "6px 0 0" }}>{e.title}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
