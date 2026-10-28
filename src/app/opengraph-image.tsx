import { ImageResponse } from "next/og";

// Brand-style social preview image. TODO: add Shary's real logo once a high-res version exists.
export const alt = "Avida Luna Wellness: nurse-led mobile IV hydration in Lakewood Ranch, FL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F3EE",
          padding: 72,
          color: "#3E4436",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#576D52" }}>Avida Luna</div>
            <div style={{ fontSize: 18, letterSpacing: 8, color: "#576D52" }}>WELLNESS</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#3E4436", lineHeight: 1.05 }}>Experienced nursing care, brought to you.</div>
          <div style={{ fontSize: 32, marginTop: 20 }}>
            Mobile IV therapy with Shary Gonzalez, RN, BSN · Lakewood Ranch, FL
          </div>
        </div>
        <div style={{ display: "flex", height: 8, width: 160, background: "#C08A67", borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
