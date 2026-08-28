"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Portfolio, Project, projects } from "@/components/Portfolio";
import { SelectedProject } from "@/components/SelectedProject";
import { CommissionCTA } from "@/components/CommissionCTA";
import { CommissionForm } from "@/components/CommissionForm";
import { Footer } from "@/components/Footer";
import { EdgeMarks } from "@/components/Decorations";

function scrollToForm() {
  document.getElementById("solicitar")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [selected, setSelected] = useState<Project>(projects[3]);
  const [reference, setReference] = useState<Project | null>(null);

  const selectProject = (project: Project) => {
    setSelected(project);
    requestAnimationFrame(() => document.getElementById("proyecto")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const requestSimilar = () => {
    setReference(selected);
    requestAnimationFrame(scrollToForm);
  };

  const requestBlank = () => {
    setReference(null);
    requestAnimationFrame(scrollToForm);
  };

  return (
    <main className="site-shell">
      <EdgeMarks />
      <Header />
      <Hero />
      <Portfolio selected={selected} onSelect={selectProject} />
      <SelectedProject project={selected} onSimilar={requestSimilar} onBlank={requestBlank} />
      <CommissionCTA />
      <CommissionForm reference={reference} clearReference={() => setReference(null)} />
      <Footer />
    </main>
  );
}
