"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  return (
    <div className="min-h-screen bg-black/10  text-white overflow-hidden">
      {/* Social Icons */}
      <div className="fixed top-20 right-6 md:top-6 z-40 flex gap-4">
        <Link
          href="https://github.com/naman0r"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors duration-300"
          aria-label="GitHub"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </Link>
        <Link
          href="https://linkedin.com/in/namanrusia/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors duration-300"
          aria-label="LinkedIn"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </Link>
      </div>

      <div className="">
        <p className="text-gray-400 text-xs flex flex-col justify-end items-end pr-5 pt-5"></p>
        <p className="text-gray-400 text-xs flex flex-col justify-end items-end pr-5 pt-2">
          {/*📍 Boston, MA*/}
        </p>
      </div>
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Primary gradient orb - Orange/Red */}
        <motion.div
          initial={{ x: "-50%", y: "100%" }}
          animate={{
            x: ["-50%", "-30%", "-60%", "-40%", "-50%"],
            y: ["100%", "20%", "-10%", "30%", "100%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(255,69,0,0.8) 0%, rgba(255,140,0,0.6) 30%, rgba(255,165,0,0.4) 50%, transparent 70%)",
          }}
        />

        {/* Secondary gradient orb - Blue/Purple */}
        <motion.div
          initial={{ x: "150%", y: "-50%" }}
          animate={{
            x: ["150%", "70%", "90%", "60%", "150%"],
            y: ["-50%", "10%", "60%", "40%", "-50%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-[900px] h-[900px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(0,100,255,0.8) 0%, rgba(100,50,255,0.6) 30%, rgba(150,100,255,0.4) 50%, transparent 70%)",
          }}
        />

        {/* Tertiary gradient orb - Purple/Pink */}
        <motion.div
          initial={{ x: "50%", y: "150%" }}
          animate={{
            x: ["50%", "80%", "20%", "70%", "50%"],
            y: ["150%", "70%", "80%", "90%", "150%"],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(255,0,150,0.7) 0%, rgba(200,50,255,0.5) 30%, rgba(150,100,255,0.3) 50%, transparent 70%)",
          }}
        />

        {/* Small floating accent orbs */}
        <motion.div
          animate={{
            x: ["-10%", "110%"],
            y: ["20%", "80%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute w-[200px] h-[200px] rounded-full opacity-[0.2]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,200,100,0.9) 0%, transparent 60%)",
          }}
        />

        <motion.div
          animate={{
            x: ["110%", "-10%"],
            y: ["70%", "10%"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute w-[150px] h-[150px] rounded-full opacity-[0.15]"
          style={{
            background:
              "radial-gradient(circle, rgba(100,200,255,0.9) 0%, transparent 60%)",
          }}
        />

        {/* Ambient overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,100,50,0.3) 0%, rgba(100,50,255,0.3) 50%, transparent 100%)",
          }}
        />

        {/* Subtle noise texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        style={{ opacity, y }}
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight">
              <span className="text-gray-500 glow">Hey, I'm</span> Naman
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl">
              A Computer Science and Business student interested in the
              intersection of Finance, Software, Design and building{" "}
              <span className="text-gray-200">impactful </span>
              software.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border border-gray-700 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-0.5 h-2 bg-gray-600 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Philosophy Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-12">
              Philosophy
            </h2>

            <div className="space-y-8 text-gray-300 leading-relaxed">
              <p className="text-2xl md:text-3xl font-light text-white">
                Code is a medium for thought.
              </p>

              <p className="text-lg md:text-xl">
                I believe software development is fundamentally about
                problem-solving and human connection. The best code isn't just
                efficient—it's understandable, maintainable, and serves real
                human needs.
              </p>

              <p className="text-lg md:text-xl">
                My approach combines technical rigor with design sensibility.
                I'm drawn to projects that challenge conventional thinking and
                push the boundaries of what's possible with a little bit of
                creativity and a computer.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Background Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-12">
              Background
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-light text-white mb-4">
                  Background
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  I grew up in 3 separate countries. I was born in the{" "}
                  <span className="hover:text-red-300">US</span>, but lived in{" "}
                  <span className="hover:text-green-300">India</span> and{" "}
                  <span className="hover:text-red-600">Singapore</span> for most
                  of my childhood. Having such a diverse upbringing is something
                  that I am immensemly grateful for. During High School in
                  Singapore, I was obsessed with entrepreneurship and building.
                  I co-founded my High School's Entrepreneurship Club, and lead
                  us to winning the JA (Junior Achievement) Company of The Year
                  competition(Most promising category) during my Junior year.
                  This experience was pivotal for me, and got me interested in
                  the technical side of building. I highlight this experience
                  because it was the first time I was able to build something
                  that I was proud of, and it lead me to wanting to major in
                  Computer Science and Business Administration: mixing my
                  passion for entrepreneurship and impact with my interest in
                  the Technical Aspect.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-light text-white mb-4">Focus</h3>
                <p className="text-gray-400 leading-relaxed">
                  I love learning. Outside of internships and classes, I love
                  taking on side projects and learning something new every
                  couple of days. Recently I've been learning about Neural
                  Networks and their implementation with the help of{" "}
                  <Link
                    href="https://youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ&si=HDnjdU1r9EJlTFqt"
                    target="_blank"
                    className="underline hover:text-lime-500"
                  >
                    Andrej Karpathy's playlist.
                  </Link>{" "}
                  I'm also building a side project called{" "}
                  <Link
                    href="https://github.com/naman0r/tandemcode"
                    className="underline hover:text-sky-300"
                    target="_blank"
                  >
                    TandemCode
                  </Link>{" "}
                  to explore how I can build a social platform which further
                  incentivizes with peer-aided tech interview prep. Click{" "}
                  <Link
                    href="/projects/tandemcode"
                    className="underline hover:text-lime-400"
                  >
                    here
                  </Link>{" "}
                  to learn more about the project!
                  <br />
                  <br />I also have completed internships at Startups to explore
                  my passion in the intersection of Tech and Entrepreneurship. I
                  recently interned at{" "}
                  <Link
                    href="https://www.venu3d.com/"
                    className="underline hover:text-lime-400"
                  >
                    Venu AI
                  </Link>
                  , a Y-Combinator backed startup, where I got a lot of agency
                  to build out end-to-end core features!
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 pt-20">
              <div>
                <h3 className="text-xl font-light text-white mb-4">College</h3>
                <p className="text-gray-400 leading-relaxed">
                  I love exploring outside of classrooms. Over the course of my
                  time at Northeastern University, I have been involved with{" "}
                  <Link
                    href="https://www.forgenu.com/home"
                    className="underline hover:text-orange-500"
                  >
                    Forge
                  </Link>
                  , a product development studio, where I worked on 2 projects
                  over the course of 2 semesters that involved mobile app
                  development using React Native. I am also a part of{" "}
                  <Link href="" className="underline hover:text-blue-500">
                    TAMID at Northeastern
                  </Link>
                  , a multi-facited organization where I met some of the best
                  people and also made some cool technical projects as a part of
                  their{" "}
                  <span className="hover:text-blue-400">Tech Consulting</span>{" "}
                  track. Over the past 2 semesters, I have also been involved
                  with{" "}
                  <Link
                    href="https://www.c4cneu.com/"
                    className="underline hover:text-indigo-600"
                  >
                    Code4Community
                  </Link>
                  , a pro-bono software consultancy.Through C4C, I worked on 2
                  projects: an internal recruitment dashboard and a software
                  project for{" "}
                  <Link
                    href="https://826boston.org/"
                    className="hover:text-orange-500 underline"
                  >
                    826 Boston.
                  </Link>{" "}
                  I was also involved in{" "}
                  <Link
                    href="https://oasisneu.com/"
                    className="underline hover:text-yellow-100"
                  >
                    Oasis
                  </Link>{" "}
                  where my friends and I built{" "}
                  <Link
                    href="https://nutrition-oasis.vercel.app"
                    className="underline hover:text-yellow-200"
                  >
                    NUtrition
                  </Link>
                  , a dining hall macroneutrient tracker for Northeastern
                  University students.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-light text-white mb-4">Journey</h3>
                <p className="text-gray-400 leading-relaxed">
                  I haven't been coding since I was six. I picked up a few CS
                  classes in high school, but my 'eureka' moment came during my
                  first semester of college, where I had a project idea that I
                  got obsessed with. Ever since, coding is my creative outlet. I
                  love building cool and impactful software. Take a look at my{" "}
                  <Link href="/projects" className="underline">
                    projects
                  </Link>{" "}
                  to learn more about the problems I've endevoured to solve.
                  <br />
                  <br />
                  Apart from coding, I love hanging out with my friends, going
                  to the gym, and travelling (16 countries and counting!). I
                  have also come to love to cook (havent burned down anything
                  yet). I am also hugely adicted to Clash Royale (message me to
                  play if you think you can beat me). I have also been getting
                  into watching F1 recently.
                </p>
              </div>
            </div>

            <div className="mt-16 pt-16 border-t border-gray-900">
              <p className="text-gray-500 text-sm">
                Would always love to chat! Reach out to me through LinkedIn or
                Email: rusia.n[at]northeastern[dot]edu . Please also check out
                the rest of the pages of my personal website! Although this one
                was text-heavy, the other pages are a lot more engaging and
                grounded in immersion and interactivity.
                <br />
                <br />
                you can view the source code for this website{" "}
                <Link
                  href="https://github.com/naman0r/namanrusia.dev"
                  className="underline"
                >
                  here
                </Link>
                <br />
                <br />
              </p>

              <br />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-gray-600 text-sm">Made with ❤️ by Naman</p>
          <div className="flex space-x-6">
            <Link
              href="https://github.com/naman0r"
              className="text-gray-600 hover:text-lime-400 transition-colors text-sm hover:underline"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/namanrusia/"
              className="text-gray-600 hover:text-rose-400 transition-colors text-sm hover:underline"
            >
              LinkedIn
            </Link>
            <Link
              href="mailto:rusia.n@northreastern.edu"
              className="text-gray-600 hover:text-sky-400 transition-colors text-sm hover:underline"
            >
              Email
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
