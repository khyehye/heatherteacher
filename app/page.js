import Link from "next/link";
import episodes from "@/lib/episodes.json";
import registry from "@/lib/seriesRegistry.json";
import examSets from "@/lib/examSets.json";
import { seriesCode } from "@/lib/seriesCode";

export default function HomePage() {
  const episodeList = Object.values(episodes);
  const published = episodeList.filter((e) => e.status === "published");
  const recent = [...published].sort((a, b) => b.globalId - a.globalId).slice(0, 4);
  const foundation = Object.values(registry).filter((s) => s.levelScheme === "sequential-tier");
  const skillTracks = Object.values(registry).filter((s) => s.levelScheme === "per-episode-3tier");
  const publishedTests = Object.values(examSets).filter((exam) => exam.status === "published");

  const publishedCount = (slug) =>
    published.filter((episode) => episode.seriesSlug === slug).length;

  return (
    <main>
      <section className="hero container">
        <p className="eyebrow">@heather._.teacher</p>
        <h1>영어 문법,<br />한 장씩 제대로.</h1>
        <p className="hero-copy">
          초등 기초부터 수능 어법까지.<br className="mobile-break" /> 필요한 문법을 순서대로 공부해보세요.
        </p>
        <div className="hero-actions">
          <Link href="/episode/1" className="button button-primary">처음부터 공부하기 <span>→</span></Link>
          <Link href="/series" className="button button-secondary">시리즈 둘러보기</Link>
        </div>
        <p className="hero-status">현재 {published.length}개 회차 공개</p>
      </section>

      <section className="section container">
        <div className="start-card">
          <div className="start-index">01</div>
          <div className="start-content">
            <p className="eyebrow">Start here</p>
            <h2>문법 공부가 처음이라면</h2>
            <p>문장의 생김새부터 차근차근. 초등영문법 커리큘럼으로 시작해보세요.</p>
            <div className="start-meta">
              <span className="tag-code">EL</span>
              <span>{publishedCount("초등영문법")} / 30 lessons published</span>
            </div>
            <Link href="/episode/1" className="text-link">001부터 시작하기 <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Foundation</p>
            <h2>문법의 기초를 순서대로</h2>
          </div>
          <p>기초부터 고급까지 이어지는<br />단계별 문법 커리큘럼입니다.</p>
        </div>
        <div className="foundation-grid">
          {foundation.map((series) => {
            const count = publishedCount(series.slug);
            const percent = Math.round((count / series.totalPlanned) * 100);
            return (
              <Link href={`/series/${encodeURIComponent(series.slug)}`} className="foundation-card" key={series.slug}>
                <div className="card-topline">
                  <span className="series-code-large">{seriesCode(series.slug)}</span>
                  <span className="card-arrow">↗</span>
                </div>
                <h3>{series.name}</h3>
                <p>{series.description}</p>
                <div className="progress" aria-label={`${series.totalPlanned}개 중 ${count}개 공개`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <div className="progress-label">
                  {count > 0 ? <><strong>{count}</strong> / {series.totalPlanned} 공개</> : <span>Coming soon</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Skill tracks</p>
            <h2>필요한 영역만 골라서</h2>
          </div>
          <p>자주 틀리는 영역을 주제별로<br />집중해서 연습합니다.</p>
        </div>
        <div className="track-list">
          {skillTracks.map((series) => {
            const count = publishedCount(series.slug);
            return (
              <Link href={`/series/${encodeURIComponent(series.slug)}`} className="track-row" key={series.slug}>
                <span className="track-code">{seriesCode(series.slug)}</span>
                <span className="track-name">{series.name}</span>
                <span className="track-description">{series.description}</span>
                <span className={`track-status ${count === 0 ? "is-soon" : ""}`}>
                  {count === 0 ? "Coming soon" : `${count} lesson`}
                </span>
                <span className="track-arrow">→</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section container">
        <div className="section-heading recent-heading">
          <div>
            <p className="eyebrow">Recent</p>
            <h2>새로 올라온 카드뉴스</h2>
          </div>
          <Link href="/series" className="text-link desktop-link">전체보기 <span>→</span></Link>
        </div>
        <div className="recent-list">
          {recent.map((episode) => (
            <Link key={episode.globalId} href={`/episode/${episode.globalId}`} className="recent-row">
              <span className="recent-num">{String(episode.globalId).padStart(3, "0")}</span>
              <span className="recent-content">
                <strong>{episode.title}</strong>
                <small>{episode.summary}</small>
              </span>
              <span className="recent-series">{seriesCode(episode.seriesSlug)} · {episode.seriesSlug}</span>
              <span className="recent-arrow">→</span>
            </Link>
          ))}
        </div>
        <Link href="/series" className="text-link mobile-link">모든 카드뉴스 보기 <span>→</span></Link>
      </section>

      <section className="tests-teaser">
        <Link href="/exam" className="container tests-inner tests-link">
          <div>
            <p className="eyebrow">Tests</p>
            <h2>배운 문법,<br />얼마나 기억하고 있을까요?</h2>
          </div>
          <p>카드뉴스에서 공부한 내용을 {publishedTests.length}개의 실전 세트로 바로 확인해보세요.</p>
          <span className="tests-cta">테스트 시작하기 →</span>
        </Link>
      </section>
    </main>
  );
}
