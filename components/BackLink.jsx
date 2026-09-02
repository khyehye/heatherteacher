"use client";
import { useRouter } from "next/navigation";

// 고정 주소로 이동하는 대신 브라우저 히스토리를 뒤로 가서,
// 이전 페이지의 스크롤 위치까지 그대로 복원되게 합니다.
export default function BackLink({ label }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="back-link"
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}
    >
      {label}
    </button>
  );
}