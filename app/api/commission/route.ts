import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const DEFAULT_COOLDOWN_MINUTES = 10;

type RateEntry = { lastSentAt: number };
type GlobalWithRateLimit = typeof globalThis & {
  __satoCommissionRateLimit?: Map<string, RateEntry>;
};

const globalRate = globalThis as GlobalWithRateLimit;
const rateLimit = globalRate.__satoCommissionRateLimit ?? new Map<string, RateEntry>();
globalRate.__satoCommissionRateLimit = rateLimit;

const projectNames: Record<string, string> = {
  "001": "Sato Plantillas",
  "002": "Tou Mei",
  "003": "Mushouko",
  "004": "Kyougen",
  "005": "Maura World",
  "006": "Noxx's Reef",
};

function text(form: FormData, key: string, max = 1000) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function hashKey(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function remainingCooldown(key: string, cooldownMs: number) {
  const entry = rateLimit.get(key);
  if (!entry) return 0;
  return Math.max(0, entry.lastSentAt + cooldownMs - Date.now());
}

function pruneRateLimit(cooldownMs: number) {
  const cutoff = Date.now() - cooldownMs * 2;
  for (const [key, entry] of rateLimit) {
    if (entry.lastSentAt < cutoff) rateLimit.delete(key);
  }
}

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, message: "El formulario todavía no tiene configurado el webhook de Discord." },
      { status: 503 },
    );
  }

  const form = await request.formData();

  // Honeypot: los usuarios reales nunca ven ni llenan este campo.
  if (text(form, "website", 200)) {
    return NextResponse.json({ ok: true, message: "Solicitud recibida." });
  }

  const startedAt = Number(text(form, "startedAt", 30));
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 1800) {
    return NextResponse.json(
      { ok: false, message: "Espera un momento antes de enviar el formulario." },
      { status: 429 },
    );
  }

  const name = text(form, "name", 100);
  const discord = text(form, "discord", 100);
  const server = text(form, "server", 120);
  const theme = text(form, "theme", 160);
  const idea = text(form, "idea", 3500);
  const links = text(form, "links", 800);
  const referenceId = text(form, "reference", 10);
  const reference = referenceId ? `${referenceId} — ${projectNames[referenceId] ?? "Proyecto de Sato"}` : "Desde cero";

  if (!name || !discord || !server || !idea) {
    return NextResponse.json(
      { ok: false, message: "Completa nombre, Discord, servidor y la descripción de tu idea." },
      { status: 400 },
    );
  }

  const cooldownMinutes = Math.max(
    1,
    Number(process.env.COMMISSION_COOLDOWN_MINUTES || DEFAULT_COOLDOWN_MINUTES),
  );
  const cooldownMs = cooldownMinutes * 60 * 1000;
  pruneRateLimit(cooldownMs);

  const ipKey = `ip:${hashKey(getClientIp(request))}`;
  const discordKey = `discord:${hashKey(discord.toLowerCase())}`;
  const retryMs = Math.max(
    remainingCooldown(ipKey, cooldownMs),
    remainingCooldown(discordKey, cooldownMs),
  );

  if (retryMs > 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "Ya recibí una solicitud reciente. No hace falta volver a enviarla.",
        retryAfterSeconds: Math.ceil(retryMs / 1000),
      },
      { status: 429 },
    );
  }

  const upload = form.get("referenceImage");
  let image: File | null = null;
  if (upload instanceof File && upload.size > 0) {
    if (!upload.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, message: "La referencia adjunta debe ser una imagen." },
        { status: 400 },
      );
    }
    if (upload.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { ok: false, message: "La imagen de referencia debe pesar menos de 8 MB." },
        { status: 413 },
      );
    }
    image = upload;
  }

  const mentionUserId = process.env.DISCORD_MENTION_USER_ID?.trim();
  const payload = {
    username: "Sato Plantillas — Comisiones",
    content: mentionUserId
      ? `<@${mentionUserId}> ✦ Nueva solicitud de banner`
      : "✦ Nueva solicitud de banner",
    allowed_mentions: {
      parse: [],
      users: mentionUserId ? [mentionUserId] : [],
    },
    embeds: [
      {
        title: "NUEVA SOLICITUD — SATO PLANTILLAS",
        description: idea,
        color: 0xa477c4,
        fields: [
          { name: "Cliente", value: name, inline: true },
          { name: "Discord", value: discord, inline: true },
          { name: "Servidor", value: server, inline: true },
          { name: "Temática", value: theme || "No especificada", inline: true },
          { name: "Referencia Sato", value: reference, inline: true },
          { name: "Links", value: links || "Sin links", inline: false },
        ],
        footer: { text: "Enviado desde el formulario de Sato Plantillas" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  let discordResponse: Response;

  if (image) {
    const discordForm = new FormData();
    discordForm.append("payload_json", JSON.stringify(payload));
    discordForm.append("files[0]", image, image.name || "referencia.png");
    discordResponse = await fetch(webhookUrl, { method: "POST", body: discordForm });
  } else {
    discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  if (!discordResponse.ok) {
    console.error("Discord webhook error", discordResponse.status, await discordResponse.text());
    return NextResponse.json(
      { ok: false, message: "No pude enviar la solicitud a Discord. Inténtalo de nuevo en un momento." },
      { status: 502 },
    );
  }

  const now = Date.now();
  rateLimit.set(ipKey, { lastSentAt: now });
  rateLimit.set(discordKey, { lastSentAt: now });

  return NextResponse.json({
    ok: true,
    message: "¡Solicitud enviada! Ya llegó al canal privado de Sato en Discord.",
    cooldownSeconds: cooldownMinutes * 60,
  });
}
