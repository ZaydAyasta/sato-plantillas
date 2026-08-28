# Sato Plantillas — Next.js + Discord webhook

Versión actualizada del portfolio de Sato Plantillas con identidad morada/lavanda, luna violeta y formulario conectado a Discord mediante un webhook privado.

## Ejecutar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Luego abre `http://localhost:3000`.

## Configurar Discord

1. En tu servidor de Discord crea un canal privado, por ejemplo `#solicitudes-comisiones`.
2. Abre **Editar canal > Integraciones > Webhooks > Nuevo webhook**.
3. Copia la URL del webhook y colócala en `.env.local` como `DISCORD_WEBHOOK_URL`.
4. Activa **Developer Mode** en Discord, copia tu User ID y colócalo como `DISCORD_MENTION_USER_ID`.
5. Pon la invitación pública de tu servidor en `NEXT_PUBLIC_DISCORD_INVITE_URL`.
6. Reinicia `npm run dev` después de cambiar variables de entorno.

Ejemplo:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_MENTION_USER_ID=123456789012345678
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/tu-invitacion
COMMISSION_COOLDOWN_MINUTES=10
```

**Nunca pongas `DISCORD_WEBHOOK_URL` en una variable `NEXT_PUBLIC_*`, en componentes del navegador ni en GitHub.** El webhook se usa únicamente dentro de `app/api/commission/route.ts`.

## Qué ocurre al enviar una comisión

El formulario hace `POST /api/commission`. El servidor valida los datos y envía a Discord un mensaje con:

- mención directa a tu usuario;
- nombre/alias;
- username de Discord;
- servidor y temática;
- descripción de la idea;
- proyecto de Sato elegido como referencia o “Desde cero”;
- links de referencia;
- imagen adjunta opcional.

El visitante recibe inmediatamente un estado visible de **“Solicitud enviada”** y un contador. El botón queda bloqueado durante el cooldown para dejar claro que no necesita volver a enviar la misma solicitud.

## Protección anti-spam incluida

Hay varias capas sin servicios externos:

- bloqueo visual y contador en el navegador tras un envío exitoso;
- persistencia del cooldown en `localStorage` incluso si recarga la página;
- rate limit en el servidor por IP y por username de Discord;
- honeypot invisible para bots básicos;
- bloqueo de envíos excesivamente rápidos;
- límites de longitud en los campos;
- validación de tipo y tamaño para archivos.

El cooldown por defecto es de 10 minutos y puede cambiarse con `COMMISSION_COOLDOWN_MINUTES`.

### Nota para producción con mucho tráfico

El rate limiter incluido usa memoria del proceso de Next.js. Es suficiente para desarrollo y despliegues simples, pero en plataformas serverless con varias instancias no es un rate limit global. Para una web pública con bastante tráfico conviene sustituir esa parte por Redis/Upstash y, si aparece spam real, añadir Cloudflare Turnstile. El feedback visual del formulario seguirá funcionando igual.

## Tema morado

La identidad amarilla fue reemplazada por una paleta editorial morada/lavanda manteniendo crema + charcoal para que los banners sigan siendo protagonistas.

Variables principales en `app/globals.css`:

```css
:root {
  --ink: #171416;
  --ink-2: #201a20;
  --brown: #352b34;
  --cream: #f3eadf;
  --cream-2: #e5d9cf;
  --accent: #a477c4;
  --accent-2: #81549f;
  --accent-pale: #d6b7e8;
}
```

El planeta del hero también fue cambiado por una luna lavanda/violeta con órbitas moradas.

## Reemplazar los banners por tus archivos originales

Solo reemplaza los archivos dentro de `public/portfolio/` conservando los mismos nombres:

```text
001-sato.png
002-tou-mei.png
003-mushouko.png
004-kyougen.png
005-maura.png
006-noxx.png
```

No necesitas modificar componentes ni CSS. El layout conserva la proporción natural de las imágenes y no las recolorea.

## Archivos principales modificados

```text
app/api/commission/route.ts   # backend del webhook + anti-spam
app/globals.css               # nueva identidad morada + luna
components/CommissionForm.tsx # envío real + success state + cooldown
components/CommissionCTA.tsx  # invitación a Discord
components/Header.tsx         # acceso a Discord
components/Hero.tsx           # luna violeta
components/Decorations.tsx    # gráfico lunar
.env.example                  # configuración necesaria
```

## Pulido visual final

Esta versión suma un último nivel de acabado sin competir con el portfolio:

- movimiento muy lento de luna, órbitas y estrellas, respetando `prefers-reduced-motion`;
- micro-etiquetas editoriales `PROJECT 00X / VIEW ↗` y marcas de registro al pasar por los banners;
- transición de expansión/revelado en el proyecto seleccionado;
- textura/grain más sutil sobre la interfaz;
- estado de envío `TRANSMISIÓN RECIBIDA / SATO HQ`;
- firma editorial de Sato en el footer;
- integración de los cuatro elementos gráficos extra suministrados en `public/decor/`.

Los extras están ubicados de forma intencional y decorativa:

```text
public/decor/estrella.png  # sticker sutil en el hero
public/decor/espiral.png   # marca decorativa en hero/proyecto destacado
public/decor/discordo.png  # sticker de Discord en el CTA
public/decor/nina.png      # pequeña mascota junto al formulario
```

Si más adelante quieres moverlos, esconder alguno o cambiar su escala, todas sus posiciones están centralizadas en `app/globals.css` mediante las clases `hero-star-sticker`, `hero-spiral-sticker`, `selected-spiral`, `discordo-sticker` y `form-mascot`.
