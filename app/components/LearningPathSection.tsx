"use client";

import { motion } from "framer-motion";

const LearningPathSection = () => {
  const stages = [
    {
      icon: "🐍",
      stage: "Stage 1",
      title: "Python Foundations",
      description: "Master syntax and core concepts. Build confidence with practical exercises.",
      subtitle: "4-5 weeks",
    },
    {
      icon: "📦",
      stage: "Stage 2",
      title: "Data Structures Mastery",
      description: "Deep dive into arrays, lists, trees, graphs, and more. Understand trade-offs.",
      subtitle: "6-8 weeks",
    },
    {
      icon: "⚡",
      stage: "Stage 3",
      title: "Algorithm Patterns",
      description: "Learn common patterns: recursion, sorting, searching, dynamic programming.",
      subtitle: "6-8 weeks",
    },
    {
      icon: "🎯",
      stage: "Stage 4",
      title: "Advanced Problem Solving",
      description: "Tackle complex problems, optimize solutions, and prepare for interviews.",
      subtitle: "4-6 weeks",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="curriculum" className="py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Learning Path
          </h2>
          <p className="text-xl text-gray-light">
            A carefully designed curriculum that builds real skills
          </p>
        </motion.div>

        {/* Progress Timeline */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stages.map((stage, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ translateY: -5 }}
              className="group relative"
            >
              {/* Card */}
              <div className="h-full p-8 rounded-xl bg-gradient-to-br from-navy-light/40 to-navy-dark/40 border border-gold-primary/30 hover:border-gold-primary/60 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className="text-6xl mb-4 block"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    {stage.icon}
                  </motion.div>

                  {/* Stage Badge */}
                  <div className="inline-block px-3 py-1 rounded-full bg-gold-primary/20 border border-gold-primary/50 mb-4">
                    <span className="text-gold-primary text-sm font-semibold">
                      {stage.stage}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gold-light mb-3">
                    {stage.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-light mb-4 leading-relaxed text-sm">
                    {stage.description}
                  </p>

                  {/* Duration */}
                  <p className="text-gold-primary/60 text-sm font-medium">
                    {stage.subtitle}
                  </p>
                </div>

                {/* Connector line (only on non-mobile) */}
                {index < stages.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-0.5 bg-gradient-to-r from-gold-primary/60 to-transparent" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LearningPathSection;
