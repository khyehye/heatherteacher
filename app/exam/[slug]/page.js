import Link from "next/link";
import { notFound } from "next/navigation";
import examSets from "@/lib/examSets.json";
import seriesRegistry from "@/lib/seriesRegistry.json";
import { seriesCode } from "@/lib/seriesCode";
import BackLink from "@/components/BackLink";

export function generateMetadata({ params }) {
  const slug = decodeURIComponent(params.slug);
  const series = seriesRegistry[slug];
  return { title: series ? `${series.name} 테스트 | Grammar Card News` : "문법 테스트" };
}

export default function ExamSetListPage({ params }) {
  const slug = decodeURIComponent(params.slug);
  const series = seriesRegistry[slug];
  if (!series?.examConfig?.enabled) notFound();

  const sets = Object.values(examSets)
    .filter((set) => set.status === "published" && set.seriesSlug === slug)
    .sort((a, b) => a.setNumber - b.setNumber);

  return (
    <main className="container reading-container exam-page">
      <BackLink label="테스트 카테고리" />
      <div className="exam-hero category-hero">
        <p className="eyebrow">{seriesCode(slug)} · {series.name}</p>
        <h1 className="page-title">{series.name}<br />시험지</h1>
        <p>{series.description}. SET을 선택하면 10문제 시험이 시작됩니다.</p>
      </div>

      <div className="exam-summary">
        <span>{sets.length} TEST SETS</span>
        <span>{sets.reduce((sum, set) => sum + set.questionCount, 0)} QUESTIONS</span>
      </div>

      <div className="exam-grid set-grid">
        {sets.map((set) => (
          <Link key={set.examId} href={`/exam/${encodeURIComponent(slug)}/${encodeURIComponent(set.examId)}`} className="exam-card set-card">
            <div className="exam-card-top">
              <span className="tag-code">SET</span>
              <span>{String(set.setNumber).padStart(2, "0")}</span>
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
