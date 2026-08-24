import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

/** Style: terminal + typewriter.
 *  Teaches: for a real calculation the model won't fake it — it writes a
 *  program, runs it, and reads back the exact result. */

const MONO = "var(--font-mono), monospace";
const DISPLAY = "var(--font-display), sans-serif";
const CODE = `# too big to do in my head → write code\nresult = 31415926 * 2718281\nprint(result)`;

export default function PythonRun() {
  const frame = useCurrentFrame();
  const typed = Math.floor(interpolate(frame, [40, 130], [0, CODE.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const shown = CODE.slice(0, typed);
  const running = frame > 138 && frame < 165;
  const done = frame >= 165;
  const caretOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: "var(--panel)", fontFamily: DISPLAY, alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ position: "absolute", top: 26, fontFamily: MONO, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>
        Tool use · the Python interpreter
      </div>

      {/* prompt bubble */}
      <div style={{ position: "absolute", top: 74, right: 90, padding: "8px 14px", borderRadius: 12, background: "var(--paper-2)", fontFamily: DISPLAY, fontSize: 14, color: "var(--ink-soft)", opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
        “What is 31415926 × 2718281?”
      </div>

      {/* terminal */}
      <div style={{ width: 620, borderRadius: 12, overflow: "hidden", border: "1px solid #23241d", background: "#1b1c15", boxShadow: "0 20px 50px -30px rgba(0,0,0,.6)", marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 13px", background: "#23241d" }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, background: "#3a3b30" }} />
          <span style={{ width: 10, height: 10, borderRadius: 99, background: "#3a3b30" }} />
          <span style={{ width: 10, height: 10, borderRadius: 99, background: "#3a3b30" }} />
          <span style={{ marginLeft: 6, fontFamily: MONO, fontSize: 11, color: "#8a8a72" }}>python · interpreter</span>
        </div>
        <div style={{ padding: 18, fontFamily: MONO, fontSize: 14, lineHeight: 1.7, color: "#d7d3b8", whiteSpace: "pre-wrap", minHeight: 118 }}>
          {shown.split("\n").map((line, i) => (
            <div key={i} style={{ color: line.trim().startsWith("#") ? "#7d7d5f" : "#d7d3b8" }}>
              {line}
              {i === shown.split("\n").length - 1 && !done && caretOn ? <span style={{ color: "#d8a657" }}>▋</span> : null}
            </div>
          ))}
          {running && <div style={{ color: "#7daea3", marginTop: 8 }}>▶ running…</div>}
          {done && (
            <div style={{ marginTop: 10 }}>
              <span style={{ color: "#7daea3" }}>▶ </span>
              <span style={{ color: "#a9b665" }}>85,392,738,806</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 26, fontFamily: DISPLAY, fontSize: 15, color: "var(--muted)" }}>
        {frame < 130 ? "It writes a program instead of guessing…" : done ? "…runs it, and reads back the exact answer." : "…and runs it."}
      </div>
    </AbsoluteFill>
  );
}
