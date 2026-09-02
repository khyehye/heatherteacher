"use client";
import { useState } from "react";

export default function EpisodeCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  if (total === 0) return null;

  return (
    <div className="carousel-wrap">
      <div className="carousel-stage">
        <img src={images[index]} alt={`슬라이드 ${index + 1}`} className="carousel-image" />
        {total > 1 && (
          <>
            <button className="carousel-arrow left" onClick={prev} aria-label="이전 슬라이드">‹</button>
            <button className="carousel-arrow right" onClick={next} aria-label="다음 슬라이드">›</button>
          </>
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
                key={i}
                className={`carousel-dot ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번 슬라이드로 이동`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
