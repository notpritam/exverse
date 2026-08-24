import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/** Style: radial hub.
 *  Teaches: beyond text — one model handles audio, images, and video, some
 *  natively (inside the model), some tacked on. */

const MONO = "var(--font-mono), monospace";
const DISPLAY = "var(--font-display), sans-serif";

const CX = 450;
const CY = 235;
const R = 150;
const NODES = [
  { label: "text", native: true, color: "var(--ink)" },
  { label: "speak / listen", native: true, color: "var(--think)" },
  { label: "true voice", native: true, color: "var(--think)" },
  { label: "see · OCR", native: true, color: "var(--tool)" },
  { label: "make images", native: false, color: "var(--zip)" },
  { label: "video", native: false, color: "var(--zip)" },
];

export default function ModalitiesHub() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "var(--panel)", fontFamily: DISPLAY }}>
      <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center", fontFamily: MONO, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>
        Beyond text · modalities
      </div>

      {/* connectors (SVG) */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 900 460">
        {NODES.map((n, i) => {
          const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
          const x = CX + Math.cos(a) * R;
          const y = CY + Math.sin(a) * R;
          const at = 24 + i * 18;
          const p = interpolate(frame, [at, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const ex = CX + (x - CX) * p;
          const ey = CY + (y - CY) * p;
          return (
            <line key={i} x1={CX} y1={CY} x2={ex} y2={ey} stroke={n.color} strokeWidth={1.5} strokeDasharray={n.native ? "0" : "5 5"} opacity={0.6} />
          );
        })}
      </svg>

      {/* center model */}
      <div style={{ position: "absolute", left: CX - 46, top: CY - 46, width: 92, height: 92, borderRadius: "50%", border: "1.5px solid var(--zip)", background: "var(--zip-wash)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, color: "var(--zip)" }}>model</span>
        <span style={{ fontSize: 20 }}>🙂</span>
      </div>

      {/* nodes */}
      {NODES.map((n, i) => {
        const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
        const x = CX + Math.cos(a) * R;
        const y = CY + Math.sin(a) * R;
        const at = 24 + i * 18;
        const s = spring({ frame: frame - (at + 10), fps, config: { damping: 14 } });
        return (
          <div key={i} style={{ position: "absolute", left: x - 62, top: y - 18, width: 124, height: 36, transform: `scale(${Math.max(0, s)})` }}>
            <div style={{ height: "100%", borderRadius: 10, border: `1.5px solid ${n.color}`, background: "var(--panel)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: DISPLAY, fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: n.color }} />
              {n.label}
            </div>
          </div>
        );
      })}

      {/* legend */}
      <div style={{ position: "absolute", bottom: 52, width: "100%", display: "flex", justifyContent: "center", gap: 22, fontFamily: MONO, fontSize: 11, color: "var(--muted)" }}>
        <span>— native (inside the model)</span>
        <span>· · · tacked-on (separate model)</span>
      </div>
      <div style={{ position: "absolute", bottom: 24, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 15, color: "var(--muted)" }}>
        One model, every modality — and native beats tacked-on.
      </div>
    </AbsoluteFill>
  );
}
