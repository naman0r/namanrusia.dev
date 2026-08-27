import Link from "next/link";
import { type Role } from "@/lib/experience";

/** The always-expanded body of a role. */
export default function RoleBody({ role }: { role: Role }) {
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-[1rem] font-normal leading-snug text-white/90">
          {role.title}
        </h3>
        {role.ongoing && (
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Ongoing
          </span>
        )}
      </div>

      <p className="mt-2.5 max-w-2xl text-[13.5px] leading-6 text-white/55">
        {role.blurb}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {role.tech.map((t) => (
          <span key={t} className="font-mono text-[10px] text-white/35">
            {t}
          </span>
        ))}
        {role.link && (
          <Link
            href={role.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#e2b07a]/80 transition-colors hover:text-[#e9e4da]"
          >
            Visit →
          </Link>
        )}
      </div>

    </>
  );
}
