"use client";

export default function ScoreBar({ total, answered, correct }) {
  return (
    <div className="score-bar">
      <span>{answered} / {total} 풀이</span>
      <span>정답 {correct}개</span>
    </div>
  );
}
