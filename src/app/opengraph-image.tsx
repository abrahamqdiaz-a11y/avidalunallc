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
          background: "#F8F9F6",
          padding: 72,
          color: "#1F2622",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 48 48">
            <path d="M30 8a17 17 0 1 0 8 28 14 14 0 1 1-8-28z" fill="#293C32" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#293C32" }}>Avida Luna</div>
            <div style={{ fontSize: 18, letterSpacing: 5, color: "#4B5751" }}>NURSE-LED IV CARE</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#293C32", lineHeight: 1.05 }}>Experienced nursing care, brought to you.</div>
          <div style={{ fontSize: 32, marginTop: 20 }}>
            Mobile IV therapy with Shary Gonzalez, RN, BSN · Lakewood Ranch, FL
          </div>
        </div>
        <div style={{ display: "flex", height: 8, width: 160, background: "#A6B6BD", borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
