import { ArrowUpRight, MessageCircle } from "lucide-react";
import { BrandMark } from "./BrandMark";

export function Header() {
  const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "#contacto";
  const external = discordInvite.startsWith("http");

  return (
    <header className="site-header" id="top">
      <BrandMark />
      <nav className="nav" aria-label="Navegación principal">
        <a href="#trabajos">Trabajos</a>
        <a href="#servicio">Sobre el servicio</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <div className="header-actions">
        <a className="discord-mini" href={discordInvite} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} aria-label="Hablar por Discord"><MessageCircle size={18}/></a>
        <a className="button button-small" href="#solicitar">Solicitar banner <ArrowUpRight size={16}/></a>
      </div>
    </header>
  );
}
