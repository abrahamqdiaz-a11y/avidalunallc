import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#576D52",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 48 48">
          <path d="M30 10a15 15 0 1 0 7 24 13 13 0 1 1-7-24z" fill="#F7F3EE" />
        </svg>
      </div>
    ),
    size,
  );
}
