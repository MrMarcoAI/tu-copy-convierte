# Brief: formulario "Tu copy, ¿convierte?"

Documento para Claude Code. Contiene todo lo necesario para construir la v1 del formulario de captación. Lo marcado como **[PENDIENTE]** lo define Marco antes de publicar.

---

## 1. Contexto

"Tu copy, ¿convierte?" es un servicio de diagnóstico de copy para conversión, a cargo de Marco Tricot (redactor senior, 20 años en copy, storytelling y performance).

La persona deja la URL de su página y el anuncio que lleva tráfico a ella. En 48 horas hábiles recibe por correo un diagnóstico gratuito: 3 fortalezas, 3 problemas priorizados por impacto, coherencia anuncio–landing y un ejemplo de reescritura. Después puede agendar una reunión o contratar uno de tres planes.

**Público:** gerentes y equipos de marketing, equipos de growth y agencias pequeñas que ya invierten en pauta digital (Meta y/o Google). Hablan el idioma del marketing: "copy" y "conversión" se entienden sin explicación.

**Objetivo del formulario:** captar solicitudes calificadas de diagnóstico y guardarlas en Google Sheets.

---

## 2. Alcance v1

**Incluye**
- Pantalla de bienvenida
- 6 preguntas, una por pantalla (estilo Typeform)
- Pantalla de confirmación
- Envío de respuestas a Google Sheets mediante Google Apps Script
- Diseño responsive (mobile primero)

**No incluye (por ahora)**
- Subida de imágenes (la pregunta 2 usa link + texto)
- Ilustraciones personalizadas
- Correo automático de confirmación
- Panel de administración

---

## 3. Reglas de marca y contenido

1. **Regla de la IA (obligatoria):** toda mención a IA va acompañada del criterio humano de Marco. La IA nunca aparece sola ni como protagonista. Fórmula base: *"no juega sola este partido"*.
2. **Nunca decir "sin IA", "no es una máquina" ni equivalentes.** Marco usa IA en el borrador; prometer lo contrario es falso.
3. Español neutro con toques chilenos, tuteo ("tú", "quieres").
4. Tono directo, cercano, poco pretencioso. Sin superlativos vacíos.
5. Signos de apertura en español siempre (¿ ¡).
6. Usar el copy de este documento tal cual. No reescribirlo.

---

## 4. Dirección visual

**Referencia:** imjelly.com (pantallazo del home). Tomar el **espíritu**, no copiar elementos:
- Fondo de color sólido a pantalla completa
- Titulares enormes, gruesos, condensados, en mayúsculas
- Palabras del titular en distintos colores de la paleta
- Ícono/insignia arriba a la derecha

**No copiar** la forma exacta de la insignia de Jelly, sus ilustraciones ni su composición. Debe sentirse propio.

### Tipografía

| Rol | Fuente | Notas |
|---|---|---|
| Titulares, nombre de marca, preguntas | Display condensada y muy gruesa (Google Fonts) | Probar **Anton**, **Big Shoulders Display** (Black) y **Bebas Neue**; mostrar las 3 a Marco para elegir. Mayúsculas. Interlineado apretado (~0.95). |
| Bajadas, textos de ayuda, opciones | **Inter** | Ver nota de tamaño abajo. |
| Inputs | **Inter** | Mínimo 16 px. |

**Tamaños (decidido):** Inter 14 px solo en desktop para textos secundarios. En mobile, mínimo 16 px en bajadas e inputs: con inputs bajo 16 px, Safari en iOS hace zoom automático al enfocar y rompe la experiencia.

### Paleta

| Nombre | Hex | Rol |
|---|---|---|
| Morado noche | `#472D5B` | Fondo principal |
| Malva | `#A969A6` | Palabras del titular **solo en tamaño display** |
| Lila polvo | `#B59BB3` | Textos secundarios grandes, bordes |
| Azul clic | `#63A7CF` | Detalles, foco, ícono de cursor |
| Blanco | `#F9F9F9` | Texto principal, bajadas, inputs |
| Acento CTA **[PENDIENTE]** | propuesta: `#F2D94E` | Botones principales. La paleta actual no tiene un acento fuerte; validar con Marco. |

