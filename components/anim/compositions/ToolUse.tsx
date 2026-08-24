import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/**
 * Teaches: the model can't answer a fresh question from its frozen knowledge,
 * so it searches, the pages' text loads into the context window, and then it
 * answers — with citations.
 */

const MONO = "var(--font-mono), monospace";
const DISPLAY = "var(--font-display), sans-serif";

function Box({ x, y, w, h, color, wash, children }: any) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 14, border: `1.5px solid ${color}`, background: wash, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY }}>
      {children}
    </div>
  );
}

export default function ToolUse() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // pure entrance helper (not a hook) — safe to call in a loop
  const enter = (at: number) => {
    const p = spring({ frame: frame - at, fps, config: { damping: 16 } });
    return { opacity: interpolate(p, [0, 1], [0, 1]), scale: interpolate(p, [0, 1], [0.9, 1]) };
  };

  const phase =
    frame < 40 ? "You ask something fresh" :
    frame < 75 ? "Not in the zip file…" :
    frame < 125 ? "…so it searches the web" :
    frame < 165 ? "Pages load into the context window" :
    "Now it can answer — with citations";

  const fill = interpolate(frame, [110, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pages = [0, 1, 2];

  return (
    <AbsoluteFill style={{ background: "var(--panel)", fontFamily: DISPLAY }}>
      <div style={{ position: "absolute", top: 28, width: "100%", textAlign: "center", fontFamily: MONO, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>
        Tool use · internet search
      </div>

      <Box x={60} y={175} w={110} h={70} color="var(--ink)" wash="var(--panel)">
        <span style={{ fontSize: 15, fontWeight: 600 }}>You</span>
      </Box>

      <Box x={330} y={150} w={150} h={120} color="var(--zip)" wash="var(--zip-wash)">
        <span style={{ fontFamily: MONO, fontSize: 24, color: "var(--zip)", fontWeight: 700 }}>ZIP</span>
        <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>frozen knowledge</span>
        {frame >= 45 && frame < 110 && (
          <span style={{ position: "absolute", top: -22, fontFamily: MONO, fontSize: 20, color: frame < 75 ? "var(--verify)" : "var(--tool)" }}>
            {frame < 75 ? "?" : "search"}
          </span>
        )}
      </Box>

      <div style={{ position: "absolute", left: 172, top: 208, width: 156, height: 2, background: frame >= 20 ? "var(--ink)" : "var(--line)" }} />

      {pages.map((i) => {
        const e = enter(80 + i * 10);
        return (
          <div key={i} style={{ position: "absolute", left: 640 + i * 8, top: 120 + i * 46, width: 150, height: 40, borderRadius: 8, border: "1px solid var(--tool)", background: "var(--tool-wash)", opacity: e.opacity, transform: `scale(${e.scale})`, display: "flex", alignItems: "center", padding: "0 10px", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--tool)" }} />
            <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--tool)" }}>web page {i + 1}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 480, top: 210, width: 150, height: 2, background: frame >= 80 ? "var(--tool)" : "var(--line)" }} />

      <div style={{ position: "absolute", left: 330, top: 300, width: 150 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>context window</div>
        <div style={{ height: 12, borderRadius: 99, border: "1px solid var(--line)", overflow: "hidden", background: "var(--paper-2)" }}>
          <div style={{ height: "100%", width: `${fill * 100}%`, background: "linear-gradient(90deg,var(--tool),var(--think))" }} />
        </div>
      </div>

      {frame >= 160 && (
        <div style={{ position: "absolute", left: 330, top: 96, fontFamily: DISPLAY, fontSize: 14, color: "var(--think)", fontWeight: 600 }}>
          ✓ answered
        </div>
      )}

      <div style={{ position: "absolute", bottom: 28, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 15, color: "var(--muted)" }}>
        {phase}
      </div>
    </AbsoluteFill>
  );
}
