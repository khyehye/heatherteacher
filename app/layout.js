import "./globals.css";

export const metadata = {
  title: "문법카드뉴스",
  description: "@heather._.teacher 문법카드뉴스 아카이브"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
