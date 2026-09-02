export const THEME_COLORS = {
  teal: "#12B8A6",
  red: "#A02334",
  indigo: "#5B4FE8",
  pink: "#E0559E",
  gold: "#B8860B",
  navy: "#3A3F5C"
};

export function themeColor(themeKey) {
  return THEME_COLORS[themeKey] || THEME_COLORS.navy;
}

// 이미지가 저장된 GitHub 저장소를 GitHub Pages로 서빙합니다.
// (jsDelivr는 gh 브랜치 전체 용량이 50MB를 넘으면 깨지기 때문에 카드뉴스처럼
//  이미지가 계속 쌓이는 저장소에는 맞지 않아요 — GitHub Pages는 1GB까지 문제없어요)
// 저장소 Settings > Pages 에서 Source를 main 브랜치로 켜주세요.
export const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE ||
  "https://khyehye.github.io/cardnews";

export function slideImageUrl(imageFolder, index) {
  const n = String(index).padStart(2, "0");
  return `${IMAGE_BASE_URL}/${encodeURI(imageFolder)}/slide_${n}.png`;
}

export function contentMdUrl(imageFolder) {
  return `${IMAGE_BASE_URL}/${encodeURI(imageFolder)}/content.md`;
}
