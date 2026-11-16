import { ImageResponse } from "next/og";

export const alt = "Mochamad Rizki, Junior Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#111827",
        color: "#ffffff",
      }}
    >
      <div style={{ fontSize: 28, color: "#818cf8" }}>Portfolio</div>
      <div style={{ fontSize: 84, fontWeight: 700, marginTop: 16 }}>
        Mochamad Rizki
      </div>
      <div style={{ fontSize: 40, color: "#d1d5db", marginTop: 16 }}>
        Junior Full Stack Developer
      </div>
      <div style={{ fontSize: 28, color: "#9ca3af", marginTop: 40 }}>
        React · Next.js · Node.js · PostgreSQL
      </div>
    </div>,
    { ...size },
  );
}
