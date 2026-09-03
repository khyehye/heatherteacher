import fs from "node:fs/promises";
import path from "node:path";

const ROADMAP_PATH = new URL("../lib/roadmap.json", import.meta.url);
const OUTPUT_PATH = new URL("../lib/episodes.json", import.meta.url);
const GITHUB_TREE_URL =
  "https://api.github.com/repos/khyehye/cardnews/git/trees/main?recursive=1";

const trackNames = {
  "초등영문법 30회": "초등영문법",
  "중등영문법 40회": "중등영문법",
  "고급영문법 30회": "고급영문법",
};

async function getImageFiles() {
  const localImagesPath = process.env.CARDNEWS_IMAGES_DIR;

  if (localImagesPath) {
    const files = [];
    const folders = await fs.readdir(localImagesPath, { withFileTypes: true });
    for (const folder of folders) {
      if (!folder.isDirectory() || !/^\d{3}$/.test(folder.name)) continue;
      const names = await fs.readdir(path.join(localImagesPath, folder.name));
      for (const name of names) files.push(`images/${folder.name}/${name}`);
    }
    return files;
  }

  const response = await fetch(GITHUB_TREE_URL, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) {
    throw new Error(`GitHub 이미지 목록을 가져오지 못했습니다 (${response.status}).`);
  }
  const data = await response.json();
  if (data.truncated) {
    throw new Error("GitHub 파일 목록이 잘려서 안전하게 동기화할 수 없습니다.");
  }
  return data.tree.filter((item) => item.type === "blob").map((item) => item.path);
}

function buildSlideInventory(files) {
  const inventory = new Map();
  for (const file of files) {
    const match = file.match(/^images\/(\d{3})\/slide_(\d+)\.png$/);
    if (!match) continue;
    const [, folder, slide] = match;
    if (!inventory.has(folder)) inventory.set(folder, []);
    inventory.get(folder).push(Number(slide));
  }

  for (const [folder, slides] of inventory) {
    slides.sort((a, b) => a - b);
    const expected = Array.from({ length: slides.length }, (_, index) => index + 1);
    if (slides.some((slide, index) => slide !== expected[index])) {
      throw new Error(`${folder} 폴더의 슬라이드 번호가 연속적이지 않습니다.`);
    }
  }
  return inventory;
}

const roadmap = JSON.parse(await fs.readFile(ROADMAP_PATH, "utf8"));
const imageFiles = await getImageFiles();
const inventory = buildSlideInventory(imageFiles);
const contentFolders = new Set(
  imageFiles
    .map((file) => file.match(/^images\/(\d{3})\/content\.md$/)?.[1])
    .filter(Boolean)
);
const seriesCounters = new Map();
const episodes = {};

for (const row of roadmap) {
  const globalId = Number(row["회차"]);
  const folderName = String(globalId).padStart(3, "0");
  const seriesSlug = trackNames[row["트랙"]] ?? row["트랙"];
  const inSeriesNumber = (seriesCounters.get(seriesSlug) ?? 0) + 1;
  seriesCounters.set(seriesSlug, inSeriesNumber);
  const slides = inventory.get(folderName) ?? [];

  episodes[globalId] = {
    globalId,
    seriesSlug,
    kind: row["유형"] === "개관" ? "overview" : "detail",
    inSeriesNumber,
    title: row["주제"],
    summary: row["핵심 설명"],
    category: row["Category"],
    level: row["Level"],
    keyword: row["Keyword"],
    status: slides.length > 0 ? "published" : "planned",
    slideCount: slides.length,
    imageFolder: `images/${folderName}`,
    contentFile: contentFolders.has(folderName) ? "content.md" : null,
  };
}

await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(episodes, null, 2)}\n`);

const published = Object.values(episodes).filter(
  (episode) => episode.status === "published"
).length;
console.log(`동기화 완료: 전체 ${roadmap.length}회 / 이미지 공개 ${published}회`);
