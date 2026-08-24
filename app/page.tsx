export default function Home() {
  return (
    <main className="mx-auto max-w-measure px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Exverse · scaffold</p>
      <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink">
        A place to <span className="text-zip">learn something</span>.
      </h1>
      <p className="mt-5 text-xl text-ink-soft">
        Toolchain and design tokens are live. The real landing, roadmap, and lessons come next.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs">
        <span className="rounded-full border border-line bg-panel px-3 py-1 text-zip">zip = model</span>
        <span className="rounded-full border border-line bg-panel px-3 py-1 text-think">think</span>
        <span className="rounded-full border border-line bg-panel px-3 py-1 text-tool">tools</span>
        <span className="rounded-full border border-line bg-panel px-3 py-1 text-verify">verify</span>
      </div>
    </main>
  );
}
