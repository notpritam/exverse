import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/**
 * Teaches: pre-training compresses the internet into the ~1TB zip file
 * (knowledge); post-training attaches the assistant persona (the smiley).
 */

const MONO = "var(--font-mono), monospace";
const DISPLAY = "var(--font-display), sans-serif";

export default function Training() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dots = new Array(9).fill(0);
  const smiley = spring({ frame: frame - 96, fps, config: { damping: 12 } });
  const zipP = interpolate(frame, [40, 70], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const phase =
    frame < 55 ? "Pre-training: compress the internet into tokens" :
    frame < 96 ? "≈ 1TB · a trillion parameters · lossy knowledge" :
    "Post-training: attach the assistant persona";

  return (
    <AbsoluteFill style={{ background: "var(--panel)", fontFamily: DISPLAY }}>
      <div style={{ position: "absolute", top: 28, width: "100%", textAlign: "center", fontFamily: MONO, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>
        How the zip file is built
      </div>

      {/* internet label */}
      <div style={{ position: "absolute", left: 90, top: 205, fontFamily: MONO, fontSize: 14, color: "var(--muted)" }}>the internet</div>

      {/* streaming tokens compressing into the zip */}
      {dots.map((_, i) => {
        const start = i * 5;
        const p = interpolate(frame, [start, start + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const x = interpolate(p, [0, 1], [190, 405]);
        const y = 220 + Math.sin(i) * 40 * (1 - p);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 9, height: 9, borderRadius: 2, background: "var(--zip)", opacity: 1 - p * 0.7 }} />;
      })}

      {/* zip box */}
      <div style={{ position: "absolute", left: 400, top: 165, width: 150, height: 120, borderRadius: 16, border: "1.5px solid var(--zip)", background: "var(--zip-wash)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${zipP})` }}>
        <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: "var(--zip)" }}>ZIP</span>
        {frame >= 70 && <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)", marginTop: 4 }}>~1TB · 1T params</span>}
        {/* smiley (post-training) */}
        <div style={{ position: "absolute", right: -14, bottom: -14, width: 44, height: 44, borderRadius: "50%", background: "var(--panel)", border: "1.5px solid var(--zip)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.max(0, smiley)})`, fontSize: 22 }}>
          🙂
        </div>
      </div>

      {/* stage labels */}
      <div style={{ position: "absolute", left: 380, top: 300, width: 190, textAlign: "center", fontFamily: MONO, fontSize: 11, color: "var(--zip)" }}>
        {frame < 96 ? "pre-training → knowledge" : "post-training → persona"}
      </div>

      <div style={{ position: "absolute", bottom: 28, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 15, color: "var(--muted)" }}>
        {phase}
      </div>
    </AbsoluteFill>
  );
}
