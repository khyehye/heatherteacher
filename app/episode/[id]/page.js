import Link from "next/link";
import { notFound } from "next/navigation";
import episodes from "@/lib/episodes.json";
import { seriesCode } from "@/lib/seriesCode";
import { slideImageUrl } from "@/lib/themes";
import { getEpisodeContentHtml } from "@/lib/getContent";
import EpisodeCarousel from "@/components/EpisodeCarousel";
import BackLink from "@/components/BackLink";

export default async function EpisodePage({ params }) {
  const episode = episodes[params.id];
  if (!episode) notFound();

  const images = Array.from({ length: episode.slideCount }, (_, i) =>
    slideImageUrl(episode.imageFolder, i + 1)
  );
  const html = await getEpisodeContentHtml(episode.imageFolder);

  const relatedList = Object.values(episodes)
    .filter((e) => e.category === episode.category && e.globalId !== episode.globalId)
    .slice(0, 3);

  return (
    <main className="container">
      <BackLink label={episode.seriesSlug} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 6px" }}>
        <span className="tag-code">{seriesCode(episode.seriesSlug)}</span>
        <span className="tag-label">{episode.level} · {episode.kind === "overview" ? "개관" : "상세"}</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--muted)", marginRight: 8 }}>
          No. {String(episode.globalId).padStart(3, "0")}
        </span>
        {episode.title}
      </h1>
      <p className="muted" style={{ fontSize: 13, margin: "10px 0 28px" }}>{episode.summary}</p>

      <EpisodeCarousel images={images} />

      <hr className="rule-strong" style={{ margin: "36px 0 32px" }} />

      {html ? (
        <div className="note-section" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="muted">
          grammar 저장소의 {episode.imageFolder}/content.md 파일을 아직 찾을 수 없어요.
        </p>
      )}

      {relatedList.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Related</p>
          <div className="index-list">
            {relatedList.map((e) => (
              <Link key={e.globalId} href={`/episode/${e.globalId}`} className="index-row">
                <span className="index-num">{String(e.globalId).padStart(3, "0")}</span>
                <span className="index-title">{e.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}