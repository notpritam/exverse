import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/** Style: animated bar chart.
 *  Teaches: the tier you pay for chooses the model; bigger = more capability
 *  (and fewer mistakes), at higher cost. */

const MONO = "var(--font-mono), monospace";
const DISPLAY = "var(--font-display), sans-serif";

const BARS = [
  { label: "4o-mini", tier: "free", cap: 0.42, color: "var(--faint)" },
  { label: "GPT-4o", tier: "plus · $20", cap: 0.78, color: "var(--zip)" },
  { label: "Pro", tier: "$200", cap: 1.0, color: "var(--think)" },
];

export default function PricingBars() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const H = 250;
  const baseY = 330;

  return (
    <AbsoluteFill style={{ background: "var(--panel)", fontFamily: DISPLAY }}>
      <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center", fontFamily: MONO, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>
        The tier chooses your model
      </div>

      {/* y axis label */}
      <div style={{ position: "absolute", left: 150, top: 150, fontFamily: MONO, fontSize: 11, color: "var(--muted)", transform: "rotate(-90deg)" }}>capability →</div>
      {/* baseline */}
      <div style={{ position: "absolute", left: 200, right: 120, top: baseY, height: 1.5, background: "var(--line)" }} />

      {BARS.map((b, i) => {
        const at = 15 + i * 22;
        const p = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 90 } });
        const h = interpolate(p, [0, 1], [0, b.cap * H]);
        const x = 250 + i * 170;
        return (
          <div key={b.label}>
            <div style={{ position: "absolute", left: x, top: baseY - h, width: 110, height: h, borderRadius: "8px 8px 0 0", background: b.color, opacity: 0.92 }} />
            <div style={{ position: "absolute", left: x, top: baseY + 10, width: 110, textAlign: "center", fontFamily: DISPLAY, fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{b.label}</div>
            <div style={{ position: "absolute", left: x, top: baseY + 32, width: 110, textAlign: "center", fontFamily: MONO, fontSize: 11, color: "var(--muted)" }}>{b.tier}</div>
            {frame > at + 20 && (
              <div style={{ position: "absolute", left: x, top: baseY - h - 24, width: 110, textAlign: "center", fontFamily: MONO, fontSize: 12, color: b.color }}>
                {Math.round(b.cap * 100)}
              </div>
            )}
          </div>
        );
      })}

      {frame > 90 && (
        <div style={{ position: "absolute", right: 60, top: 120, width: 150, fontFamily: DISPLAY, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
          Bigger models: more world knowledge, better writing,{" "}
          <span style={{ color: "var(--think)" }}>fewer hallucinations</span>.
        </div>
      )}

      <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 15, color: "var(--muted)" }}>
        Match the model to the stakes — pay up when it has to be right.
      </div>
    </AbsoluteFill>
  );
}
