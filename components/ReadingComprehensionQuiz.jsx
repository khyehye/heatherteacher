"use client";
import { useState } from "react";
import Link from "next/link";
import ScoreBar from "./ScoreBar";

export default function ReadingComprehensionQuiz({ questions }) {
  const [answers, setAnswers] = useState({});
  const answer = (qid, idx) => {
    if (answers[qid] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter((q) => answers[q.id] === q.wrongIndex).length;

  return (
    <div>
      <ScoreBar total={questions.length} answered={answeredCount} correct={correctCount} />
      {questions.map((q) => {
        const picked = answers[q.id];
        const done = picked !== undefined;
        return (
          <div key={q.id} className="card" style={{ marginBottom: 12 }}>
            <p className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
              다음 글의 밑줄 친 부분 중, 어법상 틀린 것은?
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, marginBottom: 14 }}>{q.passage}</p>
            {q.options.map((opt, i) => {
              let cls = "opt";
              if (done && i === q.wrongIndex) cls += " correct";
              else if (done && i === picked) cls += " wrong";
              return (
                <button key={i} className={cls} onClick={() => answer(q.id, i)} disabled={done}>
                  {opt}
                </button>
              );
            })}
            {done && (
              <div className={`feedback-box ${picked === q.wrongIndex ? "correct" : "wrong"}`}>
                {picked === q.wrongIndex ? "정답입니다. " : "오답이에요. "}
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
