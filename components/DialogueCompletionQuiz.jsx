"use client";
import { useState } from "react";
import Link from "next/link";
import ScoreBar from "./ScoreBar";

export default function DialogueCompletionQuiz({ questions }) {
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
            <div style={{ marginBottom: 12 }}>
              {q.dialogue.map((line, i) => {
                const isBlankLine = line.text.includes("___");
                const displayText =
                  isBlankLine && done ? line.text.replace("___", q.options[picked]) : line.text;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: line.speaker === "B" ? "flex-end" : "flex-start",
                      marginBottom: 6
                    }}
                  >
                    <span
                      style={{
                        background: line.speaker === "B" ? "var(--ink)" : "var(--paper)",
                        color: line.speaker === "B" ? "var(--paper)" : "var(--ink)",
                        border: line.speaker === "B" ? "none" : "1px solid var(--ink)",
                        borderRadius: 0,
                        padding: "8px 14px",
                        fontSize: 14,
                        maxWidth: "80%"
                      }}
                    >
                      {displayText}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {q.options.map((opt, i) => {
                let cls = "opt";
                if (done && i === q.correctIndex) cls += " correct";
                else if (done && i === picked) cls += " wrong";
                return (
                  <button key={i} className={cls} style={{ width: "auto", flex: "1 1 auto" }} onClick={() => answer(q.id, i)} disabled={done}>
                    {opt}
                  </button>
                );
              })}
            </div>
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
