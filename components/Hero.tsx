import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { MoonDecoration } from "./Decorations";
import { BASE_PATH } from "@/lib/basePath";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">SATO PLANTILLAS — GRAPHIC DESIGN / DISCORD</p>
        <h1 id="hero-title">Banners para<br/>tu servidor. <Sparkles className="title-spark" aria-hidden="true" /></h1>
        <p className="hero-sub">Diseño banners personalizados para<br className="desktop-break"/> comunidades de Discord.</p>
        <div className="hero-actions">
          <a className="text-link" href="#trabajos">Ver trabajos <ArrowDown size={17}/></a>
          <a className="button" href="#solicitar">Solicitar banner <ArrowUpRight size={17}/></a>
        </div>
        <img className="hero-star-sticker" src={`${BASE_PATH}/decor/estrella.png`} alt="" aria-hidden="true" />
      </div>
      <MoonDecoration />
      <img className="hero-spiral-sticker" src={`${BASE_PATH}/decor/espiral.png`} alt="" aria-hidden="true" />
    </section>
  );
}
