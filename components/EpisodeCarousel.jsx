"use client";

import { useEffect, useRef, useState } from "react";

export default function EpisodeCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const touchStartX = useRef(null);
  const swiped = useRef(false);
  const total = images.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  useEffect(() => {
    if (total < 2) return;
    const adjacent = [images[(index + 1) % total], images[(index - 1 + total) % total]];
    adjacent.forEach((src) => {
      const preload = new window.Image();
      preload.src = src;
    });
  }, [images, index, total]);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setExpanded(false);
      if (event.key === "ArrowLeft" && total > 1) prev();
      if (event.key === "ArrowRight" && total > 1) next();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [expanded, total]);

  if (total === 0) return null;

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    swiped.current = false;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null || total < 2) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 48) return;
    swiped.current = true;
    if (distance > 0) prev();
    else next();
  };

  const expandImage = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    setExpanded(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft" && total > 1) prev();
    if (event.key === "ArrowRight" && total > 1) next();
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <>
      <div className="carousel-wrap">
        <div
          className="carousel-stage"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label={`카드뉴스 슬라이드 ${index + 1} / ${total}. 좌우 방향키로 이동하고 Enter 키로 확대할 수 있습니다.`}
        >
          {total > 1 && (
            <button type="button" className="carousel-arrow" onClick={prev} aria-label="이전 슬라이드">‹</button>
          )}
          <button type="button" className="carousel-image-button" onClick={expandImage} aria-label={`${index + 1}번 슬라이드 크게 보기`}>
            <img src={images[index]} alt={`슬라이드 ${index + 1}`} className="carousel-image" />
            <span className="carousel-expand">확대</span>
          </button>
          {total > 1 && (
            <button type="button" className="carousel-arrow" onClick={next} aria-label="다음 슬라이드">›</button>
          )}
        </div>
        {total > 1 && (
          <div className="carousel-footer">
            <span className="carousel-count">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <div className="carousel-dots">
              {images.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={`carousel-dot ${i === index ? "active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1}번 슬라이드로 이동`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>
            <span className="carousel-hint">밀어서 넘기기 · 눌러서 확대</span>
          </div>
        )}
      </div>

      {expanded && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="슬라이드 크게 보기" onClick={() => setExpanded(false)}>
          <button type="button" className="lightbox-close" onClick={() => setExpanded(false)} aria-label="닫기">닫기 ×</button>
          {total > 1 && (
            <button type="button" className="lightbox-arrow previous" onClick={(event) => { event.stopPropagation(); prev(); }} aria-label="이전 슬라이드">‹</button>
          )}
          <img src={images[index]} alt={`확대된 슬라이드 ${index + 1}`} className="lightbox-image" onClick={(event) => event.stopPropagation()} />
          {total > 1 && (
            <button type="button" className="lightbox-arrow next" onClick={(event) => { event.stopPropagation(); next(); }} aria-label="다음 슬라이드">›</button>
          )}
          <span className="lightbox-count">{index + 1} / {total}</span>
        </div>
      )}
    </>
  );
}
