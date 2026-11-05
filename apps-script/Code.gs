/**
 * Tu copy, ¿convierte? — receptor de solicitudes (Google Apps Script)
 *
 * Se pega en: planilla → Extensiones → Apps Script. Ver GUIA.md.
 * El formulario envía un POST con Content-Type text/plain y cuerpo JSON
 * (evita el preflight CORS, que las apps web de Apps Script no responden).
 */

var SHEET_NAME = 'Solicitudes';
var TIMEZONE = 'America/Santiago';

var COLUMNS = [
  'fecha_hora',
  'url_pagina',
  'anuncio_link',
  'anuncio_texto',
  'objetivo',
  'publico',
  'inversion_pauta',
  'nombre',
  'empresa',
  'correo',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'referrer',
  'estado'
];

var MAX_LEN = 2000; // corta textos absurdamente largos

function doPost(e) {
  var data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'json_invalido' });
  }

  // Honeypot: si viene lleno, es un bot. Se responde ok para no darle pistas, pero NO se guarda.
  if (clean_(data.website)) {
    return json_({ ok: true });
  }

  // Validaciones mínimas en servidor
  var correo = clean_(data.correo);
  var url = clean_(data.url_pagina);
  if (!isEmail_(correo)) return json_({ ok: false, error: 'correo_invalido' });
  if (!isUrl_(url)) return json_({ ok: false, error: 'url_invalida' });

  var row = COLUMNS.map(function (col) {
    if (col === 'fecha_hora') return Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    if (col === 'estado') return '';
    return safe_(clean_(data[col]));
  });

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    getSheet_().appendRow(row);
  } catch (err) {
    return json_({ ok: false, error: 'no_se_pudo_guardar' });
  } finally {
    lock.releaseLock();
  }

  return json_({ ok: true });
}

// Permite comprobar en el navegador que la app web está publicada.
function doGet() {
  return json_({ ok: true, servicio: 'Tu copy, ¿convierte?' });
}

// ---------- Utilidades ----------

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

function clean_(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim().slice(0, MAX_LEN);
}

// Evita que un texto que parte con = + - @ se interprete como fórmula
function safe_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function isEmail_(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function isUrl_(v) {
  return /^https?:\/\/[^\s.]+(\.[^\s.]+)*\.[^\s.\/:]{2,}(:\d+)?(\/\S*)?$/i.test(v);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Prueba manual desde el editor: selecciona "probarEnvio" y pulsa Ejecutar.
 * Debe aparecer una fila nueva en la hoja "Solicitudes".
 */
function probarEnvio() {
  var res = doPost({ postData: { contents: JSON.stringify({
    url_pagina: 'https://ejemplo.cl/landing',
    anuncio_link: '',
    anuncio_texto: 'Prueba desde el editor',
    objetivo: 'Comprar',
    publico: 'Prueba',
    inversion_pauta: 'En ambas',
    nombre: 'Prueba',
    empresa: 'Prueba',
    correo: 'prueba@ejemplo.cl',
    utm_source: 'test', utm_medium: 'test', utm_campaign: 'test',
    referrer: '',
    website: ''
  }) } });
  Logger.log(res.getContent());
}
