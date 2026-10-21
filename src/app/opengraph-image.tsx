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
          background: "#B7CAA3",
          padding: 72,
          color: "#3E4436",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 48 48">
            <path d="M30 12a14 14 0 1 0 6 22 12 12 0 1 1-6-22z" fill="#B8BC98" stroke="#576D52" strokeWidth="1.2" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, color: "#45583F" }}>Avida Luna</div>
            <div style={{ fontSize: 18, letterSpacing: 8, color: "#45583F" }}>WELLNESS</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, color: "#45583F", lineHeight: 1.05 }}>Wellness that comes to you.</div>
          <div style={{ fontSize: 32, marginTop: 20 }}>
            Mobile IV hydration from Shary Gonzalez, RN, BSN · Lakewood Ranch, FL
          </div>
        </div>
        <div style={{ display: "flex", height: 8, width: 160, background: "#9C6646", borderRadius: 8 }} />
      </div>
    ),
    size,
  );
}
