"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function TandemCodeProject() {
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
              Tandem Code
            </h1>
            <span className="px-3 py-1 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">
              In Progress
            </span>
          </div>
          <p className="text-xl text-gray-400 font-light">
            <span className="text-red-100">Gamifying</span> and socializing Tech
            Interview Preparation
          </p>
        </motion.div>

        {/* Project Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-12 rounded-2xl overflow-hidden"
        >
          <Image
            src="/tandemcode.png"
            alt="TandemCode Platform"
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </motion.div>

        {/* Project Details */}
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
                I am building TandemCode to reimagine how interview preparation
                in Tech can be done. Often times, especially as an
                underclassman, it is hard for me to find peers who would be
                interested in doing mock interviews, or practicing DSA in a
                pair/group. I am building TandemCode to provide a platform for
                students to find peers who are interested in the same things as
                them, and to help them practice for interviews and DSA.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The goal is to provide a contemporary platform for fostering
                authentic relationships, finding partners to do interview prep
                who are on the same experience level, be able to provide
                features like:
                <ul className="list-disc list-inside text-gray-300 text-sm leading-relaxed pl-5 pt-5">
                  <li>
                    <span className="text-white font-medium">
                      Real Time Pair Programming with CRDT/OT features
                    </span>{" "}
                  </li>

                  <li>
                    <span className="text-white font-medium">
                      Time and Space complexity analysis using code execution in
                      ephemeral containers
                    </span>{" "}
                  </li>

                  <li>
                    <span className="text-white font-medium">
                      AI-powered interview prep with personalized feedback
                    </span>{" "}
                  </li>

                  <li>
                    <span className="text-white font-medium">
                      Social aspect to find peers on the same experience level
                    </span>{" "}
                  </li>

                  <li>
                    <span className="text-white font-medium">
                      Promote consistency in interview prep with social
                      accountability principles
                    </span>{" "}
                  </li>
                </ul>
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-xl uppercase tracking-[0.2em] text-blue-600 mb-6 underline">
                Technical Implementation
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                React for the frontend, Java Spring for the backend, and docker
                + postgres for the database. Using WebSockets for real-time
                communication.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Clerk for authentication and database management.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-xl uppercase tracking-[0.2em] text-blue-600 mb-6 pt-5 underline">
                Take-aways
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">
                    Learning a new Frameworks/technologies is all about
                    Momentum.
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This project was very technically challenging for me, but
                    kept me so engaged. I found that gaining momentum at the
                    start by planning out exactly what I will be doing
                    week-by-week, scope, and getting all the setup out of the
                    way made my journey very smooth. There have been a lot of
                    projects that I have quit 1 or 2 days in in the past, but
                    what I learned from TandemCode is that frontloading the
                    planning phase and setup makes the development process a lot
                    more smooth.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">
                    Springboot is really cool!
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Spring Boot feels like magic because it takes the complexity
                    of enterprise-level Java development and hides it behind
                    clean defaults, auto-configuration, and a plug-and-play
                    ecosystem. Instead of spending hours setting up boilerplate,
                    configuring XML files, or wiring dependencies by hand, you
                    can launch a production-ready application with just a few
                    lines of code. It’s “cool” because it gives developers the
                    power of the entire Spring framework—security, databases,
                    REST APIs, messaging—without drowning in setup. With
                    features like embedded servers, starter dependencies, and
                    smooth integration with cloud platforms, Spring Boot makes
                    building scalable, real-world applications feel almost
                    effortless. It’s like having a powerful toolbox where
                    everything just works together out of the box, letting you
                    focus on logic and innovation rather than plumbing.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">take away #3</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">-</p>
                </div>
              </div>
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
                <p className="text-gray-300 text-sm">Solo Dev</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Skills
                </h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Product Design</p>
                  <p>Product Development</p>
                  <p>Full Stack Development</p>
                  <p>AWS</p>
                  <p>Cloud Services</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Tech Stack
                </h3>
                <div className="space-y-2">
                  {[
                    "React.js",
                    "Spring Boot",
                    "Java",
                    "TypeScript",
                    "Docker",
                    "PostgreSQL",
                    "AWS",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="inline-block px-3 py-1 text-sm bg-gray-900 text-gray-300 rounded-md mr-2 mb-2"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Info */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Project Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Timeline:</span>
                    <span className="text-gray-300 ml-2">
                      August 2025 - present
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="text-gray-300 ml-2">
                      Full-Stack Progressive Web Application
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Team Size:</span>
                    <span className="text-gray-300 ml-2">Solo project</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="text-gray-300 ml-2">In Progress</span>
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
                    href="https://github.com/naman0r/tandemcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition-colors underline"
                  >
                    GitHub Repository →
                  </a>
                  <a
                    href="https://tandemcode.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition-colors underline"
                  >
                    Live Demo →
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
          <p className="text-gray-500 text-sm mb-4">
            Interested in learning more about creating meaningful connections
            through technology?
          </p>
          <Link
            href="/contact"
            className="text-white hover:text-gray-300 transition-colors underline"
          >
            Let's connect →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
