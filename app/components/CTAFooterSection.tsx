// REDESIGNED v2: Navy+gold theme, gold CTA button, clean footer
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CTAFooterSection = () => {
  return (
    <>
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div className="rounded-2xl p-12 text-center" style={{ background: '#0f1629', border: '1px solid #1E3A5F' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-5 h-px" style={{ background: '#E5A829' }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E5A829' }}>Free to start</span>
              <span className="w-5 h-px" style={{ background: '#E5A829' }} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Ready to get rich with algorithms?</h2>
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: '#6b7a99' }}>No credit card. No setup. Sign up and your first lesson is waiting.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <button className="px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90" style={{ background: '#E5A829', color: '#0a0f24' }}>Create free account →</button>
              </Link>
              <Link href="/signin">
                <button className="px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200" style={{ background: 'transparent', color: '#c8d0e0', border: '1px solid #1E3A5F' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5A829'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E3A5F'}>
                  Sign in
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <footer className="px-4 md:px-8 pb-12 pt-8" style={{ borderTop: '1px solid #1E3A5F' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#E5A829' }}>Algo Rich</h3>
              <p className="text-sm" style={{ color: '#6b7a99' }}>Structured DSA learning for CS students.</p>
            </div>
            <div className="flex gap-12">
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
                <ul className="space-y-2 text-sm" style={{ color: '#6b7a99' }}>
                  <li><Link href="#curriculum" className="hover:text-white transition-colors">Curriculum</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
                <ul className="space-y-2 text-sm" style={{ color: '#6b7a99' }}>
                  <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-sm" style={{ color: '#6b7a99', borderTop: '1px solid #1E3A5F', paddingTop: '24px' }}>
            © 2026 Algo Rich. Built for students who want to actually get good.
          </div>
        </div>
      </footer>
    </>
  );
};

export default CTAFooterSection;