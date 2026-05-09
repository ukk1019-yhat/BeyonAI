"use client";

import { motion } from "framer-motion";
import { MessageSquare, BarChart2, Settings, Zap } from "lucide-react";

const capabilities = [
  {
    icon: <MessageSquare size={22} className="text-[#8b5a2b]" />,
    title: "Adaptive AI Personas",
    description: "AI buyers, managers, and customers that respond to your tone, word choice, and confidence — not a fixed script.",
  },
  {
    icon: <BarChart2 size={22} className="text-blue-500" />,
    title: "Real-Time Behavioral Scoring",
    description: "Every response is analyzed across clarity, persuasion, objection handling, and emotional control as you speak.",
  },
  {
    icon: <Settings size={22} className="text-emerald-500" />,
    title: "Custom Scenario Builder",
    description: "Upload your own playbooks, product details, and buyer personas to create simulations specific to your team.",
  },
  {
    icon: <Zap size={22} className="text-violet-500" />,
    title: "Session Replay & Coaching",
    description: "After each session, get a full breakdown of what worked, what didn't, and exactly what to improve next time.",
  },
];

export function Metrics() {
  return (
    <section className="py-24 bg-[#fdfbf7] relative border-t border-[#e3d5c1]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Product Features</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Everything your team needs to improve.</h3>
          <p className="text-[#6e5646] mt-4 max-w-xl mx-auto">
            Built specifically for communication training — not a general-purpose chatbot repurposed for roleplay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl p-8 hover:border-[#c4b094] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#d4c3ab] flex items-center justify-center mb-6">
                {c.icon}
              </div>
              <h4 className="text-base font-bold text-[#2c1e16] mb-3">{c.title}</h4>
              <p className="text-sm text-[#6e5646] leading-relaxed">{c.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
