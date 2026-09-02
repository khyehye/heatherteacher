import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import examSets from "@/lib/examSets.json";
import { seriesCode } from "@/lib/seriesCode";
import BackLink from "@/components/BackLink";
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
  const QuizComponent = COMPONENT_BY_TYPE[examSet.examType];

  return (
    <main className="container">
      <BackLink label="시험보기" />
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 6px" }}>
        <span className="tag-code">{seriesCode(examSet.seriesSlug)}</span>
        <span className="tag-label">{examSet.level}</span>
      </div>
      <h1 className="page-title diagram-underline" style={{ marginBottom: 28 }}>{examSet.title}</h1>

      {QuizComponent ? (
        <QuizComponent questions={questions} />
      ) : (
        <p className="muted">이 examType({examSet.examType})에 맞는 컴포넌트가 아직 없어요.</p>
      )}
    </main>
  );
}