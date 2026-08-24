import { ImageResponse } from "next/og";

export const alt = "Exverse — a place to learn something";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0e0b",
          color: "#f5f2e8",
          padding: 70,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f5f2e8", color: "#0e0e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>
            E
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>Exverse</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#a29c88", letterSpacing: 2, textTransform: "uppercase" }}>
            open source · learn by doing
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 82, fontWeight: 800, lineHeight: 1.05, marginTop: 14, letterSpacing: -2 }}>
            <span>The place to&nbsp;</span>
            <span style={{ color: "#e5a24a" }}>learn something.</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 24 }}>
          {[
            ["#e5a24a", "model"],
            ["#4fbfa3", "thinking"],
            ["#a98bf5", "tools"],
            ["#e9765a", "verify"],
          ].map(([c, t]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, color: "#a29c88" }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: c }} />
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
