import Link from "next/link";
import { notFound } from "next/navigation";
import episodes from "@/lib/episodes.json";
import { seriesCode } from "@/lib/seriesCode";
import { getEpisodeContentHtml } from "@/lib/getContent";

export default async function EpisodeNotePage({ params }) {
  const episode = episodes[params.id];
  if (!episode) notFound();
  const html = await getEpisodeContentHtml(episode.imageFolder);

  return (
    <main className="container">
      <Link href={`/series/${encodeURIComponent(episode.seriesSlug)}`} className="back-link">
        {episode.seriesSlug}
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 6px" }}>
        <span className="tag-code">{seriesCode(episode.seriesSlug)}</span>
        <span className="tag-label">{episode.level} · {episode.kind === "overview" ? "개관" : "상세"}</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--muted)", marginRight: 8 }}>
          No. {String(episode.globalId).padStart(3, "0")}
        </span>
        {episode.title}
      </h1>

      <table className="meta-table" style={{ marginBottom: 8 }}>
        <tbody>
          <tr><td>CATEGORY</td><td>{episode.category}</td></tr>
          <tr><td>LEVEL</td><td>{episode.level}</td></tr>
          <tr><td>KEYWORD</td><td>{episode.keyword}</td></tr>
        </tbody>
      </table>

      <div className="tab-row">
        <Link href={`/episode/${episode.globalId}`} className="tab-item">이미지</Link>
        <Link href={`/episode/${episode.globalId}/note`} className="tab-item active">텍스트</Link>
      </div>

      {html ? (
        <div className="note-section" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="muted">
          grammar 저장소의 {episode.imageFolder}/content.md 파일을 아직 찾을 수 없어요.
        </p>
      )}
    </main>
  );
}
