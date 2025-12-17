"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function GitInterviewer() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Projects
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Git Interviewer
            </h1>
            <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
              v1.0.0
            </span>
          </div>
          <p className="text-xl text-gray-400 font-light">
            A pre-commit hook that interviews you about your code before letting
            you commit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-12 rounded-2xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center border border-gray-800"
        >
          <Image
            src="/git-interviewer.png"
            alt="TandemCode Platform"
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-2">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-6">
                Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Git Interviewer transforms everyday commits into lightweight
                technical interviews. Before each commit, it analyzes your
                staged changes, generates interview-style questions, and
                requires a meaningful answer.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Most developers commit code too quickly without thinking about
                design decisions, intent, or tradeoffs. This tool forces deeper
                understanding and intentional commits—acting like a senior
                engineer inside your terminal.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-6">
                Features
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">
                    Interview Personas
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Choose the personality you want challenging your commit:
                  </p>
                  <ul className="grid grid-cols-1 gap-3 text-sm text-gray-300">
                    <li className="bg-gray-900/50 p-3 rounded border border-gray-800">
                      <strong className="text-white block mb-1">Nice</strong>
                      Supportive engineer who wants clarity and understanding.
                    </li>
                    <li className="bg-gray-900/50 p-3 rounded border border-gray-800">
                      <strong className="text-white block mb-1">Grumpy</strong>
                      Tired senior dev who has seen too much. Very picky.
                    </li>
                    <li className="bg-gray-900/50 p-3 rounded border border-gray-800">
                      <strong className="text-white block mb-1">Systems</strong>
                      Asks about architecture, scaling, risk, and tradeoffs.
                    </li>
                    <li className="bg-gray-900/50 p-3 rounded border border-gray-800">
                      <strong className="text-white block mb-1">Founder</strong>
                      Focuses on product impact and iteration speed.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">
                    Quality Assurance
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    By validating your thought process before the code enters
                    the repository, Git Interviewer ensures higher code quality
                    and better engineering discipline across the team.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-6">
                Technical Implementation
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Built with Python, this tool integrates directly with Git hooks
                to intercept the commit process. It analyzes the diff of staged
                files and uses LLMs to generate context-aware questions based on
                the selected persona.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The application manages the interaction loop in the terminal,
                validating the developer&apos;s answers before allowing the
                commit to proceed or rejecting it if the explanation is
                insufficient.
              </p>
            </motion.section>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-sm uppercase tracking-[0.2em] pt-20 text-red-600 mb-6">
                What I learned
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                I did this project during winter break when I arrived to the
                airport for a flight comedicaly early, and it got delayed due to
                heavy snow in Boston, so I had some time to kill.
              </p>
              <p className="text-gray-300 leading-relaxed">
                I think I got a much richer and deeper understanding of git, git
                workflows, and I did a lot of reflecting on my own development
                practices and how this tool can actually help me. I plan on
                making this tool a lot better and a lot more annoying to use in
                the future, but for now it is a good start. It was surprisingly
                easy for me to actually make this tool and deploy it for other's
                to use. Definitely want to create some more CLI tools
                (potentially some that are more useful), but this project was a
                really fun and cool weekend project.
              </p>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Role */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Role
                </h3>
                <p className="text-gray-300 text-sm">Creator & Engineer</p>
              </div>

              {/* Type */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Type
                </h3>
                <p className="text-gray-300 text-sm">
                  Open Source Tool
                  <br />
                  CLI Application
                  <br />
                  DevOps / Productivity
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Skills
                </h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Python</p>
                  <p>Git Internals</p>
                  <p>LLM Integration</p>
                  <p>CLI Design</p>
                  <p>Package Distribution</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Tech Stack
                </h3>
                <div className="space-y-2">
                  {["Python", "Git", "PyPI", "Rich (CLI)", "OpenAI API"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="inline-block px-3 py-1 text-sm bg-gray-900 text-gray-300 rounded-md mr-2 mb-2"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Project Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="text-gray-300 ml-2">Open Source</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Language:</span>
                    <span className="text-gray-300 ml-2">Python 100%</span>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Links
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://github.com/naman0r/git-interviewer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition-colors underline"
                  >
                    GitHub Repository →
                  </a>
                  <a
                    href="https://pypi.org/project/git-interviewer/1.0.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition-colors underline"
                  >
                    View on PyPI →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-12 border-t border-gray-900"
        >
          <Link
            href="https://github.com/naman0r/git-interviewer"
            target="_blank"
            className="text-white text-xs hover:text-gray-300 transition-colors underline"
          >
            Try Git Interviewer today!
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
