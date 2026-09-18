// The Finder folder, drawn once and recolored by hue so the same shape works for the
// blue desktop icons, the rainbow cascades, and the pixel-font footer.
export default function Folder({
  hue = 208,
  className = "",
  style,
}: {
  hue?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 64 52"
      className={className}
      aria-hidden
      style={{ ...style, ["--h" as string]: hue }}
    >
      <path
        d="M4 2h18a4 4 0 0 1 3 1.3L29 8h31a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"
        style={{ fill: "hsl(var(--h) 78% 52%)" }}
      />
      <rect
        x="0"
        y="14"
        width="64"
        height="36"
        rx="4"
        style={{ fill: "hsl(var(--h) 88% 70%)" }}
      />
      <rect
        x="0"
        y="14"
        width="64"
        height="18"
        rx="4"
        style={{ fill: "hsl(var(--h) 92% 76%)" }}
      />
      <rect
        x="0.5"
        y="14.5"
        width="63"
        height="35"
        rx="3.5"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
      />
    </svg>
  );
}
