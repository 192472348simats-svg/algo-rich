"use client";

import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: "📊",
      title: "Structured Progression",
      description: "Follow a carefully designed step-by-step learning path from basics to advanced topics.",
    },
    {
      icon: "🧠",
      title: "Deep Understanding",
      description: "Learn the why behind concepts, not just the how. True understanding builds forever.",
    },
    {
      icon: "💻",
      title: "Practical Mastery",
      description: "Write real code and solve real problems. Theory alone won't make you confident.",
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-transparent to-navy-dark/30">
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
            Why Choose Algo Rich?
          </h2>
          <p className="text-xl text-gray-light">
            A learning platform designed for serious programmers
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="p-8 rounded-xl bg-gradient-to-br from-navy-light/50 to-navy-dark/50 border border-gold-primary/20 hover:border-gold-primary/50 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Icon */}
              <motion.div
                className="text-5xl mb-6 block"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {feature.icon}
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gold-primary mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
