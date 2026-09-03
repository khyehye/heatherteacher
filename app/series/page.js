import Link from "next/link";
import registry from "@/lib/seriesRegistry.json";
import episodes from "@/lib/episodes.json";
import { seriesCode } from "@/lib/seriesCode";
import BackLink from "@/components/BackLink";

export default function SeriesListPage() {
  const episodeList = Object.values(episodes).filter((e) => e.status === "published");
  const skillTracks = Object.values(registry).filter((s) => s.levelScheme === "per-episode-3tier");
  const foundation = Object.values(registry).filter((s) => s.levelScheme === "sequential-tier");

  const renderGrid = (list, variant) => (
    <div className={`series-grid ${variant === "tracks" ? "series-grid-tracks" : ""}`}>
      {list.map((s) => {
        const count = episodeList.filter((e) => e.seriesSlug === s.slug).length;
        return (
          <Link key={s.slug} href={`/series/${encodeURIComponent(s.slug)}`} className="series-cell">
            <div className="series-cell-top">
              <span className="tag-code">{seriesCode(s.slug)}</span>
              <span className="series-cell-arrow">↗</span>
            </div>
            <h3 className="name">{s.name}</h3>
            <p className="desc">{s.description}</p>
            <p className={`count ${count === 0 ? "is-soon" : ""}`}>
              {count === 0 ? "Coming soon" : `${count} / ${s.totalPlanned} 공개`}
            </p>
          </Link>
        );
      })}
    </div>
  );

  return (
    <main className="container">
      <BackLink label="홈" />
      <div className="page-intro">
        <p className="eyebrow">All series</p>
        <h1 className="page-title">시리즈 전체보기</h1>
        <p>순서대로 기초를 쌓거나, 필요한 영역만 골라 공부할 수 있어요.</p>
      </div>

      <section className="catalog-section">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Foundation</p>
            <h2>단계별 문법 커리큘럼</h2>
          </div>
        </div>
        {renderGrid(foundation, "foundation")}
      </section>

      <section className="catalog-section">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Skill tracks</p>
            <h2>주제별 집중 학습</h2>
          </div>
        </div>
        {renderGrid(skillTracks, "tracks")}
      </section>
    </main>
  );
}
