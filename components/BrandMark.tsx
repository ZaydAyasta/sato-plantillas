import { Orbit, Sparkles } from "lucide-react";

export function BrandMark() {
  return (
    <a className="brand" href="#top" aria-label="Sato Plantillas, inicio">
      <span className="brand-orbit" aria-hidden="true"><Orbit size={25} strokeWidth={1.7} /></span>
      <span>SATO</span>
      <Sparkles size={16} fill="currentColor" />
      <span>PLANTILLAS</span>
    </a>
  );
}
