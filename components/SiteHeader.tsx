import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink font-mono text-[15px] font-bold text-paper">
            E
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight">Exverse</span>
        </Link>
        <nav className="ml-2 hidden items-center gap-5 font-display text-sm text-muted sm:flex">
          <Link href="/#courses" className="transition-colors hover:text-ink">
            Courses
          </Link>
          <Link href="/about" className="transition-colors hover:text-ink">
            About
          </Link>
          <Link href="/contribute" className="transition-colors hover:text-ink">
            Contribute
          </Link>
        </nav>
        <span className="flex-1" />
        <a
          href="https://github.com/notpritam/exverse"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-[9px] border border-line bg-panel px-3 py-1.5 font-display text-sm text-ink transition-colors hover:border-ink sm:inline-flex"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.700 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
          </svg>
          Star
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