**Contraste (aproximado, verificar con herramienta):**
- Blanco sobre morado noche: ~11:1. Apto para todo.
- Lila polvo sobre morado noche: ~4,6:1. Apto para texto normal, justo.
- Azul clic sobre morado noche: ~4,4:1. **No usar para texto pequeño.**
- Malva sobre morado noche: ~2,9:1. **Solo display (≥ 32 px).** Si se usa en titulares, considerar aclararlo levemente hasta llegar a 3:1 como mínimo.
- Acento amarillo propuesto sobre morado noche: ~8:1. Texto del botón en morado noche.

### Marca siempre visible: "TU COPY, ¿CONVIERTE?"

- El nombre completo aparece en **todas las pantallas**, arriba a la izquierda, en tipografía display y en colores de la paleta (versión chica).
- En la bienvenida, además, es el titular gigante.
- Así la insignia "TCC?" nunca queda sola: el nombre completo siempre la explica.

### Insignia "TCC?": acceso a "quién está detrás"

- Arriba a la derecha, como la insignia de Jelly, con forma propia. Misma tipografía display.
- **Es un botón:** al hacer clic abre un lightbox con la historia de Marco y su correo (ver sección 5, "Lightbox TCC?").
- Visible en todas las pantallas, incluida la de confirmación.
- **Descubribilidad:** una insignia sola puede pasar como decoración y nadie la toca. Agregar al menos una de estas señales:
  - Tooltip al pasar el mouse: "¿Quién está detrás?"
  - Un único movimiento sutil (por ejemplo, un leve giro) al cargar la bienvenida. Una sola vez, nunca en loop. Respetar `prefers-reduced-motion`.
  - Cursor de mano y estado hover claro.
- `aria-label="Quién está detrás de Tu copy, ¿convierte?"`.
- Usarla también como favicon.
- **[PENDIENTE] Decidir con Marco:** ¿"TCC?" o "¿TCC?"? La marca usa signos de apertura; ser coherente o asumir la excepción a propósito.

### Layout

```
┌──────────────────────────────────────────┐
│ TU COPY, ¿CONVIERTE?              [TCC?] │
│                                          │
│  PREGUNTA EN DISPLAY                     │
│  GIGANTE, MULTICOLOR                     │
│                                          │
│  Texto de ayuda en Inter                 │
│                                          │
│  [ input / opciones como botones ]       │
│                                          │
│  [ OK ]  presiona Enter ↵                │
│                                          │
│ ▓▓▓▓▓▓░░░░░░  3 de 6          [↑] [↓]    │
└──────────────────────────────────────────┘
```

- Alineación a la izquierda, como en la referencia.
- Una sola idea por pantalla. Mucho aire.
- Movimiento: solo transición entre preguntas (deslizar o fundido corto). Respetar `prefers-reduced-motion`.

---

## 5. Pantallas y copy final

### Pantalla 0: bienvenida

**Titular (display, dos colores):**
TU COPY,
¿CONVIERTE?

**Bajada:**
Déjame tu página y el anuncio que lleva a ella. En 48 horas hábiles te digo qué está funcionando, qué te está costando clientes y por dónde partir.

**Qué recibes (gratis):**
- Las 3 fortalezas de tu página
- Los 3 problemas que más te están frenando, ordenados por impacto
- Si tu página cumple lo que promete tu anuncio
- Un ejemplo de reescritura

**Qué no incluye:** la reescritura completa. El diagnóstico te muestra el problema; resolverlo es otra conversación.

**Firma:**
Uso IA para el primer análisis, pero no juega sola este partido: cada diagnóstico pasa por mi criterio y lo firmo yo. Marco Tricot, redactor senior con 20 años en copy, storytelling y performance.

**Cupo:** Reviso **[PENDIENTE: X]** diagnósticos por semana.

**Botón:** `Empezar`

**[PENDIENTE]** Foto de Marco en esta pantalla (la cara le da confianza al servicio). Dejar el espacio preparado.

---

### Pregunta 1 (obligatoria) · texto URL

**Pregunta:** ¿Qué página quieres que revise?
**Ayuda:** La página donde llega la gente desde tus anuncios. Si no tienes una específica, tu home.
**Placeholder:** `https://tuempresa.cl/landing`
**Validación:** URL válida. Aceptar sin `https://` y completarlo automáticamente.
**Error:** Revisa el link: debe ser una dirección web, como tuempresa.cl

---

### Pregunta 2 (obligatoria) · link + texto

