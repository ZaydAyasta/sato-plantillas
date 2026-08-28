import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";
import { BASE_PATH } from "../lib/basePath";

export function CommissionCTA() {
  const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "#contacto";
  const external = discordInvite.startsWith("http");

  return (
    <section className="commission-cta" id="servicio">
      <div>
        <p className="micro dark-micro">¿TIENES UNA IDEA?</p>
        <h2>Hagamos el banner<br/>de tu servidor.</h2>
        <span className="scribble" aria-hidden="true" />
      </div>
      <div className="cta-copy">
        <p>Cuéntame sobre tu comunidad, temática,<br/>personajes y la idea que tienes en mente.</p>
        <div className="cta-buttons">
          <a className="button" href="#solicitar">Solicitar banner <ArrowUpRight size={16}/></a>
          <a className="button button-dark" href={discordInvite} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}><MessageCircle size={17}/> Hablar por Discord</a>
        </div>
      </div>
      <Sparkles className="paper-star" size={32}/>
      <img className="discordo-sticker" src={`${BASE_PATH}/decor/discordo.png`} alt="" aria-hidden="true" />
    </section>
  );
}
