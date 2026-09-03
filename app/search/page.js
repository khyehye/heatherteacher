import episodes from "@/lib/episodes.json";
import SearchClient from "@/components/SearchClient";

export const metadata = {
  title: "전체 검색 | Grammar Card News"
};

export default function SearchPage() {
  const published = Object.values(episodes)
    .filter((episode) => episode.status === "published")
    .sort((a, b) => b.globalId - a.globalId)
    .map(({ globalId, title, summary, keyword, category, seriesSlug, level }) => ({
      globalId,
      title,
      summary,
      keyword,
      category,
      seriesSlug,
      level
    }));

  return (
    <main className="container reading-container search-page">
      <div className="search-hero">
        <p className="eyebrow">Search all lessons</p>
        <h1 className="page-title">배우고 싶은 문법을<br />바로 찾아보세요.</h1>
        <p>제목, 핵심어, 문법 주제와 시리즈 이름을 모두 검색할 수 있어요.</p>
      </div>
      <SearchClient episodes={published} />
    </main>
  );
}
