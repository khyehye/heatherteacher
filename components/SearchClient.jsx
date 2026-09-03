"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { seriesCode } from "@/lib/seriesCode";

const normalize = (value) => String(value ?? "").toLocaleLowerCase().replace(/\s+/g, " ").trim();

export default function SearchClient({ episodes }) {
  const [query, setQuery] = useState("");
  const terms = normalize(query).split(" ").filter(Boolean);

  const results = useMemo(() => {
    if (terms.length === 0) return episodes.slice(0, 8);

    return episodes.filter((episode) => {
      const searchable = normalize([
        episode.title,
        episode.summary,
        episode.keyword,
        episode.category,
        episode.seriesSlug,
        episode.level
      ].join(" "));
      return terms.every((term) => searchable.includes(term));
    });
  }, [episodes, terms.join("|")]);

  return (
    <section>
      <label className="search-box">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          className="search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: 현재완료, 관계대명사, 구동사"
          aria-label="전체 카드뉴스 검색"
          autoComplete="off"
        />
        {query && (
          <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="검색어 지우기">
            지우기
          </button>
        )}
      </label>

      <div className="search-shortcuts" aria-label="추천 검색어">
        {["초등영문법", "구동사", "오답노트", "영작패턴", "관용표현", "수능어법유형"].map((label) => (
          <button type="button" key={label} onClick={() => setQuery(label)}>{label}</button>
        ))}
      </div>

      <div className="search-result-heading">
        <p className="eyebrow">{terms.length ? "Results" : "Recently published"}</p>
        <span>{terms.length ? `${results.length}개 결과` : `최근 ${results.length}개`}</span>
      </div>

      {results.length > 0 ? (
        <div className="search-results">
          {results.map((episode) => (
            <Link href={`/episode/${episode.globalId}`} className="search-result-row" key={episode.globalId}>
              <span className="search-result-number">{String(episode.globalId).padStart(3, "0")}</span>
              <span className="search-result-copy">
                <strong>{episode.title}</strong>
                <small>{episode.summary}</small>
              </span>
              <span className="search-result-series">{seriesCode(episode.seriesSlug)} · {episode.seriesSlug}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="search-empty">
          <strong>검색 결과가 없어요.</strong>
          <p>단어 수를 줄이거나, 위 추천 검색어로 다시 찾아보세요.</p>
        </div>
      )}
    </section>
  );
}
