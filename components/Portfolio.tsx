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
      "Banner diseñado para el servidor de Sato Plantillas, combinando una estética warm e ilustración temática de Luka (Alien Stage) junto a Pompompurin (Sanrio). Se desarrolló una composición suave en tonos amarillo pastel y café cálido, destacando la información clave de la comunidad: canal de búsqueda, sistema de alianzas (+70 sv) etc.",
  },
  {
    id: "002",
    name: "Mushoku Tensei",
    meta: "Community",
    image: `${BASE_PATH}/portfolio/003-mushouko.png`,
    style: "Soft / Character / Nature",
    description:
      "Banner diseñado a creatividad libre a partir del personaje Sylphiette. Se desarrolló una composición orgánica inspirada en la naturaleza, con tipografía destacada en tonos verdes y crema, dando vida a una estética suave y acogedora para la comunidad.",
  },
  {
    id: "003",
    name: "Kyougen",
    meta: "Anime / Dark",
    image: `${BASE_PATH}/portfolio/004-kyougen.png`,
    style: "Anime / Collage / Dark blue",
    description:
      'Banner diseñado a medida para el servidor temático de Ado. Se desarrolló una composición en estilo Collage / Dark blue con estética rebelde, destacando una tipografía fuerte e irregular para el título principal "Kyougen" y una tipografía más limpia para el texto secundario ("sfw + ntox / ADO, la diosa del J-POP"). El diseño integra de forma protagónica la ilustración de Ado junto a sus referencias más icónicas: su característico personaje (Ha-chan), la rosa azul y detalles estilo sticker que capturan perfectamente la esencia de la artista.',
  },
  {
    id: "004",
    name: "Maura World",
    meta: "Character",
    image: `${BASE_PATH}/portfolio/005-maura.png`,
    style: "Character / Orange / Purple",
    description:
      "Una composición de alto contraste con personaje central, lettering grande y detalles de comunidad.",
  },
  {
    id: "005",
    name: "Noxx's Reef",
    meta: "Aquatic",
    image: `${BASE_PATH}/portfolio/006-noxx.png`,
    style: "Aquatic / Colorful / Character",
    description:
      "Banner diseñado a medida para el servidor de plantillas Noxx's Reef, inspirado en un concepto acuático y fantástico. Se desarrolló una composición en tonos azul y celeste centrada en un arrecife submarino con corales, burbujas y destellos de agua. El diseño cuenta con Jeff the Land Shark como personaje principal, acompañado de pequeños stickers ilustrados a su alrededor.",
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
