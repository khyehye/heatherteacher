import Link from "next/link";
import { notFound } from "next/navigation";
import episodes from "@/lib/episodes.json";
import registry from "@/lib/seriesRegistry.json";
import { themeColor } from "@/lib/themes";
import { getEpisodeContentHtml } from "@/lib/getContent";

export default async function EpisodeNotePage({ params }) {
  const episode = episodes[params.id];
  if (!episode) notFound();
  const series = registry[episode.seriesSlug];
  const html = await getEpisodeContentHtml(episode.imageFolder);

  return (
    <main className="container">
      <Link href={`/series/${encodeURIComponent(episode.seriesSlug)}`} className="muted" style={{ fontSize: 13 }}>
        ← {episode.seriesSlug}
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0 6px" }}>
        <span className="badge" style={{ background: themeColor(series?.themeColor) }}>
          {episode.seriesSlug}
        </span>
        <span className="muted" style={{ fontSize: 13 }}>
          {episode.level} · {episode.kind === "overview" ? "개관" : "상세"}
        </span>
      </div>
      <h1 style={{ fontSize: 22, margin: "0 0 12px" }}>
        {episode.globalId}회차 · {episode.title}
      </h1>

      <table className="meta-table card" style={{ marginBottom: 8 }}>
        <tbody>
          <tr><td className="muted">Category</td><td>{episode.category}</td></tr>
          <tr><td className="muted">Level</td><td>{episode.level}</td></tr>
          <tr><td className="muted">Keyword</td><td>{episode.keyword}</td></tr>
        </tbody>
      </table>

      <div className="toggle-row">
        <Link href={`/episode/${episode.globalId}`}>이미지로 보기</Link>
        <Link href={`/episode/${episode.globalId}/note`} className="active">텍스트로 보기</Link>
      </div>

      {html ? (
        <div className="note-section" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="muted">
          아직 grammar 저장소의 {episode.imageFolder}/content.md 파일을 찾을 수 없어요. 해당 경로에 파일을 추가해주세요.
        </p>
      )}
    </main>
  );
}
