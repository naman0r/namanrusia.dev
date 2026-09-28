const COLS = 24;
const ROWS = 12;

function pattern(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const cells: boolean[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) ^ i;
    const x = i % COLS;
    // Denser toward the middle column so it reads like a sprite rather than noise.
    const fromEdge = x < COLS / 2 ? x : COLS - 1 - x;
    cells.push(((h >>> 0) % 100) / 100 > 0.72 - fromEdge * 0.02);
  }
  return cells;
}

/** Stand-in for projects with no screenshot: a deterministic pixel pattern in the project's color. */
export function PixelPlaceholder({ seed, color, label }: { seed: string; color: string; label: string }) {
  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden bg-coal" role="img" aria-label={`${label}: no screenshot yet`}>
      <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {pattern(seed).map((on, i) => (
          <span key={i} style={{ background: on ? color : "transparent", opacity: on ? 0.25 + ((i * 7) % 5) / 8 : 1 }} />
        ))}
      </div>
      <span className="absolute bottom-3 left-3 bg-ink px-2 py-1 label text-[10px] text-dust">no screenshot yet</span>
    </div>
  );
}