**Pregunta:** ¿Qué anuncio lleva gente a esa página?
**Ayuda:** Pega el link del anuncio (por ejemplo, desde la biblioteca de anuncios de Meta) o cuéntame en pocas palabras qué dice. Así reviso si la página cumple lo que promete el anuncio.
**Campos:**
- Link del anuncio (opcional)
- Qué dice el anuncio (opcional)
**Validación:** al menos uno de los dos completo.
**Error:** Pega el link o describe el anuncio para seguir.

---

### Pregunta 3 (obligatoria) · selección única

**Pregunta:** ¿Qué quieres que haga la gente en esa página?
**Opciones (botones, con atajos de teclado A–D):**
- A. Dejar sus datos
- B. Comprar
- C. Agendar o reservar
- D. Otro → abre campo de texto corto

---

### Pregunta 4 (obligatoria) · texto corto

**Pregunta:** ¿A quién le habla tu página?
**Placeholder:** `Ej.: dueñas de clínicas veterinarias en regiones`
**Límite:** 140 caracteres.

---

### Pregunta 5 (obligatoria) · selección única · **filtro**

**Pregunta:** ¿Hoy inviertes en publicidad digital?
**Opciones:**
- A. Sí, en Meta
- B. Sí, en Google
- C. En ambas
- D. Todavía no

**Comportamiento:** todas las respuestas continúan. "Todavía no" **no** bloquea ni cambia el flujo; Marco filtra manualmente desde la planilla.

---

### Pregunta 6 (obligatoria) · tus datos

**Pregunta:** ¿A quién le envío el diagnóstico?
**Campos:**
- Nombre
- Empresa
- Correo (validar formato)

**Botón:** `Quiero mi diagnóstico`
**Línea bajo el botón:** Uso tus datos solo para enviarte el diagnóstico. No los comparto con nadie.
**[PENDIENTE]** Revisar si la ley chilena de protección de datos exige algo más (aviso de privacidad, enlace a política). No avanzar a producción sin esto.

---

### Pantalla final: confirmación

**Titular (display):** LISTO, YA LO TENGO.
**Texto:** Te llega a tu correo en 48 horas hábiles. Si por algún motivo tu página no calza con este diagnóstico, te aviso igual y te explico por qué.

### Lightbox "TCC?": quién está detrás

Se abre al hacer clic en la insignia, desde cualquier pantalla, sin perder las respuestas ya escritas.

**Contenido:**
1. Foto de Marco **[PENDIENTE]**
2. Titular (display): **[PENDIENTE: definir con Marco]**, por ejemplo "QUIÉN ESTÁ DETRÁS".
3. Historia breve (máximo ~120 palabras): quién es y por qué creó esta plataforma.
4. Invitación a escribir para otros proyectos o colaborar.
5. Correo **[PENDIENTE]** como link `mailto:` y botón `Copiar correo` (con confirmación "Copiado").
6. Botón para cerrar.

**Borrador de texto (placeholder; Marco lo reescribe con su voz):**

> Soy Marco Tricot, redactor senior. Llevo 20 años escribiendo copy, contando historias y midiendo si funcionan.
>
> Creé esta plataforma porque veo muchas marcas pagando por clics que su página no convierte. Casi siempre el problema no es el anuncio ni el diseño: es lo que la página dice, o lo que deja de decir.
>
> Uso IA para el primer análisis, pero no juega sola este partido: el criterio y la firma son míos.
>
> ¿Quieres hacer algo más o colaborar? Escríbeme.

**Comportamiento:**
- Desktop: modal centrado sobre el fondo oscurecido. Mobile: hoja a pantalla completa.
- Cierra con `Esc`, clic fuera del modal o botón de cerrar.
- Foco atrapado dentro mientras está abierto; al cerrar, el foco vuelve a la insignia.
- `role="dialog"`, `aria-modal="true"`, título asociado con `aria-labelledby`.
- Bloquear el scroll del fondo mientras está abierto.

### Estado de error de envío

**Texto:** No se pudo enviar. Revisa tu conexión y vuelve a intentarlo.
**Botón:** `Reintentar`
Las respuestas no se pierden: se mantienen en pantalla.

---

## 6. Comportamiento (estilo Typeform)

