"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ScrambleText from "@/components/ScrambleText";

export default function Experience() {
  const experiences = [
    {
      company: "Philips Healthcare",
      title: "Software Engineering Co-op",
      team: "Systems Integration & Automation",
      link: "",
      period: "Jan 2026 — Jun 2026",
      location: "Cambridge, MA",
      description:
        "Automating deployments of Philips PICiX Hospital Patient Monitoring system in a distributed virtualized environment at the largest scale at Philips.",
      technologies: ["FastAPI", "Python", "PowerShell", "C#", ".NET", "Distributed Systems"],
      color: "from-blue-500/20 to-cyan-500/10",
      dot: "bg-blue-400",
    },
    {
      company: "Auribus Labs",
      title: "Software Engineer Intern",
      team: "",
      period: "Apr — Aug 2025",
      location: "Boston, MA",
      link: "https://www.auribuslabs.com/",
      description:
        "Built 2 full-stack web applications for R&D of a new product. Also worked on a research iOS application with native development.",
      technologies: ["Next.js", "Swift", "iOS", "GCP", "Hasura", "GraphQL"],
      color: "from-violet-500/20 to-purple-500/10",
      dot: "bg-violet-400",
    },
    {
      company: "TAMID at Northeastern",
      title: "Tech Lead",
      team: "Tech Consulting Track",
      link: "https://foresight-tamid.vercel.app/about",
      period: "Jan 2025 — Present",
      location: "Boston, MA",
      description:
        "Building Foresight: an AI product integrating with hotel Building Management Systems to provide real-time revenue optimization pricing suggestions.",
      technologies: ["FastAPI", "PostgreSQL", "Next.js", "RAG", "NeonDB", "CI/CD"],
      color: "from-emerald-500/20 to-teal-500/10",
      dot: "bg-emerald-400",
    },
    {
      company: "Code4Community",
      title: "Software Engineer",
      team: "Core Infrastructure Team",
      period: "Sep 2025 — Present",
      link: "https://www.c4cneu.com/people",
      location: "Boston, MA",
      description: "Contributing to the core infrastructure supporting pro-bono software for non-profits across Boston.",
      technologies: ["Next.js", "AWS", "PostgreSQL", "Jest", "TypeScript"],
      color: "from-orange-500/20 to-amber-500/10",
      dot: "bg-orange-400",
    },
    {
      company: "Venu AI",
      title: "TPM & SWE Intern",
      team: "YC W21",
      period: "Apr — Jul 2024",
      link: "https://www.venu3d.com/",
      location: "Remote",
      description:
        "End-to-end ownership of core product features at a Y-Combinator backed startup.",
      technologies: ["React", "Python", "Django", "Azure", "Celery", "Redis"],
      color: "from-rose-500/20 to-pink-500/10",
      dot: "bg-rose-400",
    },
    {
      company: "Forge",
      title: "Product Developer",
      team: "Product Development Studio",
      link: "https://www.forgenu.com/",
      period: "Sep 2024 — May 2025",
      location: "Boston, MA",
      description:
        "Built mobile applications for real-world client projects and startups across 2 semesters.",
      technologies: ["React Native", "Expo", "TypeScript", "MongoDB"],
      color: "from-sky-500/20 to-indigo-500/10",
      dot: "bg-sky-400",
    },
  ];

  const education = {
    school: "Northeastern University",
    degree: "BS Computer Science & Business Administration",
    period: "December 2027",
    location: "Boston, MA",
    gpa: "3.89 GPA · Dean's List",
  };

  return (
    <div className="min-h-screen text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
            Experience
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl">
            Internships, co-ops, and club projects building real products at
            the intersection of tech and business.
          </p>
        </motion.div>

        {/* Timeline */}
        <section className="mb-24">
          <ScrambleText
            text="Professional Experience"
            tag="h2"
            className="text-xs uppercase tracking-[0.22em] text-gray-600 mb-16"
          />

          <div className="relative">
            {/* Vertical timeline line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top" }}
              className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-white/5 via-white/15 to-white/5"
            />

            <div className="space-y-0">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="relative pl-10 pb-14 last:pb-0 group"
                >
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.08 + 0.15,
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    }}
                    className={`absolute left-[-5px] top-1.5 w-[10px] h-[10px] rounded-full ${exp.dot} ring-2 ring-black`}
                  />

                  {/* Connector line to card */}
                  <div className="absolute left-[5px] top-[10px] w-4 h-px bg-white/10" />

                  {/* Card */}
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`rounded-xl border border-white/5 bg-gradient-to-br ${exp.color} backdrop-blur-sm p-6 hover:border-white/10 transition-colors duration-300`}
                  >
                    {/* Top row */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {exp.link ? (
                            <a
                              href={exp.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-base font-semibold text-white hover:underline"
                            >
                              {exp.company}
                            </a>
                          ) : (
                            <span className="text-base font-semibold text-white">
                              {exp.company}
                            </span>
                          )}
                          {exp.team && (
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 border border-white/10 rounded-full px-2 py-0.5">
                              {exp.team}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm font-light">
                          {exp.title}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-gray-400 tabular-nums">
                          {exp.period}
                        </p>
                        <p className="text-xs text-gray-600">{exp.location}</p>
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {exp.description}
                      </p>
                    )}

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 + i * 0.04 + 0.3 }}
                          className="px-2.5 py-0.5 text-[11px] bg-black/30 text-gray-300 rounded-full border border-white/8"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <ScrambleText
            text="Education"
            tag="h2"
            className="text-xs uppercase tracking-[0.22em] text-gray-600 mb-10"
            delay={200}
          />

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-base font-medium text-white mb-1">
                  {education.school}
                </h3>
                <p className="text-sm text-gray-500">{education.period}</p>
                <p className="text-sm text-gray-600">{education.location}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-lg font-light text-gray-200 mb-1">
                  {education.degree}
                </h4>
                <p className="text-sm text-gray-400">{education.gpa}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-12 border-t border-gray-900"
        >
          <p className="text-gray-500 text-sm mb-4">
            Interested in working together?
          </p>
          <Link
            href="/contact"
            className="text-white hover:text-gray-300 transition-colors underline"
          >
            Let&apos;s connect
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
