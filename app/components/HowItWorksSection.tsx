"use client";

import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Learn",
      description:
        "Watch carefully curated lessons that explain concepts from first principles. No fluff, just clarity.",
      icon: "📚",
    },
    {
      number: "02",
      title: "Practice",
      description:
        "Solve progressively challenging problems. Build muscle memory through deliberate practice.",
      icon: "✏️",
    },
    {
      number: "03",
      title: "Master",
      description:
        "Combine knowledge with intuition. Apply patterns to new problems with confidence.",
      icon: "🏆",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="how-it-works"
      className="py-24 px-4 md:px-8 bg-gradient-to-b from-navy-dark/30 to-transparent"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-light">
            A three-step approach to mastery
          </p>
        </motion.div>

        {/* Steps Container */}
        <motion.div
          className="space-y-8 md:space-y-0 md:flex md:flex-col"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative flex flex-col md:flex-row gap-8 items-start md:items-center"
            >
              {/* Left side - Number and Icon */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-6">
                  {/* Number Circle */}
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-primary/30 to-gold-light/10 border-2 border-gold-primary flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" }}
                  >
                    <span className="text-3xl font-bold text-gold-primary">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className="text-5xl hidden md:block"
                    whileHover={{ scale: 1.3, rotate: 15 }}
                  >
                    {step.icon}
                  </motion.div>
                </div>
              </div>

              {/* Right side - Content */}
              <motion.div
                className="flex-grow"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-3xl font-bold text-gold-light mb-3">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-light leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute left-12 top-24 w-0.5 h-24 bg-gradient-to-b from-gold-primary/50 to-transparent"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
