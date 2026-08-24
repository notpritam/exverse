import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-measure flex-col items-center px-6 py-28 text-center">
      <p className="font-mono text-sm text-zip">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Off the roadmap.</h1>
      <p className="mt-3 font-serif text-lg text-muted">This page isn&apos;t part of any course — yet.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-display text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
      >
        Back to Exverse
      </Link>
    </main>
  );
}
