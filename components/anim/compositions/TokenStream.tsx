import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/**
 * Teaches: a new chat is an empty token stream; you and the model take turns
 * filling it; together that stream is the context window (working memory).
 */

const MONO = "var(--font-mono), monospace";
const DISPLAY = "var(--font-display), sans-serif";

function Cell({ i, appear, color }: { i: number; appear: number | null; color: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const filled = appear !== null;
  const p = filled ? spring({ frame: frame - (appear as number), fps, config: { damping: 14, stiffness: 120 } }) : 0;
  const scale = filled ? interpolate(p, [0, 1], [0.2, 1]) : 1;
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: 7,
        border: `1.5px solid ${filled ? color : "var(--line)"}`,
        background: filled ? color : "transparent",
        transform: `scale(${scale})`,
        opacity: filled ? interpolate(p, [0, 1], [0, 1]) : 0.5,
      }}
    />
  );
}

export default function TokenStream() {
  const frame = useCurrentFrame();
  const COLS = 16;

  // token appearance schedule: user tokens (amber), then model tokens (teal)
  const schedule: (number | null)[] = new Array(COLS).fill(null);
  const colors: string[] = new Array(COLS).fill("var(--zip)");
  const userTokens = 5;
  const modelTokens = 8;
  for (let i = 0; i < userTokens; i++) schedule[i] = 12 + i * 7;
  for (let i = 0; i < modelTokens; i++) {
    schedule[userTokens + i] = 70 + i * 7;
    colors[userTokens + i] = "var(--think)";
  }

  const filledCount = schedule.filter((s) => s !== null && frame >= (s as number)).length;
  const bracketW = (Math.max(filledCount, 0) * (34 + 10));
  const turn = frame < 62 ? "you" : frame < 150 ? "the model" : "both of you";
  const turnColor = frame < 62 ? "var(--zip)" : frame < 150 ? "var(--think)" : "var(--ink)";
  const pulse = frame > 160 ? 0.5 + 0.5 * Math.sin((frame - 160) / 6) : 1;

  return (
    <AbsoluteFill style={{ background: "var(--panel)", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, padding: 40 }}>
      <div style={{ position: "absolute", top: 34, fontFamily: MONO, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>
        The context window · working memory
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 14, color: turnColor, width: 78, textAlign: "right", opacity: pulse }}>
          {turn} →
        </span>
        {new Array(COLS).fill(0).map((_, i) => (
          <Cell key={i} i={i} appear={frame >= (schedule[i] ?? Infinity) ? schedule[i] : null} color={colors[i]} />
        ))}
      </div>

      {/* growing bracket labelled context window */}
      <div style={{ marginTop: 22, width: 78 + 10 + bracketW, maxWidth: "80%", height: 1, background: "var(--ink)", opacity: 0.5, transition: "width .2s", marginLeft: 88 }} />
      <div style={{ marginTop: 8, marginLeft: 88, fontFamily: MONO, fontSize: 13, color: "var(--ink-soft)" }}>
        context window {filledCount > 0 ? `· ${filledCount} tokens` : ""}
      </div>

      <div style={{ position: "absolute", bottom: 30, fontFamily: DISPLAY, fontSize: 15, color: "var(--muted)" }}>
        {frame < 62 ? "You write tokens…" : frame < 150 ? "…the model writes back." : "Together you build the stream."}
      </div>
    </AbsoluteFill>
  );
}
