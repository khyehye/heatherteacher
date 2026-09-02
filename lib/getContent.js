import { marked } from "marked";
import { contentMdUrl } from "@/lib/themes";

// grammar 저장소(GitHub Pages)에서 회차 폴더의 content.md를 직접 가져옵니다.
// 지금은 계속 콘텐츠를 수정하며 확인하는 단계라 캐싱 없이 항상 최신 버전을 가져옵니다.
// (나중에 트래픽이 늘면 { next: { revalidate: 60 } } 같은 걸로 바꿔 GitHub Pages 요청을 줄일 수 있어요)
export async function getEpisodeContentHtml(imageFolder) {
  const url = contentMdUrl(imageFolder);
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const raw = await res.text();
    return marked.parse(raw);
  } catch {
    return null;
  }
}
