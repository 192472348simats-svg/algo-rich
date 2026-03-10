"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const CTAFooterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setEmail("");
    setIsLoading(false);

    // Reset message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <>
      {/* CTA Section */}
      <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-transparent to-navy-dark/50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to become a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-gold-light">
                confident programmer?
              </span>
            </h2>

            {/* Subheading */}
            <p className="text-xl text-gray-light mb-12">
              Join thousands of developers building real skills through structured
              learning.
            </p>

            {/* Email Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow px-6 py-3 rounded-lg bg-navy-light/50 border border-gold-primary/30 text-white placeholder-gray-light/60 focus:outline-none focus:border-gold-primary transition-colors duration-300"
              />
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-gold-primary to-gold-light text-navy-dark font-semibold rounded-lg hover:shadow-xl hover:shadow-gold-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Subscribing..." : "Get Started"}
              </motion.button>
            </motion.form>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: isSubmitted ? 1 : 0,
                y: isSubmitted ? 0 : -10,
              }}
              transition={{ duration: 0.3 }}
              className="text-gold-primary font-semibold"
            >
              {isSubmitted && (
                <p>✓ Thanks! Check your email to get started.</p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark/80 backdrop-blur-sm border-t border-gold-primary/20 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-gold-primary mb-2">
                Algo Rich
              </h3>
              <p className="text-gray-light/60 text-sm">
                Master Python & DSA through structured learning.
              </p>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-gold-light font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#curriculum"
                    className="text-gray-light/70 hover:text-gold-primary transition-colors"
                  >
                    Curriculum
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-light/70 hover:text-gold-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-light/70 hover:text-gold-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-gold-light font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-light/70 hover:text-gold-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-light/70 hover:text-gold-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-light/70 hover:text-gold-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-gold-light font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-light/70 hover:text-gold-primary transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-light/70 hover:text-gold-primary transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            className="pt-8 border-t border-gold-primary/10 text-center text-gray-light/50 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p>
              © 2026 Algo Rich. All rights reserved. • Built with passion for
              programmers.
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default CTAFooterSection;
