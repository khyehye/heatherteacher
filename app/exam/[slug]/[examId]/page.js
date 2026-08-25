import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import examSets from "@/lib/examSets.json";
import registry from "@/lib/seriesRegistry.json";
import { themeColor } from "@/lib/themes";
import MultipleChoiceQuiz from "@/components/MultipleChoiceQuiz";
import SentenceTransformQuiz from "@/components/SentenceTransformQuiz";
import DialogueCompletionQuiz from "@/components/DialogueCompletionQuiz";
import ReadingComprehensionQuiz from "@/components/ReadingComprehensionQuiz";

const COMPONENT_BY_TYPE = {
  "vocab-matching": MultipleChoiceQuiz,
  "multiple-choice": MultipleChoiceQuiz,
  "sentence-transform": SentenceTransformQuiz,
  "dialogue-completion": DialogueCompletionQuiz,
  "reading-comprehension": ReadingComprehensionQuiz
};

export default function ExamTakePage({ params }) {
  const examId = decodeURIComponent(params.examId);
  const examSet = examSets[examId];
  if (!examSet) notFound();

  const filePath = path.join(process.cwd(), "lib", examSet.questionFile);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const series = registry[examSet.seriesSlug];
  const QuizComponent = COMPONENT_BY_TYPE[examSet.examType];

  return (
    <main className="container">
      <Link href="/exam" className="muted" style={{ fontSize: 13 }}>
        ← 시험보기
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0 6px" }}>
        <span className="badge" style={{ background: themeColor(series?.themeColor) }}>
          {examSet.seriesSlug}
        </span>
        <span className="muted" style={{ fontSize: 13 }}>{examSet.level}</span>
      </div>
      <h1 style={{ fontSize: 22, margin: "0 0 20px" }}>{examSet.title}</h1>

      {QuizComponent ? (
        <QuizComponent questions={questions} />
      ) : (
        <p className="muted">이 examType({examSet.examType})에 맞는 컴포넌트가 아직 없어요.</p>
      )}
    </main>
  );
}
