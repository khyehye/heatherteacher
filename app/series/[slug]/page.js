import Link from "next/link";
import { notFound } from "next/navigation";
import registry from "@/lib/seriesRegistry.json";
import episodes from "@/lib/episodes.json";
import { seriesCode } from "@/lib/seriesCode";
import BackLink from "@/components/BackLink";

export default function SeriesHubPage({ params, searchParams }) {
  const slug = decodeURIComponent(params.slug);
  const series = registry[slug];
  if (!series) notFound();

  const levelFilter = searchParams?.level;
  const allSeriesEpisodes = Object.values(episodes)
    .filter((e) => e.seriesSlug === slug && e.status === "published")
    .sort((a, b) => a.inSeriesNumber - b.inSeriesNumber);
  let list = allSeriesEpisodes;

  if (levelFilter) {
    list = list.filter((e) => e.level === levelFilter);
  }

  return (
    <main className="container reading-container">
      <BackLink label="시리즈 전체보기" />
      <div className="series-hero">
        <span className="series-code-hero">{seriesCode(slug)}</span>
        <div>
          <p className="eyebrow">Series</p>
          <h1 className="page-title">{series.name}</h1>
          <p>{series.description}</p>
          <span className="series-count-label">
            {allSeriesEpisodes.length > 0 ? `${allSeriesEpisodes.length} / ${series.totalPlanned} 공개` : "Coming soon"}
          </span>
          <div className="series-progress" aria-label={`${series.totalPlanned}회 중 ${allSeriesEpisodes.length}회 공개`}>
            <span style={{ width: `${Math.min(100, Math.round((allSeriesEpisodes.length / series.totalPlanned) * 100))}%` }} />
          </div>
        </div>
      </div>

      {series.levels?.length > 1 && (
        <div className="filter-tabs">
          <Link href={`/series/${encodeURIComponent(slug)}`} className={!levelFilter ? "active" : ""}>
            ALL
          </Link>
          {series.levels.map((lv) => (
            <Link
              key={lv}
              href={`/series/${encodeURIComponent(slug)}?level=${lv}`}
              className={levelFilter === lv ? "active" : ""}
            >
              {lv.toUpperCase()}
            </Link>
          ))}
        </div>
      )}

      {series.examConfig?.enabled && (
        <Link href={`/exam?series=${encodeURIComponent(slug)}`} className="exam-callout">
          <span>
            <strong>이 시리즈 테스트하기</strong>
            <small>{series.examConfig.examTypeLabel}</small>
          </span>
          <span>→</span>
        </Link>
      )}

      {list.length === 0 ? (
        <div className="empty-state">
          <p className="eyebrow">Coming soon</p>
          <h2>첫 번째 카드뉴스를 준비하고 있어요.</h2>
          <p>조금만 기다려주세요.</p>
        </div>
      ) : (
        <div className="index-list">
          {list.map((e) => (
            <Link key={e.globalId} href={`/episode/${e.globalId}`} className="index-row">
              <span className="series-position-num">
                <strong>{String(e.inSeriesNumber).padStart(2, "0")}</strong>
                <small>/ {String(series.totalPlanned).padStart(2, "0")}</small>
              </span>
              <span className="index-title">{e.title}</span>
              <span className="index-meta">No. {String(e.globalId).padStart(3, "0")} · {e.level}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
