// 시리즈를 색상 대신 2~3글자 카탈로그 코드로 구분합니다 (도서관 색인 카드 방식).
export const SERIES_CODES = {
  "구동사": "PV",
  "오답노트": "CN",
  "영작패턴": "WP",
  "관용표현": "EX",
  "수능어법유형": "GT",
  "초등영문법": "EL",
  "중등영문법": "ML",
  "고급영문법": "AL"
};

export function seriesCode(slug) {
  return SERIES_CODES[slug] || "??";
}
