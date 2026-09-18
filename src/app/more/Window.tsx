// macOS-style window chrome. The titlebar gradient and inset highlight are what sell it;
// everything else is a content pane. Colors come from the /more tokens in globals.css.
export default function Window({
  title,
  paper = false,
  className = "",
  children,
}: {
  title?: string;
  paper?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative min-w-0 rounded-lg border border-ink/20 p-1 pt-0 shadow-[0_10px_24px_rgba(0,0,0,0.12),inset_0_1px_1px_var(--glint)] ${
        paper
          ? "bg-[linear-gradient(var(--paper-chrome),var(--paper-chrome-edge))]"
          : "bg-[linear-gradient(90deg,var(--chrome-edge),var(--chrome)_50%,var(--chrome-edge))]"
      } ${className}`}
    >
      <div className="relative flex h-7 items-center gap-1.5 px-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] ring-1 ring-black/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] ring-1 ring-black/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] ring-1 ring-black/10" />
        {title && (
          <span className="absolute left-1/2 -translate-x-1/2 truncate text-[11px] tracking-tight text-ink/45 [text-shadow:0_1px_1px_var(--glint)]">
            {title}
          </span>
        )}
        <span className="ml-auto text-[11px] leading-none text-ink/30">x</span>
      </div>
      <div className="overflow-hidden rounded-[5px] bg-pane ring-1 ring-ink/10">
        {children}
      </div>
    </div>
  );
}
