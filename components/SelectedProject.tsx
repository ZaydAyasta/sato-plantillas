"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "./Portfolio";

export function SelectedProject({ project, onSimilar, onBlank }: { project: Project; onSimilar: () => void; onBlank: () => void }) {
  return (
    <section className="selected-wrap" id="proyecto" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          className="selected-project"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="selected-image">
            <motion.img
              key={project.image}
              src={project.image}
              alt={`Proyecto seleccionado: ${project.name}`}
              initial={{ opacity: 0, scale: 0.975, clipPath: "inset(0 3% 0 3%)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0% 0 0%)" }}
              transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="selected-scanline" aria-hidden="true" />
          </div>
          <div className="selected-info">
            <img className="selected-spiral" src="/decor/espiral.png" alt="" aria-hidden="true" />
            <p className="micro">PROYECTO DESTACADO</p>
            <h2>{project.name.toUpperCase()}</h2>
            <p className="selected-type">Discord Server Banner</p>
            <hr />
            <p><b>Style:</b> {project.style}</p>
            <p className="selected-description">{project.description}</p>
            <button className="button wide" onClick={onSimilar}>Solicitar uno similar <ArrowUpRight size={16}/></button>
            <button className="ghost-link" onClick={onBlank}>Solicitar desde cero</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
