"use client";

import { motion } from "framer-motion";

const metrics = [
  { value: "35%", label: "Faster Onboarding", desc: "New reps reach quota faster by practicing on AI before live calls." },
  { value: "50%", label: "Fewer Escalations", desc: "Support teams trained on de-escalation simulations resolve more at tier 1." },
  { value: "92%", label: "Training Completion", desc: "Interactive simulations drive far higher completion than passive video courses." },
  { value: "10×", label: "More Practice Reps", desc: "Unlimited AI sessions vs. limited manager roleplay time." },
];

export function Metrics() {
  return (
    <section className="py-24 bg-[#fdfbf7] relative border-t border-[#e3d5c1]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Measurable ROI</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Training that shows up in the numbers.</h3>
          <p className="text-[#6e5646] mt-4 max-w-xl mx-auto">
            Every outcome is tracked. Every improvement is visible. No more guessing whether training worked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl p-8 text-center hover:border-[#c4b094] transition-all"
            >
              <div className="text-5xl font-bold text-[#704823] mb-2">{m.value}</div>
              <div className="text-sm font-semibold text-[#2c1e16] uppercase tracking-wider mb-3">{m.label}</div>
              <p className="text-xs text-[#6e5646] leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
