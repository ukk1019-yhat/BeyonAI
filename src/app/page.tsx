import { Hero } from "@/components/sections/Hero";
import { SimulationDemo } from "@/components/sections/SimulationDemo";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { UseCases } from "@/components/sections/UseCases";
import { Comparison } from "@/components/sections/Comparison";
import { AnalyticsDashboard } from "@/components/sections/AnalyticsDashboard";
import { Metrics } from "@/components/sections/Metrics";
import { Architecture } from "@/components/sections/Architecture";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <SimulationDemo />
      <HowItWorks />
      <UseCases />
      <Comparison />
      <AnalyticsDashboard />
      <Metrics />
      <Architecture />
      <FinalCTA />
    </>
  );
}
