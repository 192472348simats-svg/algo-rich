"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface VisualExplainerProps {
  title: string;
  imageSrc: string;
  caption: string;
  alt: string;
}

/** Display a visual diagram inside a glass card with hover zoom. */
export default function VisualExplainer({
  title,
  imageSrc,
  caption,
  alt,
}: VisualExplainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="my-6 card-glass overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <span className="text-lg">📊</span>
        <span className="text-sm font-semibold text-primary">
          {title}
        </span>
      </div>
      <div className="p-5 flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-xl overflow-hidden rounded-lg"
        >
          <Image
            src={imageSrc}
            alt={alt}
            width={800}
            height={450}
            className="w-full h-auto object-contain"
          />
        </motion.div>
        <p className="mt-3 text-sm text-[var(--gold-light)]/60 text-center leading-relaxed">
          {caption}
        </p>
      </div>
    </motion.div>
  );
}
