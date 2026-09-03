import Link from "next/link";
import examSets from "@/lib/examSets.json";
import { seriesCode } from "@/lib/seriesCode";
import BackLink from "@/components/BackLink";

export const metadata = {
  title: "문법 테스트 | Grammar Card News"
};

export default function ExamListPage({ searchParams }) {
  const requestedSeries = searchParams?.series;
  const sets = Object.values(examSets).filter((set) =>
    set.status === "published" && (!requestedSeries || set.seriesSlug === requestedSeries)
  );

  return (
    <main className="container reading-container exam-page">
      <BackLink label="홈" />
      <div className="exam-hero">
        <p className="eyebrow">{requestedSeries ? `${seriesCode(requestedSeries)} · ${requestedSeries}` : "Grammar tests"}</p>
        <h1 className="page-title">배운 내용을<br />문제로 확인해보세요.</h1>
        <p>현재 공개된 카드뉴스에서 고른 핵심 문항입니다. 답을 고르면 바로 해설과 복습 회차를 확인할 수 있어요.</p>
      </div>

      <div className="exam-summary">
        <span>{sets.length} TEST SETS</span>
        <span>{sets.reduce((sum, set) => sum + set.questionCount, 0)} QUESTIONS</span>
      </div>

      <div className="exam-grid">
        {sets.map((set, index) => (
          <Link
            key={set.examId}
            href={`/exam/${encodeURIComponent(set.seriesSlug)}/${encodeURIComponent(set.examId)}`}
            className="exam-card"
          >
            <div className="exam-card-top">
              <span className="tag-code">{seriesCode(set.seriesSlug)}</span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{set.title}</h2>
            <p>{set.description}</p>
            <div className="exam-card-meta">
              <span>{set.level}</span>
              <span>{set.questionCount}문항</span>
              <strong>시작하기 →</strong>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