- Una pregunta por pantalla, con transición entre ellas.
- **Enter** avanza; **Shift+Enter** hace salto de línea en campos de texto largo.
- En preguntas de opción: clic o tecla (A, B, C, D) selecciona y avanza solo tras una pausa breve.
- Botones ↑ / ↓ para volver o avanzar entre preguntas ya respondidas.
- Barra de progreso: "3 de 6".
- Validación al intentar avanzar, no mientras escribe. Mensaje de error bajo el campo.
- Foco automático en el campo de cada pregunta al entrar.
- Respuestas guardadas en estado durante la sesión (si vuelve atrás, sigue lo que escribió).
- Mobile: botón `OK` visible siempre (no depender de Enter). Evitar que el teclado tape el botón.

---

## 7. Datos: Google Sheets vía Apps Script

Marco **no** comparte acceso a su cuenta. El flujo es:

1. Marco crea una planilla en su Google Drive.
2. Claude Code entrega un archivo `Code.gs` (Google Apps Script) y una guía paso a paso para pegarlo en *Extensiones → Apps Script* de esa planilla y publicarlo como aplicación web.
3. Marco obtiene la URL de la aplicación web y la pega en una variable de configuración del formulario (`SHEETS_ENDPOINT`). No dejarla escrita en el código si el repo será público.

### Columnas de la planilla (en este orden)

| Columna | Origen |
|---|---|
| fecha_hora | Generado en el servidor (zona horaria America/Santiago) |
| url_pagina | P1 |
| anuncio_link | P2 |
| anuncio_texto | P2 |
| objetivo | P3 (+ texto si "Otro") |
| publico | P4 |
| inversion_pauta | P5 |
| nombre | P6 |
| empresa | P6 |
| correo | P6 |
| utm_source / utm_medium / utm_campaign | Parámetros de la URL, si existen |
| referrer | `document.referrer` |
| estado | Vacío por defecto (Marco lo usa para su seguimiento) |

**UTM:** se agregan para saber qué post o canal trae cada solicitud. Son baratos de implementar y clave para medir qué funciona.

### Requisitos técnicos

- Antispam: campo trampa (*honeypot*) oculto; si viene lleno, descartar en el servidor.
- Rechazar en el servidor envíos sin correo válido o sin URL.
- Gotcha conocido (verificar): las aplicaciones web de Apps Script no responden bien a las solicitudes de verificación previa (CORS preflight). Enviar el POST con `Content-Type: text/plain` y el cuerpo en JSON, y parsearlo en `doPost(e)`.
- Mostrar la confirmación solo si el envío fue exitoso.

---

## 8. Stack sugerido

- HTML + CSS + JavaScript sin framework. Es un formulario, no necesita más.
- Fuentes desde Google Fonts.
- Hosting estático (Vercel, Netlify o GitHub Pages; Marco decide).
- **[PENDIENTE]** Dominio: verificar disponibilidad en NIC Chile (por ejemplo, `tucopyconvierte.cl`) y la marca en INAPI antes de comprar.

---

## 9. Accesibilidad mínima

- Foco de teclado visible en todo (usar Azul clic como anillo de foco).
- Cada campo con `label` asociado (aunque visualmente la pregunta haga de label).
- Mensajes de error anunciados a lectores de pantalla (`aria-live`).
- Contraste según la sección 4.
- `prefers-reduced-motion`: quitar transiciones.

---

## 10. Criterios de aceptación

- [ ] Se puede completar entero con teclado y entero en mobile.
- [ ] Un envío de prueba aparece como fila nueva en la planilla, con fecha y UTM.
- [ ] Un envío con honeypot lleno no aparece en la planilla.
- [ ] Las validaciones de URL, anuncio y correo funcionan y muestran el mensaje correcto.
- [ ] El copy coincide palabra por palabra con este documento.
- [ ] Ninguna mención a IA aparece sin el criterio humano al lado.
- [ ] Se ve bien en 375 px, 768 px y 1440 px de ancho.
- [ ] "TU COPY, ¿CONVIERTE?" y la insignia "TCC?" se ven en todas las pantallas.
- [ ] El lightbox abre desde cualquier pantalla, cierra con Esc, clic fuera y botón, y no borra respuestas.
- [ ] El botón `Copiar correo` funciona y confirma la acción.

---

## 11. Pendientes de Marco (antes de publicar)

1. Elegir tipografía display entre las 3 opciones.
2. Aprobar o cambiar el acento amarillo para botones.
3. Definir el ícono: "TCC?" o "¿TCC?".
4. Cupo semanal de diagnósticos (X).
5. Foto para la bienvenida y el lightbox.
6. Texto final del lightbox (historia, titular) y correo de contacto.
7. Revisión legal del aviso de privacidad.
8. Dominio y hosting.
