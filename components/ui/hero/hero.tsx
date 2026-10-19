"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

interface HeroProps {
  title: string;
  subtitle?: string;
  backGroundImage: string;

  //Optional Props
  primaryButton?: {
    text: string;
    href: string;
  };
  secundaryButton?: {
    text: string;
    href: string;
  };
  height?: "small" | "medium" | "large";
  alignment?: "left" | "center" | "right";
}

export default function Hero({
  title,
  subtitle,
  backGroundImage,
  primaryButton,
  secundaryButton,
  height = "medium",
  alignment = "left",
}: HeroProps) {
  const heightClases = {
    small: "py-20",
    medium: "py-32",
    large: "py-48",
  };

  const aligmentClases = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      className={`relative isolate flex flex-col justify-center ${heightClases[height]} px-6 text-white overflow-hidden`}
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <Image
          src={backGroundImage}
          alt={title}
          fill
          priority
          className="object-cover object-center brightness-50 md:object-[65%_center]"
        />
      </motion.div>
      <motion.div
        className={`relative z-10 max-w-4xl mx-auto flex flex-col ${aligmentClases[alignment]}`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={item}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            variants={item}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow"
          >
            {subtitle}
          </motion.p>
        )}
        {(primaryButton || secundaryButton) && (
          <motion.div
            variants={item}
            className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            {primaryButton && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block w-full sm:w-auto"
              >
                <Link
                  href={primaryButton.href}
                  className="inline-block w-full rounded-lg border border-white bg-[#8c1919] px-4 py-3 text-center text-base font-extrabold text-white transition hover:bg-[#fdb400] hover:text-black sm:w-auto sm:px-6 sm:text-lg md:text-xl"
                >
                  {primaryButton.text}
                </Link>
              </motion.span>
            )}
            {secundaryButton && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block w-full sm:w-auto"
              >
                <Link
                  href={secundaryButton.href}
                  className="inline-block w-full rounded-lg border border-white bg-[#8c1919] px-4 py-3 text-center text-base font-extrabold text-white transition hover:bg-[#fdb400] hover:text-black sm:w-auto sm:px-6 sm:text-lg md:text-xl"
                >
                  {secundaryButton.text}
                </Link>
              </motion.span>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
