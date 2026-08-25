import { marked } from "marked";
import { contentMdUrl } from "@/lib/themes";

// grammar 저장소(GitHub Pages)에서 회차 폴더의 content.md를 직접 가져옵니다.
// 로컬에 파일을 따로 두지 않으므로, grammar 저장소에 새 content.md를 push하면
// 사이트를 다시 빌드하지 않아도 (revalidate 주기 이후) 자동으로 반영됩니다.
export async function getEpisodeContentHtml(imageFolder) {
  const url = contentMdUrl(imageFolder);
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const raw = await res.text();
    return marked.parse(raw);
  } catch {
    return null;
  }
}
