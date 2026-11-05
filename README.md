# Tu copy, ¿convierte?

Formulario de captación (v1) para el diagnóstico de copy de Marco Tricot. HTML + CSS + JS sin framework. Las respuestas llegan a Google Sheets mediante Google Apps Script.

Especificación completa: [`tcc-formulario-brief.md`](tcc-formulario-brief.md).

```
index.html          formulario (bienvenida, 6 preguntas, confirmación, lightbox TCC?)
styles.css          estilos
app.js              navegación, validaciones, envío
config.js           SHEETS_ENDPOINT y correo de contacto
favicon.svg         insignia TCC?
apps-script/        Code.gs + guía paso a paso (GUIA.md)
```

## Pendientes

Todo lo que falta definir está marcado con **PENDIENTE** (en el código y visible en pantalla con fondo amarillo). Para listarlos:

```bash
grep -rn "PENDIENTE" --include="*.html" --include="*.css" --include="*.js" --include="*.svg" .
```

## Correr en local

No necesita instalación. Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Abre <http://localhost:8000>.

Con `SHEETS_ENDPOINT` vacío y en `localhost`, el envío se **simula**: muestra la confirmación y deja el JSON en la consola del navegador. Fuera de localhost, sin endpoint, muestra el error de envío.

Para probar UTM: <http://localhost:8000/?utm_source=instagram&utm_medium=post&utm_campaign=lanzamiento>

## Configurar `SHEETS_ENDPOINT`

1. Sigue [`apps-script/GUIA.md`](apps-script/GUIA.md) para crear la planilla, pegar `Code.gs` y publicarlo como aplicación web.
2. Copia la URL que termina en `/exec` y pégala en [`config.js`](config.js):

   ```js
   SHEETS_ENDPOINT: 'https://script.google.com/macros/s/XXXXXXXX/exec',
   ```

3. Haz un envío de prueba y revisa que aparezca la fila.

**Sobre exponer la URL:** cualquier formulario estático deja esta URL visible en el navegador; lo que la protege es la validación y el honeypot del script, no ocultarla. Lo que sí conviene evitar es dejarla en un repo **público**. Este repo es privado. Si algún día se hace público: agrega `config.js` a `.gitignore`, deja un `config.example.js` con el valor vacío y genera `config.js` en el hosting (por ejemplo, con un comando de build en Vercel/Netlify que lo escriba desde una variable de entorno).

## Publicar

Es un sitio estático: se publica la carpeta tal cual (la raíz del repo). `tcc-formulario-brief.md` y `apps-script/` no afectan al sitio, pero si no quieres que queden accesibles por URL, publica solo los archivos del formulario.

**Vercel**
1. vercel.com → *Add New → Project* → importa el repo `tu-copy-convierte`.
2. Framework preset: **Other**. Sin build command. Output directory: raíz (`.`).
3. *Deploy*. Para el dominio: *Settings → Domains*.

**Netlify**
1. app.netlify.com → *Add new site → Import an existing project* → GitHub → el repo.
2. Build command: vacío. Publish directory: `.`
3. *Deploy*. Dominio en *Domain management*.

**GitHub Pages**
Requiere repo público o plan de pago para repos privados. *Settings → Pages → Deploy from a branch → main / (root)*.

Antes de publicar en producción, revisar los PENDIENTE, en especial el aviso de privacidad (ley chilena de protección de datos).
