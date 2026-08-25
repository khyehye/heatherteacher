"use client";

export default function ScoreBar({ total, answered, correct }) {
  return (
    <div className="card" style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
      <span>{answered} / {total} 풀이</span>
      <span>정답 {correct}개</span>
    </div>
  );
}
