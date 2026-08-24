import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/** Style: split comparison + a vertical reasoning chain.
 *  Teaches: a fast model answers instantly (sometimes wrong); a thinking model
 *  reasons step by step and lands it. */

const MONO = "var(--font-mono), monospace";
const DISPLAY = "var(--font-display), sans-serif";

const STEPS = ["try an approach…", "wait — that's off", "backtrack, re-check", "found the real bug"];

export default function ThinkingChain() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wrongIn = interpolate(frame, [18, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "var(--panel)", fontFamily: DISPLAY }}>
      <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center", fontFamily: MONO, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>
        Fast answer vs. a thinking model
      </div>

      {/* left: fast */}
      <div style={{ position: "absolute", left: 70, top: 90, width: 320 }}>
        <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--muted)" }}>GPT-4o · fast</div>
        <div style={{ marginTop: 14, padding: "16px 18px", borderRadius: 12, border: "1.5px solid var(--verify)", background: "var(--verify-wash)", opacity: wrongIn, transform: `translateY(${(1 - wrongIn) * 8}px)` }}>
          <div style={{ fontSize: 15, color: "var(--ink)" }}>“Here's the fix…”</div>
          <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 13, color: "var(--verify)" }}>✗ plausible, but wrong</div>
        </div>
        <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 11, color: "var(--faint)" }}>~1 second</div>
      </div>

      {/* divider */}
      <div style={{ position: "absolute", left: 450, top: 96, bottom: 96, width: 1, background: "var(--line)" }} />

      {/* right: thinking chain */}
      <div style={{ position: "absolute", left: 510, top: 90, width: 330 }}>
        <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--think)" }}>o1 · thinking</div>
        <div style={{ marginTop: 12 }}>
          {STEPS.map((s, i) => {
            const at = 34 + i * 30;
            const p = spring({ frame: frame - at, fps, config: { damping: 16 } });
            const done = frame > at + 24;
            return (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 9, opacity: interpolate(p, [0, 1], [0, 1]), transform: `translateX(${interpolate(p, [0, 1], [-10, 0])}px)` }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: done ? "var(--think)" : "var(--muted)", marginTop: 2 }}>{done ? "✓" : "…"}</span>
                <span style={{ fontFamily: MONO, fontSize: 13, color: "var(--ink-soft)" }}>{s}</span>
              </div>
            );
          })}
        </div>
        {frame > 168 && (
          <div style={{ marginTop: 6, padding: "12px 16px", borderRadius: 12, border: "1.5px solid var(--think)", background: "var(--think-wash)", fontFamily: MONO, fontSize: 13, color: "var(--think)" }}>
            ✓ correct answer
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 15, color: "var(--muted)" }}>
        {frame < 30 ? "Fast is instant…" : frame < 168 ? "…thinking reasons step by step…" : "…and lands the hard ones. Use it for math & code."}
      </div>
    </AbsoluteFill>
  );
}
