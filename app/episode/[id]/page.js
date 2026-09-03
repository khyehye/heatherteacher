import Link from "next/link";
import { notFound } from "next/navigation";
import episodes from "@/lib/episodes.json";
import registry from "@/lib/seriesRegistry.json";
import { seriesCode } from "@/lib/seriesCode";
import { slideImageUrl } from "@/lib/themes";
import { getEpisodeContentHtml } from "@/lib/getContent";
import EpisodeCarousel from "@/components/EpisodeCarousel";
import BackLink from "@/components/BackLink";

export default async function EpisodePage({ params }) {
  const episode = episodes[params.id];
  if (!episode || episode.status !== "published") notFound();

  const images = Array.from({ length: episode.slideCount }, (_, i) =>
    slideImageUrl(episode.imageFolder, i + 1)
  );
  const html = episode.contentFile
    ? await getEpisodeContentHtml(episode.imageFolder)
    : null;

  const seriesEpisodes = Object.values(episodes)
    .filter((e) => e.seriesSlug === episode.seriesSlug && e.status === "published")
    .sort((a, b) => a.inSeriesNumber - b.inSeriesNumber);
  const currentIndex = seriesEpisodes.findIndex((e) => e.globalId === episode.globalId);
  const totalInSeries = registry[episode.seriesSlug]?.totalPlanned ?? seriesEpisodes.length;
  const seriesPercent = Math.min(100, Math.round((episode.inSeriesNumber / totalInSeries) * 100));
  const previousEpisode = currentIndex > 0 ? seriesEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex >= 0 && currentIndex < seriesEpisodes.length - 1
    ? seriesEpisodes[currentIndex + 1]
    : null;

  const relatedList = Object.values(episodes)
    .filter((e) => e.status === "published" && e.category === episode.category && e.globalId !== episode.globalId)
    .slice(0, 3);

  return (
    <main className="container reading-container">
      <BackLink label={episode.seriesSlug} />

      <div className="episode-header">
        <div className="episode-meta">
          <span className="tag-code">{seriesCode(episode.seriesSlug)}</span>
          <span>{episode.seriesSlug} · {episode.level} · {episode.kind === "overview" ? "개관" : "상세"}</span>
        </div>
        <span className="episode-number">{String(episode.globalId).padStart(3, "0")}</span>
      </div>
      <h1 className="episode-title">{episode.title}</h1>
      <p className="episode-summary">{episode.summary}</p>

      <div className="episode-position" aria-label={`${episode.seriesSlug} ${totalInSeries}회 중 ${episode.inSeriesNumber}회`}>
        <div className="episode-position-label">
          <span>{seriesCode(episode.seriesSlug)} 학습 위치</span>
          <strong>{String(episode.inSeriesNumber).padStart(2, "0")} / {String(totalInSeries).padStart(2, "0")}</strong>
        </div>
        <div className="episode-position-bar"><span style={{ width: `${seriesPercent}%` }} /></div>
      </div>

      <EpisodeCarousel images={images} />

      <hr className="rule-strong episode-rule" />

      {html && (
        <div className="note-section" dangerouslySetInnerHTML={{ __html: html }} />
      )}

      {(previousEpisode || nextEpisode) && (
        <nav className="lesson-nav" aria-label="회차 이동">
          {previousEpisode ? (
            <Link href={`/episode/${previousEpisode.globalId}`} className="lesson-nav-item previous">
              <span>← 이전 학습</span>
              <strong>{previousEpisode.title}</strong>
            </Link>
          ) : <span />}
          {nextEpisode ? (
            <Link href={`/episode/${nextEpisode.globalId}`} className="lesson-nav-item next">
              <span>다음 학습 →</span>
              <strong>{nextEpisode.title}</strong>
            </Link>
          ) : <span />}
        </nav>
      )}

      {relatedList.length > 0 && (
        <div className="related-section">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Related</p>
              <h2>함께 보면 좋은 카드</h2>
            </div>
          </div>
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
