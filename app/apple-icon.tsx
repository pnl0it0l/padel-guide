import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      >
        <circle cx="9" cy="9" r="7" strokeWidth="1.2" />
        <circle cx="9" cy="9" r="5" strokeWidth="1.2" />
        <line
          x1="14"
          y1="14"
          x2="21"
          y2="21"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line x1="6" y1="9" x2="12" y2="9" strokeWidth="1.2" />
        <line x1="9" y1="6" x2="9" y2="12" strokeWidth="1.2" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
