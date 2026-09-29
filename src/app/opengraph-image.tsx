import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { homes, profile } from "@/content/profile";
import { EARTH, EARTH_H, EARTH_W } from "@/scene/earth";
import { ACCENT } from "@/scene/palette";

export const alt = "Naman Rusia, software engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0c0b0a";
const RAD = Math.PI / 180;
// Turned so Boston and India are both on the near side, with the route between them across the middle.
const LON0 = 2;
const LAT0 = 24;
const R = 160;
const BOX = 1000;

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const shade = (c: string, k: number) =>
  `rgb(${hex(c)
    .map((v) => Math.round(Math.min(255, v * k)))
    .join(",")})`;

/** Unit-sphere position in view space: x right, y up, z toward the viewer. */
function view(lat: number, lon: number, r = 1) {
  const la = lat * RAD;
  const d = (lon - LON0) * RAD;
  const x = Math.cos(la) * Math.sin(d);
  const y = Math.sin(la);
  const z = Math.cos(la) * Math.cos(d);
  return [x * r, (y * Math.cos(LAT0 * RAD) - z * Math.sin(LAT0 * RAD)) * r, (y * Math.sin(LAT0 * RAD) + z * Math.cos(LAT0 * RAD)) * r];
}

/**
 * The title-screen globe drawn flat for the share card: the same land mask, palette and voxel
 * rhythm as the WebGL one, projected once at build time into an SVG.
 */
function globe() {
  const shapes: { z: number; svg: string }[] = [];
  const square = (x: number, y: number, z: number, s: number, fill: string, depth = 0) => {
    const px = BOX / 2 + x * R - s / 2;
    const py = BOX / 2 - y * R - s / 2;
    const side = depth ? `<rect x="${px + depth}" y="${py + depth}" width="${s}" height="${s}" fill="${INK}" opacity="0.55"/>` : "";
    shapes.push({ z, svg: `${side}<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="${fill}"/>` });
  };
  // Drawn behind the planet unless it clears the silhouette.
  const visible = (x: number, y: number, z: number) => z >= 0 || Math.hypot(x, y) > 1;
  const light = [-0.45, 0.55, 0.7];
  const lambert = (x: number, y: number, z: number) => 0.35 + 0.75 * Math.max(0, x * light[0] + y * light[1] + z * light[2]);

  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const n = 2600;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const s = Math.sqrt((4 * Math.PI) / n) * R * 0.9;
  const scan = Math.sin(38 * RAD);
  for (let i = 0; i < n; i++) {
    const wy = 1 - ((i + 0.5) / n) * 2;
    const ring = Math.sqrt(1 - wy * wy);
    const lat = Math.asin(wy) / RAD;
    const lon = Math.atan2(Math.cos(golden * i) * ring, Math.sin(golden * i) * ring) / RAD;
    const cell = EARTH[Math.min(EARTH_H - 1, Math.floor(90 - lat)) * EARTH_W + Math.min(EARTH_W - 1, Math.floor(lon + 180))];
    const roll = rand();
    const [x, y, z] = view(lat, lon);
    if (z < -0.05) continue;
    const k = lambert(x, y, z);
    if (cell === "U" || cell === "I") square(x, y, z, s * 1.05, shade(ACCENT, k), 2);
    else if (cell === "#") {
      const band = Math.max(0, 1 - Math.abs(wy - scan) / 0.07);
      const base = band > 0.3 ? "#ffd23f" : roll > 0.82 ? "#eee7d7" : roll > 0.68 ? "#4f6b2a" : "#c8f03c";
      square(x, y, z, s, shade(base, k * 0.92), 2);
    } else square(x, y, z, s * 0.36, shade("#2a2622", 1.5 * k), 0);
  }

  // US, India, Singapore, Boston, lifted off the surface like the scene's arcs.
  for (let leg = 0; leg < homes.length - 1; leg++) {
    const a = view(homes[leg].lat, homes[leg].lon);
    const b = view(homes[leg + 1].lat, homes[leg + 1].lon);
    for (let j = 0; j <= 48; j++) {
      const f = j / 48;
      const v = a.map((c, q) => c + (b[q] - c) * f);
      const lift = (1.04 + Math.sin(Math.PI * f) * 0.3) / Math.hypot(v[0], v[1], v[2]);
      const [x, y, z] = v.map((c) => c * lift);
      if (z < 0) continue;
      const head = leg === 0 && Math.abs(f - 0.62) < 0.05;
      square(x, y, z + 2, head ? 6 : 4, head ? "#ffd23f" : ACCENT);
    }
  }

  homes.forEach((h) => {
    for (let j = 0; j < 4; j++) {
      const [x, y, z] = view(h.lat, h.lon, 1.03 + j * 0.05);
      if (z > 0) square(x, y, z + 1, 8 - j * 1.5, h.code === "BOS" ? "#f1ebdc" : "#ffd23f");
    }
  });

  // One satellite per country visited, parked on three tilted orbits.
  for (let k = 0; k < 16; k++) {
    const orbit = k % 3;
    const t = k * 2.4 + orbit;
    const r = 1.45 + orbit * 0.16;
    const tilt = 0.5 - orbit * 0.45;
    const [x, y0, z0] = [Math.cos(t) * r, 0, Math.sin(t) * r];
    const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
    const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
    // Left of the planet is the text column; a satellite there reads as a stray pixel in the copy.
    if (visible(x, y, z) && x > -1.05) square(x, y, z, 5, k % 4 ? "#eee7d7" : "#ffd23f");
  }

  const body = shapes
    .sort((p, q) => p.z - q.z)
    .map((p) => p.svg)
    .join("");
  return `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${BOX}" height="${BOX}">${body}</svg>`).toString("base64")}`;
}

/** The share card: the title screen's name and globe. */
export default async function Image() {
  const font = await readFile(join(process.cwd(), "src/fonts/DepartureMono-Regular.otf"));
  const [first, last] = profile.name.split(" ");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: INK,
        color: "#eee7d7",
        fontFamily: "Departure",
        border: "12px solid #2a2622",
      }}
    >
      <img src={globe()} width={BOX} height={BOX} style={{ position: "absolute", left: 410, top: -185 }} alt="" />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: "100%" }}>
        <div style={{ display: "flex", fontSize: 24, color: ACCENT }}>Open to Spring + Summer 2027 co-ops</div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 112, lineHeight: 0.9, textTransform: "uppercase" }}>
            <span>{first}</span>
            <span style={{ color: ACCENT, textShadow: "6px 6px 0 #1c3a82" }}>{last}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 28, marginTop: 32, color: "#8e8577", lineHeight: 1.3 }}>
            <span>Software engineer on</span>
            <span style={{ color: "#c8f03c" }}>backend, cloud, and systems.</span>
            <span>CS + Business at Northeastern.</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ width: 22, height: 8, background: i < 8 ? ACCENT : "#2a2622" }} />
          ))}
          <span style={{ marginLeft: 14, fontSize: 22, color: "#8e8577" }}>namanrusia.dev</span>
        </div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Departure", data: font, style: "normal", weight: 400 }] },
  );
}
