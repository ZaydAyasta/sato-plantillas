"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle, Orbit, Sparkles, UploadCloud } from "lucide-react";
import type { Project } from "./Portfolio";
import { projects } from "./Portfolio";
import { BASE_PATH } from "../lib/basePath";

const CLIENT_COOLDOWN_MS = 10 * 60 * 1000;
const STORAGE_KEY = "sato:commissionCooldownUntil";

function formatRemaining(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return minutes > 0 ? `${minutes}m ${String(secs).padStart(2, "0")}s` : `${secs}s`;
}

type SubmitState = "idle" | "sending" | "sent" | "error";

export function CommissionForm({ reference, clearReference }: { reference: Project | null; clearReference: () => void }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [referenceId, setReferenceId] = useState(reference?.id ?? "");
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    setReferenceId(reference?.id ?? "");
  }, [reference]);

  useEffect(() => {
    const storedUntil = Number(localStorage.getItem(STORAGE_KEY) || 0);
    if (storedUntil > Date.now()) {
      setCooldownUntil(storedUntil);
    } else if (storedUntil) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!cooldownUntil) {
      setRemaining(0);
      return;
    }

    const tick = () => {
      const next = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) {
        setCooldownUntil(0);
        localStorage.removeItem(STORAGE_KEY);
        if (state === "sent") setState("idle");
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil, state]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending" || remaining > 0) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("startedAt", String(startedAt.current));

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/commission", { method: "POST", body: data });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 429 && result.retryAfterSeconds) {
          const until = Date.now() + Number(result.retryAfterSeconds) * 1000;
          localStorage.setItem(STORAGE_KEY, String(until));
          setCooldownUntil(until);
          setState("sent");
          setMessage(result.message || "Ya recibí una solicitud reciente. No hace falta volver a enviarla.");
          return;
        }
        setState("error");
        setMessage(result.message || "No pude enviar la solicitud. Inténtalo de nuevo.");
        return;
      }

      const now = Date.now();
      const until = now + Number(result.cooldownSeconds || CLIENT_COOLDOWN_MS / 1000) * 1000;
      localStorage.setItem(STORAGE_KEY, String(until));
      setCooldownUntil(until);
      setState("sent");
      setMessage(result.message || "¡Solicitud enviada! Ya llegó a Discord.");
      setFileName("");
      setReferenceId("");
      clearReference();
      form.reset();
      startedAt.current = Date.now();
    } catch {
      setState("error");
      setMessage("No pude conectar con el servidor. Revisa tu conexión e inténtalo otra vez.");
    }
  };

  const disabled = state === "sending" || remaining > 0;

  return (
    <section className="form-section" id="solicitar" aria-labelledby="form-title">
      <div className="form-kicker">VISTA PREVIA / FORMULARIO</div>
      <h2 id="form-title">SOLICITAR BANNER <Sparkles size={20}/></h2>
      <form className="commission-form" onSubmit={submit}>
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">No completar</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="fields">
          <input aria-label="Nombre o alias" name="name" placeholder="Nombre / alias" required maxLength={100} />
          <input aria-label="Discord username" name="discord" placeholder="Discord username" required maxLength={100} />
          <input aria-label="Nombre del servidor" name="server" placeholder="Nombre del servidor" required maxLength={120} />
          <input aria-label="Temática del servidor" name="theme" placeholder="Temática del servidor" maxLength={160} />
          <textarea aria-label="Describe tu idea" name="idea" placeholder="Describe tu idea" required maxLength={3500} />
          <input aria-label="Link de referencias" name="links" placeholder="Link de referencias" maxLength={800} />
          <select aria-label="Trabajo de Sato como referencia" name="reference" value={referenceId} onChange={(e) => setReferenceId(e.target.value)}>
            <option value="">¿Algún trabajo de Sato como referencia?</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
          </select>
          {referenceId && <button className="reference-chip" type="button" onClick={() => { setReferenceId(""); clearReference(); }}>Referencia: {projects.find((p) => p.id === referenceId)?.name ?? reference?.name} ×</button>}
        </div>

        <label className="upload-zone">
          <UploadCloud size={34}/>
          <strong>Personajes o imágenes<br/>de referencia</strong>
          <span>{fileName || "Arrastra o haz clic para subir"}</span>
          <small>PNG, JPG o WEBP · máximo 8 MB</small>
          <input
            type="file"
            name="referenceImage"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size > 8 * 1024 * 1024) {
                e.target.value = "";
                setFileName("");
                setState("error");
                setMessage("La imagen de referencia debe pesar menos de 8 MB.");
                return;
              }
              setFileName(file?.name || "");
              if (state === "error") setState("idle");
            }}
          />
        </label>

        <div className="form-actions">
          <button className="button" type="submit" disabled={disabled}>
            {state === "sending" ? <><LoaderCircle className="spin" size={16}/> Enviando...</> : remaining > 0 ? <>Solicitud enviada <CheckCircle2 size={16}/></> : <>Enviar solicitud <ArrowUpRight size={16}/></>}
          </button>
          <span>
            {remaining > 0
              ? `Ya la recibí. Podrás enviar otra en ${formatRemaining(remaining)}.`
              : "Te responderé lo antes posible por Discord."}
          </span>
        </div>

        {message && (
          <div className={state === "sent" ? "success success-card" : "success error-card"} role="status" aria-live="polite">
            {state === "sent" && (
              <span className="transmission-orbit" aria-hidden="true">
                <Orbit size={22}/>
                <i>✦</i>
              </span>
            )}
            <div>
              {state === "sent" && <small className="transmission-label">TRANSMISIÓN RECIBIDA / SATO HQ</small>}
              <strong>{message}</strong>
              {state === "sent" && <span>No necesitas volver a enviarla: si falta algún dato, te escribiré por Discord.</span>}
            </div>
          </div>
        )}
      </form>
      <img className="form-mascot" src={`${BASE_PATH}/decor/nina.png`} alt="" aria-hidden="true" />
      <span className="form-mascot-note" aria-hidden="true">idea recibida ✦</span>
    </section>
  );
}
