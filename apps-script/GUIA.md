# Guía: conectar el formulario con Google Sheets

Tiempo: ~10 minutos. No necesitas compartir tu cuenta con nadie.

## 1. Crea la planilla

1. Entra a [sheets.new](https://sheets.new) con tu cuenta de Google.
2. Ponle nombre, por ejemplo **Tu copy, ¿convierte? · Solicitudes**.

No hace falta crear columnas: el script crea la hoja **Solicitudes** con los encabezados en el primer envío.

## 2. Pega el script

1. En la planilla: **Extensiones → Apps Script**.
2. Borra lo que aparece en `Código.gs` y pega todo el contenido de [`Code.gs`](Code.gs).
3. Guarda (ícono de disquete o `Cmd/Ctrl + S`).

## 3. Prueba desde el editor (opcional, recomendado)

1. En la barra superior, elige la función **probarEnvio** y pulsa **Ejecutar**.
2. Google pedirá permisos la primera vez: **Revisar permisos** → elige tu cuenta → si aparece "Google no verificó esta app", entra a **Configuración avanzada → Ir a … (no seguro)**. Es tu propio script; solo pide acceso a esta planilla.
3. Vuelve a la planilla: debe haber una hoja **Solicitudes** con una fila de prueba. Bórrala.

## 4. Publica como aplicación web

1. Arriba a la derecha: **Implementar → Nueva implementación**.
2. Ícono de engranaje → **Aplicación web**.
3. Configura:
   - **Descripción:** `v1`
   - **Ejecutar como:** **Yo** (tu cuenta)
   - **Quién tiene acceso:** **Cualquier usuario** (en inglés: *Anyone*). Sin esto el formulario no puede escribir.
4. **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).

Comprobación: abre esa URL en el navegador. Debe mostrar `{"ok":true,"servicio":"Tu copy, ¿convierte?"}`.

## 5. Pégala en el formulario

Abre `config.js` y pega la URL en `SHEETS_ENDPOINT`:

```js
SHEETS_ENDPOINT: 'https://script.google.com/macros/s/XXXXXXXX/exec',
```

Haz un envío de prueba desde el formulario con UTM, por ejemplo:
`https://tu-dominio/?utm_source=instagram&utm_medium=post&utm_campaign=lanzamiento`

Debe aparecer una fila nueva con fecha y UTM.

## Si cambias el script después

Cada cambio en `Code.gs` requiere publicar una versión nueva **sin cambiar la URL**:
**Implementar → Gestionar implementaciones → ✏️ (editar) → Versión: Nueva versión → Implementar**.

Si en cambio haces "Nueva implementación", la URL cambia y tendrás que actualizar `config.js`.

## Qué hace el script

- Guarda cada solicitud como una fila nueva, en este orden: `fecha_hora, url_pagina, anuncio_link, anuncio_texto, objetivo, publico, inversion_pauta, nombre, empresa, correo, utm_source, utm_medium, utm_campaign, referrer, estado`.
- `fecha_hora` se genera en el servidor, zona horaria America/Santiago.
- `estado` queda vacío para tu seguimiento.
- Descarta (sin guardar) los envíos con el campo trampa antispam lleno.
- Rechaza envíos sin correo válido o sin URL válida.
- Textos que parten con `=`, `+`, `-` o `@` se guardan como texto (no como fórmula).

## Problemas comunes

| Síntoma | Causa probable |
|---|---|
| El formulario muestra "No se pudo enviar" y en la consola aparece un error CORS | La app web no está con acceso **Cualquier usuario**, o la URL no termina en `/exec`. |
| Cambié el script y no se nota | Falta publicar **Nueva versión** en la implementación existente. |
| La URL `/exec` pide iniciar sesión | El acceso quedó en "Solo yo" o "Cualquier usuario con cuenta de Google". |
