import { bundledLanguages, createCssVariablesTheme, createHighlighter, type BundledLanguage } from "shiki";
import { CopyButton } from "./CopyButton";

// Token colors come from CSS variables in globals.css, so code uses the site's palette.
const theme = createCssVariablesTheme({ name: "site", variablePrefix: "--shiki-" });
const highlighter = createHighlighter({ themes: [theme], langs: [] });

/** A fenced code block, highlighted at build time. Languages load on first use. */
export async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const h = await highlighter;
  const known = lang in bundledLanguages;
  if (known) await h.loadLanguage(lang as BundledLanguage);
  const html = h.codeToHtml(code, { lang: known ? lang : "text", theme: "site" });

  return (
    <figure className="group/code my-8 border-2 border-line bg-coal shadow-[4px_4px_0_0_var(--color-line)]">
      <figcaption className="label flex items-center justify-between border-b-2 border-line px-4 py-2 text-dust">
        <span>{known ? lang : "text"}</span>
        <CopyButton text={code} />
      </figcaption>
      <div className="overflow-x-auto px-4 py-4 text-sm/6" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
