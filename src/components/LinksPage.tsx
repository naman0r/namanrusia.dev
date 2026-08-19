import {
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineMail,
  AiOutlineTwitter,
} from "react-icons/ai";
import { FiFileText, FiGlobe } from "react-icons/fi";

const links = [
  {
    name: "GitHub",
    href: "https://github.com/naman0r",
    icon: AiOutlineGithub,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/namanrusia",
    icon: AiOutlineLinkedin,
  },
  {
    name: "Email",
    href: "mailto:rusia.n@northeastern.edu",
    icon: AiOutlineMail,
  },
];

export default function LinksPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f1e7] px-6 py-16 text-stone-900">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Naman Rusia
        </h1>
        <p className="mt-1 text-center text-sm text-stone-500">
          Computer Science student and tech enthusiast
        </p>

        <ul className="mt-10 space-y-3">
          {links.map(({ name, href, icon: Icon }) => {
            const isExternal = href.startsWith("http");
            return (
              <li key={name}>
                <a
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-lg border border-stone-300/70 bg-[#fbf8f1] px-4 py-3 text-base transition-colors hover:border-stone-400 hover:bg-[#f0eadd]"
                >
                  <Icon className="h-5 w-5 text-stone-600" />
                  <span>{name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
