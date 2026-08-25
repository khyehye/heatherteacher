# 문법카드뉴스 사이트

## 시작하기
```
npm install
npm run dev
```
http://localhost:3000 에서 확인

## 배포 전 꼭 해야 할 것
1. `lib/themes.js`의 `IMAGE_BASE_URL`을 실제 이미지가 올라간 GitHub 저장소 jsDelivr 경로로 교체
   예: `https://cdn.jsdelivr.net/gh/실제깃헙아이디/이미지저장소@main`
2. `lib/episodes.json`에 나머지 회차들을 추가 (지금은 초등영문법 1~30회차 + 387회차만 샘플로 들어있음)
3. `lib/content/{globalId}.md` 파일을 회차별로 채우기 (지금은 1, 2, 387회차만 샘플)
4. `lib/exams/`에 트랙별 시험 세트를 추가하고 `lib/examSets.json`에 등록

## 배포
GitHub에 push한 뒤 vercel.com에서 저장소 연결하면 자동 배포됩니다.
무료(Hobby) 플랜으로 충분하며, 이미지가 jsDelivr에서 서빙되므로 Vercel 대역폭에 잡히지 않습니다.

## 폴더 구조
- app/ — 페이지 (홈 / 시리즈 / 회차 상세(이미지+텍스트) / 시험보기)
- components/ — 시험 유형별 인터랙티브 퀴즈 컴포넌트 4종
- lib/ — 시리즈 레지스트리, 회차 메타데이터, 시험 데이터, content.md 파일들
