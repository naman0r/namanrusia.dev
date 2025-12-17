"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ProjectTemplate() {
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
              TandemCode
            </h1>
            <span className="px-3 py-1 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">
              Completed
            </span>
          </div>
          <p className="text-xl text-gray-400 font-light">
            Helping people find authentic real-world connections while
            supporting non-profit arts businesses
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
                TandemCode was built to redefine the dating app experience by
                moving away from the typical swipe-based superficial approaches.
                We focused on creating authentic connections among users based
                on shared experiences rather than superficial appearances.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The goal is to provide a contemporary platform for fostering
                authentic relationships, be it romantic or platonic, while
                supporting local arts businesses and creating meaningful
                community connections.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-6">
                Overview
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">
                    Interest-First Matching
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    TandemCode takes a fresh approach to matching people based
                    on physical appearances and focuses predominantly on
                    matching people based on shared interests. While users are
                    required to have at least five photos in profile, it is the
                    primary stage of the match. TandemCode users like other
                    users based on the three pillars of the match.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">
                    Supporting Local Arts
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Our platform is designed to integrate seamlessly with local
                    arts businesses, providing them with increased visibility
                    and customer engagement while giving users meaningful
                    experiences to bond over. This creates a win-win ecosystem
                    that strengthens community connections.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">
                    Authentic Experiences
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Rather than endless messaging, TandemCode encourages users
                    to meet in real-world settings through curated experiences
                    and events, fostering genuine relationships that extend
                    beyond the digital realm.
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
                Built with React Native for cross-platform mobile compatibility,
                ensuring a seamless experience across iOS and Android devices.
                The backend leverages Node.js with Express for robust API
                development and real-time communication features.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                User authentication and data management are handled through
                Firebase, providing secure sign-up/sign-in processes and
                real-time database synchronization. The matching algorithm uses
                sophisticated preference-based filtering to connect compatible
                users.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The application integrates with local business APIs to provide
                up-to-date event information and booking capabilities, creating
                a comprehensive platform that bridges digital connections with
                real-world experiences.
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
                <p className="text-gray-300 text-sm">Software Engineer</p>
              </div>

              {/* Type */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Type
                </h3>
                <p className="text-gray-300 text-sm">
                  Product Manager
                  <br />
                  UX Technical Lead
                  <br />
                  UI Product Engineer
                  <br />
                  iOS Developer
                  <br />
                  Android Developer
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Skills
                </h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>React Native</p>
                  <p>Firebase</p>
                  <p>Node.js</p>
                  <p>Express.js</p>
                  <p>UI/UX Design</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">
                  Tech Stack
                </h3>
                <div className="space-y-2">
                  {[
                    "Technology 1",
                    "Technology 2",
                    "Technology 3",
                    "Technology 4",
                    "Technology 5",
                    "Technology 6",
                    "Technology 7",
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
                      Month Year - Month Year
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="text-gray-300 ml-2">Project Type</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Team Size:</span>
                    <span className="text-gray-300 ml-2">Team Size</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="text-gray-300 ml-2">Project Status</span>
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
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition-colors underline"
                  >
                    GitHub Repository →
                  </a>
                  <a
                    href="#"
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit?
          </p>
          <Link
            href="/contact"
            className="text-white hover:text-gray-300 transition-colors underline"
          >
            Get in touch →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
