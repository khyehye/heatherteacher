"use client";
import { useState } from "react";
import Link from "next/link";
import ScoreBar from "./ScoreBar";

export default function SentenceTransformQuiz({ questions }) {
  const [answers, setAnswers] = useState({});
  const answer = (qid, idx) => {
    if (answers[qid] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  return (
    <div>
      <ScoreBar total={questions.length} answered={answeredCount} correct={correctCount} />
      {questions.map((q, questionIndex) => {
        const picked = answers[q.id];
        const done = picked !== undefined;
        return (
          <div key={q.id} className="entry-card">
            <p className="question-number">Q{String(questionIndex + 1).padStart(2, "0")}</p>
            <p className="muted" style={{ fontSize: 12, marginBottom: 4 }}>원문</p>
            <p style={{ fontSize: 15, marginBottom: 6 }}>{q.originalSentence}</p>
            <p style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--ink-soft)", marginBottom: 10 }}>{q.instruction}</p>
            {q.options.map((opt, i) => {
              let cls = "opt";
              if (done && i === q.correctIndex) cls += " correct";
              else if (done && i === picked) cls += " wrong";
              return (
                <button key={i} className={cls} onClick={() => answer(q.id, i)} disabled={done}>
                  {opt}
                </button>
              );
            })}
            {done && (
              <div className={`feedback-box ${picked === q.correctIndex ? "correct" : "wrong"}`}>
                {picked === q.correctIndex ? "정답입니다. " : "오답이에요. "}
                {q.explanation}
                {q.sourceEpisode && (
                  <>
                    {" "}
                    <Link href={`/episode/${q.sourceEpisode}`}>→ {q.sourceEpisode}회차 복습하기</Link>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
