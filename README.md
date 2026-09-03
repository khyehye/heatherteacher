# 문법카드뉴스 사이트

## 시작하기
```
npm install
npm run dev
```
http://localhost:3000 에서 확인

## 배포 전 꼭 해야 할 것
1. 카드뉴스 이미지는 `https://github.com/khyehye/cardnews/tree/main/images`에 `001`~`600` 폴더로 저장합니다.
2. 이미지 저장소를 업데이트한 뒤 이 프로젝트에서 `npm run sync-episodes`를 실행합니다.
3. 동기화 명령은 `lib/roadmap.json`의 600회차 정보를 기준으로 `lib/episodes.json`을 다시 만들고, 실제 이미지 폴더가 있는 회차만 공개합니다.
4. 회차별 설명문이 필요하면 해당 이미지 폴더에 `content.md`를 추가합니다. 설명문이 없어도 카드뉴스는 정상 표시됩니다.
5. `lib/exams/`에 트랙별 시험 세트를 추가하고 `lib/examSets.json`에 등록합니다.

## 배포
GitHub에 push한 뒤 vercel.com에서 저장소 연결하면 자동 배포됩니다.
무료(Hobby) 플랜으로 충분하며, 이미지가 jsDelivr에서 서빙되므로 Vercel 대역폭에 잡히지 않습니다.

## 폴더 구조
- app/ — 페이지 (홈 / 시리즈 / 회차 상세(이미지+텍스트) / 시험보기)
- components/ — 시험 유형별 인터랙티브 퀴즈 컴포넌트 4종
- lib/ — 시리즈 레지스트리, 회차 메타데이터, 시험 데이터, content.md 파일들
