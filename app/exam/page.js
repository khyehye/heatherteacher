import Link from "next/link";
import examSets from "@/lib/examSets.json";
import seriesRegistry from "@/lib/seriesRegistry.json";
import { seriesCode } from "@/lib/seriesCode";
import BackLink from "@/components/BackLink";

export const metadata = {
  title: "문법 테스트 | Grammar Card News"
};

export default function ExamCategoryPage() {
  const categories = Object.values(seriesRegistry)
    .filter((series) => series.examConfig?.enabled)
    .map((series) => {
      const sets = Object.values(examSets).filter(
        (set) => set.status === "published" && set.seriesSlug === series.slug
      );
      return {
        ...series,
        setCount: sets.length,
        questionCount: sets.reduce((sum, set) => sum + set.questionCount, 0)
      };
    });

  return (
    <main className="container reading-container exam-page">
      <BackLink label="홈" />
      <div className="exam-hero">
        <p className="eyebrow">Grammar tests</p>
        <h1 className="page-title">어떤 영역을<br />확인해볼까요?</h1>
        <p>카테고리를 고른 뒤 원하는 시험지를 선택하세요. 각 시험은 10문제로 구성되어 있습니다.</p>
      </div>

      <div className="exam-summary">
        <span>{categories.length} CATEGORIES</span>
        <span>{categories.reduce((sum, category) => sum + category.setCount, 0)} TEST SETS</span>
      </div>

      <div className="exam-grid category-grid">
        {categories.map((category, index) => (
          <Link key={category.slug} href={`/exam/${encodeURIComponent(category.slug)}`} className="exam-card category-card">
            <div className="exam-card-top">
              <span className="tag-code">{seriesCode(category.slug)}</span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <div className="exam-card-meta">
              <span>{category.setCount} SETS</span>
              <span>{category.questionCount}문항</span>
              <strong>시험지 보기 →</strong>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
