const WORDS = ["Naman", "Rusia"];

/** Each letter drops in like a sprite and hops when touched. */
export function Name() {
  return (
    <h1 id="top-title" className="font-display select-none text-[clamp(4.2rem,min(15vw,19svh),11.5rem)] leading-[0.84] text-bone">
      <span className="sr-only">Naman Rusia</span>
      {WORDS.map((word, w) => (
        <span
          key={word}
          aria-hidden
          className={`block whitespace-nowrap ${w ? "text-accent [text-shadow:0.05em_0.05em_0_var(--color-accent-deep)]" : ""}`}
        >
          {[...word].map((ch, j) => {
            const i = w * WORDS[0].length + j;
            return (
              <span
                key={j}
                className={`pixel-letter inline-block cursor-default transition-transform duration-150 ease-(--ease-step) hover:-translate-y-[0.08em] active:-translate-y-[0.08em] ${
                  w ? "hover:text-bone" : "hover:text-accent"
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
