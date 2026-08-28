"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { BASE_PATH } from "../lib/basePath";

export type Project = {
  id: string;
  name: string;
  meta: string;
  image: string;
  style: string;
  description: string;
};

export const projects: Project[] = [
  {
    id: "001",
    name: "Sato Plantillas",
    meta: "Anime / Community",
    image: `${BASE_PATH}/portfolio/001-sato.png`,
    style: "Anime / Character / Warm",
    description:
      "Banner editorial y cálido para una comunidad centrada en plantillas y cultura anime.",
  },
  {
    id: "002",
    name: "Tou Mei",
    meta: "Cute / Community",
    image: `${BASE_PATH}/portfolio/002-tou-mei.png`,
    style: "Cute / Playful / Light blue",
    description:
      "Identidad divertida y ligera construida alrededor de una estética azul, personajes y stickers.",
  },
  {
    id: "003",
    name: "Mushouko",
    meta: "Community",
    image: `${BASE_PATH}/portfolio/003-mushouko.png`,
    style: "Soft / Character / Nature",
    description:
      "Composición suave y orgánica con tipografía protagonista y una paleta inspirada en naturaleza.",
  },
  {
    id: "004",
    name: "Kyougen",
    meta: "Anime / Dark",
    image: `${BASE_PATH}/portfolio/004-kyougen.png`,
    style: "Anime / Collage / Dark blue",
    description:
      "Banner personalizado diseñado alrededor de la identidad visual y temática de la comunidad.",
  },
  {
    id: "005",
    name: "Maura World",
    meta: "Character",
    image: `${BASE_PATH}/portfolio/005-maura.png`,
    style: "Character / Orange / Purple",
    description:
      "Una composición de alto contraste con personaje central, lettering grande y detalles de comunidad.",
  },
  {
    id: "006",
    name: "Noxx's Reef",
    meta: "Aquatic",
    image: `${BASE_PATH}/portfolio/006-noxx.png`,
    style: "Aquatic / Colorful / Character",
    description:
      "Banner acuático dinámico, lleno de detalles gráficos y una mascota como punto focal.",
  },
];

export function Portfolio({
  selected,
  onSelect,
}: {
  selected: Project;
  onSelect: (project: Project) => void;
}) {
  return (
    <section
      className="portfolio"
      id="trabajos"
      aria-labelledby="portfolio-title"
    >
      <div className="section-heading">
        <div className="heading-main">
          <span className="registration">⌗</span>
          <h2 id="portfolio-title">TRABAJOS SELECCIONADOS</h2>
          <Sparkles size={22} />
        </div>

        <p>Discord Server Banners / 2026</p>
      </div>

      <div className="portfolio-grid">
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            className={`project-card project-${index + 1} ${
              selected.id === project.id ? "is-selected" : ""
            }`}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="project-image-button"
              onClick={() => onSelect(project)}
              aria-label={`Ver proyecto ${project.name}`}
            >
              <img
                src={project.image}
                alt={`Banner ${project.name}`}
                loading={index < 2 ? "eager" : "lazy"}
              />

              <span className="project-hover-code">
                PROJECT {project.id} / VIEW ↗
              </span>

              <span className="project-register project-register-tl">+</span>
              <span className="project-register project-register-br">+</span>

              <span className="hover-label">
                Ver proyecto <ArrowUpRight size={15} />
              </span>
            </button>

            <div className="project-meta">
              <span>
                <b>{project.id}</b> — {project.name} / {project.meta}
              </span>

              <button onClick={() => onSelect(project)}>
                Ver proyecto <ArrowUpRight size={13} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
