"use client";

import { motion } from "framer-motion";
import { LineChart, Headset, Briefcase, Users } from "lucide-react";

export function UseCases() {
  const cases = [
    {
      title: "Sales Training",
      description: "Reps practice pricing objections, discovery calls, and competitive displacement against adaptive AI buyers — before touching a live prospect.",
      roi: "35% Faster Ramp Time",
      icon: <LineChart size={24} className="text-[#8b5a2b]" />,
    },
    {
      title: "Customer Support",
      description: "Agents simulate irate customers and complex escalations to build empathy and de-escalation skills in a safe environment.",
      roi: "50% Drop in Escalations",
      icon: <Headset size={24} className="text-emerald-500" />,
    },
    {
      title: "Leadership Coaching",
      description: "Managers and executives practice difficult performance reviews, crisis briefings, and board presentations with realistic AI personas.",
      roi: "40% Higher Confidence",
      icon: <Briefcase size={24} className="text-blue-500" />,
    },
    {
      title: "Recruitment Training",
      description: "Hiring teams run standardized AI interview simulations to assess candidate communication skills before the final human round.",
      roi: "Save 20+ Hours / Hire",
      icon: <Users size={24} className="text-violet-500" />,
    },
  ];

  return (
    <section className="py-24 bg-[#fdfbf7] relative border-t border-[#e3d5c1]" id="use-cases">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Use Cases</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-[#2c1e16] leading-tight max-w-2xl">
            Built for the conversations that drive revenue.
          </h3>
          <p className="text-[#6e5646] mt-4 max-w-xl">
            One platform. Four high-impact workflows. Each with measurable outcomes your team can track from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((useCase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#fdfbf7] border border-[#d4c3ab] rounded-2xl p-8 hover:border-[#c4b094] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f4ebd8] border border-[#d4c3ab] flex items-center justify-center mb-6">
                {useCase.icon}
              </div>
              <h4 className="text-xl font-bold text-[#2c1e16] mb-3">{useCase.title}</h4>
              <p className="text-sm text-[#6e5646] leading-relaxed mb-6">
                {useCase.description}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4ebd8] border border-[#d4c3ab]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-[#5c4433] uppercase tracking-wider">{useCase.roi}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
