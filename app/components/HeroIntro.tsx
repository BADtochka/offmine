"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroIntro() {
  return (
    <>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-7 text-center"
      >
        <Image
          src="/logo.png"
          alt="OFFmine"
          width={420}
          height={220}
          style={{ width: "auto", height: "auto" }}
          className="mx-auto"
          priority
        />
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="mb-9 text-center leading-8 text-fg"
        style={{ fontSize: "clamp(20px, 4vw, 30px)" }}
      >
        Проект призванный подарить вам контент!
      </motion.h1>
    </>
  );
}
