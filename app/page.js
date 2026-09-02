import Link from "next/link";
import episodes from "@/lib/episodes.json";
import examSets from "@/lib/examSets.json";
import { seriesCode } from "@/lib/seriesCode";

export default function HomePage() {
  const episodeList = Object.values(episodes);
  const published = episodeList.filter((e) => e.status === "published");
  const recent = [...published].sort((a, b) => b.globalId - a.globalId).slice(0, 6);
  const examCount = Object.keys(examSets).length;

  return (
    <main className="container">
      <p className="eyebrow" style={{ marginBottom: 8 }}>@heather._.teacher</p>
      <h1 className="page-title diagram-underline">문법카드뉴스</h1>
      <p className="muted" style={{ fontSize: 13, margin: "16px 0 40px", fontFamily: "var(--mono)" }}>
        {episodeList.length} REGISTERED · {published.length} PUBLISHED
      </p>

      <div className="hub-grid" style={{ marginBottom: 48 }}>
        <Link href="/series" className="hub-cell">
          <p className="hub-title">시리즈</p>
          <p className="hub-desc">트랙별로 정리된 카드뉴스를 회차 순서대로 둘러보세요.</p>
          <p className="hub-count">{published.length} / {episodeList.length} 회차 공개</p>
        </Link>
        <Link href="/exam" className="hub-cell">
          <p className="hub-title">테스트</p>
          <p className="hub-desc">쌓인 회차를 모아 실전처럼 풀어보는 시험 세트예요.</p>
          <p className="hub-count">{examCount}개 세트 · 준비 중</p>
        </Link>
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