import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <p className="footer-title">Grammar Card News</p>
          <p className="footer-copy">by Heather Teacher</p>
        </div>
        <Link
          href="https://www.instagram.com/heather._.teacher/"
          className="footer-link"
          target="_blank"
          rel="noreferrer"
        >
          Instagram ↗
        </Link>
      </div>
    </footer>
  );
}
