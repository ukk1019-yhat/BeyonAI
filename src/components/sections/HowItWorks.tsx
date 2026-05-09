"use client";

import { motion } from "framer-motion";
import { ListVideo, UserCircle2, ActivitySquare, TrendingUp } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Choose a Scenario",
      description: "Pick from sales calls, customer support, leadership reviews, or hiring interviews — or build a custom one.",
      icon: <ListVideo size={24} />,
    },
    {
      id: "02",
      title: "Start the AI Conversation",
      description: "The AI persona responds in real time — throwing objections, shifting tone, and reacting to what you say.",
      icon: <UserCircle2 size={24} />,
    },
    {
      id: "03",
      title: "Receive Behavioral Analysis",
      description: "Every response is scored live across clarity, persuasion, objection handling, and emotional control.",
      icon: <ActivitySquare size={24} />,
    },
    {
      id: "04",
      title: "Improve Communication Skills",
      description: "Get a full session breakdown with specific coaching points. Track improvement across every rep over time.",
      icon: <TrendingUp size={24} />,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#fdfbf7] relative border-t border-[#e3d5c1]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">How It Works</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-[#2c1e16]">From scenario to skill improvement in four steps.</h3>
          <p className="text-[#6e5646] mt-4 max-w-xl mx-auto">
            No setup required. Pick a scenario, start talking, and get scored - all in the same session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4c3ab] to-transparent -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative z-10 bg-[#f4ebd8] border border-[#e3d5c1] rounded-2xl p-6 hover:border-[#8b5a2b]/30 hover:bg-[#e8decb]/80 transition-all group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#d4c3ab] flex items-center justify-center text-[#6e5646] group-hover:text-[#8b5a2b] group-hover:border-[#8b5a2b]/50 transition-colors">
                  {step.icon}
                </div>
                <span className="text-4xl font-bold text-[#2c1e16]/8 group-hover:text-[#2c1e16]/15 transition-colors">
                  {step.id}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-[#2c1e16] mb-2">{step.title}</h4>
              <p className="text-sm text-[#6e5646] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
