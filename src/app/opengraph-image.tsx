import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = "Naman Rusia, software engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MONO: Record<string, string[]> = {
  N: ["##...##", "###..##", "####.##", "##.####", "##..###", "##...##", "##...##"],
  R: ["######.", "##...##", "##...##", "######.", "##.##..", "##..##.", "##...##"],
};

/** The NR voxel monogram from the contact screen next to the name, as a share card. */
export default async function Image() {
  const font = await readFile(join(process.cwd(), "src/fonts/DepartureMono-Regular.otf"));
  const cell = 26;
  const blocks: { x: number; y: number; c: string }[] = [];
  ["N", "R"].forEach((ch, li) =>
    MONO[ch].forEach((row, y) =>
      [...row].forEach((px, x) => px === "#" && blocks.push({ x: li * 9 + x, y, c: li ? "#eee7d7" : "#4f8bff" })),
    ),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0c0b0a",
        color: "#eee7d7",
        fontFamily: "Departure",
        padding: 64,
        border: "12px solid #2a2622",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8e8577" }}>
        <span style={{ color: "#4f8bff" }}>Open to Spring + Summer 2027 co-ops</span>
        <span>namanrusia.dev</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 104, lineHeight: 0.95, textTransform: "uppercase" }}>{profile.name}</div>
          <div style={{ fontSize: 28, marginTop: 28, color: "#8e8577", lineHeight: 1.3 }}>
            Software engineer · backend, cloud, systems · CS + Business at Northeastern
          </div>
        </div>
        <div style={{ display: "flex", position: "relative", width: 16 * cell, height: 7 * cell }}>
          {blocks.map((b) => (
            <div
              key={`${b.x}-${b.y}`}
              style={{
                position: "absolute",
                left: b.x * cell,
                top: b.y * cell,
                width: cell - 3,
                height: cell - 3,
                background: b.c,
                boxShadow: "5px 5px 0 #1c3a82",
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: 32 }, (_, i) => (
          <div key={i} style={{ width: 22, height: 8, background: i < 22 ? "#4f8bff" : "#2a2622" }} />
        ))}
      </div>
    </div>,
    { ...size, fonts: [{ name: "Departure", data: font, style: "normal", weight: 400 }] },
  );
}
