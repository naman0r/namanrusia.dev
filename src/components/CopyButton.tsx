"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="label text-dust transition-colors hover:text-bone"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
