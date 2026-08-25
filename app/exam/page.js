import Link from "next/link";
import examSets from "@/lib/examSets.json";
import registry from "@/lib/seriesRegistry.json";
import { themeColor } from "@/lib/themes";

export default function ExamListPage() {
  const sets = Object.values(examSets);

  return (
    <main className="container">
      <Link href="/" className="muted" style={{ fontSize: 13 }}>
        ← 홈
      </Link>
      <h1 style={{ fontSize: 24, margin: "12px 0 6px" }}>시험보기</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        트랙별로 쌓인 회차를 모아 실전처럼 풀어보는 시험 세트예요.
      </p>
      <div className="grid">
        {sets.map((s) => {
          const series = registry[s.seriesSlug];
          return (
            <Link
              key={s.examId}
              href={`/exam/${encodeURIComponent(s.seriesSlug)}/${encodeURIComponent(s.examId)}`}
              className="card"
            >
              <span className="badge" style={{ background: themeColor(series?.themeColor) }}>
                {s.seriesSlug}
              </span>
              <p style={{ fontSize: 15, fontWeight: 600, margin: "10px 0 4px" }}>{s.title}</p>
              <p className="muted" style={{ fontSize: 12 }}>
                {s.level} · {s.questionCount}문항
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
