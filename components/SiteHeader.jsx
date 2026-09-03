import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="문법카드뉴스 홈">
          <span className="brand-mark">HT</span>
          <span className="brand-name">Grammar Card News</span>
        </Link>
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/search">검색</Link>
          <Link href="/series">시리즈</Link>
          <Link href="/exam">테스트</Link>
        </nav>
      </div>
    </header>
  );
}
