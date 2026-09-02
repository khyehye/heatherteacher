import Link from "next/link";
import examSets from "@/lib/examSets.json";
import { seriesCode } from "@/lib/seriesCode";
import BackLink from "@/components/BackLink";

export default function ExamListPage() {
  const sets = Object.values(examSets);

  return (
    <main className="container">
      <BackLink label="홈" />
      <h1 className="page-title diagram-underline" style={{ margin: "16px 0 8px" }}>시험보기</h1>
      <p className="muted" style={{ fontSize: 13, marginBottom: 32 }}>
        트랙별로 쌓인 회차를 모아 실전처럼 풀어보는 시험 세트예요.
      </p>
      <div className="index-list">
        {sets.map((s) => (
          <Link
            key={s.examId}
            href={`/exam/${encodeURIComponent(s.seriesSlug)}/${encodeURIComponent(s.examId)}`}
            className="index-row"
          >
            <span className="tag-code">{seriesCode(s.seriesSlug)}</span>
            <span className="index-title">{s.title}</span>
            <span className="index-meta">{s.level} · {s.questionCount}문항</span>
          </Link>
        ))}
      </div>
    </main>
  );
}