const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E")`;

/**
 * Warm upper-left, cool lower-right, echoing the professional / on-campus
 * colours in the chart. The parent must not paint an opaque background or this
 * layer, which sits at -z-10, is covered by it.
 */
export default function ExperienceBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 55% at 10% 12%, rgba(226,176,122,0.10), transparent 65%),
            radial-gradient(ellipse 55% 65% at 92% 80%, rgba(143,184,221,0.10), transparent 65%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: NOISE }}
      />
    </div>
  );
}
