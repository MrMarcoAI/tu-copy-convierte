/* Tu copy, ¿convierte? — lógica del formulario v1 (sin framework) */
(function () {
  'use strict';

  var CONFIG = window.TCC_CONFIG || {};
  var TOTAL = 6;
  var LAST_Q = 6;
  var DONE = 7;
  var AUTO_ADVANCE_MS = 450;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var form = $('#form');
  var screens = $$('.screen');
  var progress = $('#progress');
  var progressFill = $('#progress-fill');
  var progressLabel = $('#progress-label');
  var btnPrev = $('[data-action="prev"]');
  var btnFwd = $('[data-action="fwd"]');
  var badge = $('#badge');
  var lightbox = $('#lightbox');
  var infoBox = $('#info');

  var state = {
    step: 0,
    maxReached: 0,
    sending: false,
    answers: { objetivo: '', inversion_pauta: '' }
  };

  // ---------- Mensajes de error ----------
  // Los de P1, P2 y envío vienen del brief. El resto no está definido en el brief.
  // PENDIENTE: validar con Marco el copy de los errores marcados "(no está en el brief)".
  var MSG = {
    url: 'Revisa el link: debe ser una dirección web, como tuempresa.cl',
    anuncio: 'Pega el link o describe el anuncio para seguir.',
    opcion: 'Elige una opción para seguir.',            // (no está en el brief)
    otro: 'Cuéntame qué quieres que haga la gente.',   // (no está en el brief)
    requerido: 'Completa este campo para seguir.',     // (no está en el brief)
    correo: 'Revisa tu correo: debe ser como nombre@empresa.cl' // (no está en el brief)
  };

  // ---------- Utilidades ----------
  function screenAt(i) { return screens[i]; }

  function setError(el, errEl, msg) {
    if (el) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (errEl) errEl.textContent = msg || '';
  }

  function normalizeUrl(raw) {
    var v = (raw || '').trim();
    if (!v || /\s/.test(v)) return null;
    if (!/^https?:\/\//i.test(v)) v = 'https://' + v.replace(/^\/+/, '');
    try {
      var u = new URL(v);
      // dominio con punto y TLD de letras (≥ 2)
      if (!/^[^.]+(\.[^.]+)*\.[a-z¡-￿]{2,}$/i.test(u.hostname)) return null;
      return u.href;
    } catch (e) { return null; }
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || '').trim());
  }

  // ---------- Validación por pregunta (al intentar avanzar) ----------
  function validate(step) {
    var s = screenAt(step);
    switch (step) {
      case 1: {
        var inp = $('#url_pagina');
        var url = normalizeUrl(inp.value);
        if (!url) { setError(inp, $('#q1-error'), MSG.url); return inp; }
        inp.value = url;
        setError(inp, $('#q1-error'), '');
        return null;
      }
      case 2: {
        var link = $('#anuncio_link');
        var texto = $('#anuncio_texto');
        if (!link.value.trim() && !texto.value.trim()) {
          link.setAttribute('aria-invalid', 'true');
          setError(texto, $('#q2-error'), MSG.anuncio);
          return link;
        }
        var nl = normalizeUrl(link.value);
        if (nl) link.value = nl;
        link.setAttribute('aria-invalid', 'false');
        setError(texto, $('#q2-error'), '');
        return null;
      }
      case 3: {
        var err3 = $('#q3-error');
        if (!state.answers.objetivo) { err3.textContent = MSG.opcion; return $('.option', s); }
        if (state.answers.objetivo === 'Otro') {
          var otro = $('#objetivo_otro');
          if (!otro.value.trim()) { setError(otro, err3, MSG.otro); return otro; }
          setError(otro, err3, '');
        }
        err3.textContent = '';
        return null;
      }
      case 4: {
        var pub = $('#publico');
        if (!pub.value.trim()) { setError(pub, $('#q4-error'), MSG.requerido); return pub; }
        setError(pub, $('#q4-error'), '');
        return null;
      }
      case 5: {
        if (!state.answers.inversion_pauta) { $('#q5-error').textContent = MSG.opcion; return $('.option', s); }
        $('#q5-error').textContent = '';
        return null;
      }
      case 6: {
        var first = null;
        ['nombre', 'empresa'].forEach(function (id) {
          var el = $('#' + id);
          var bad = !el.value.trim();
          setError(el, $('#' + id + '-error'), bad ? MSG.requerido : '');
          if (bad && !first) first = el;
        });
        var mail = $('#correo');
        var badMail = !isEmail(mail.value);
        setError(mail, $('#correo-error'), badMail ? MSG.correo : '');
        if (badMail && !first) first = mail;
        return first;
      }
    }
    return null;
  }

  // ---------- Navegación ----------
  function focusStep(step) {
    var s = screenAt(step);
    var target;
    if (step === DONE) target = $('#done-title');
    else if (step === 0) target = $('[data-action="start"]');
    else {
      target = $('.option[aria-checked="true"]', s) ||
               $('.option', s) ||
               $('.input', s);
    }
    if (target) target.focus({ preventScroll: true });
  }

  // Transiciones: entre bienvenida y P1, deslizamiento horizontal;
  // entre preguntas, la anterior se desvanece y la nueva entra en cascada.
  var ANIM_CLASSES = ['is-leaving', 'anim-in-right', 'anim-in-left', 'anim-out-left', 'anim-out-right',
                      'anim-in-up', 'anim-in-down', 'anim-out-up', 'anim-out-down'];
  var CLEANUP_MS = 1600;

  function clearAnim(el) {
    clearTimeout(el._animTimer);
    ANIM_CLASSES.forEach(function (c) { el.classList.remove(c); });
  }

  function goTo(step) {
    if (step < 0 || step > DONE || step === state.step) return;
    var from = screenAt(state.step);
    var to = screenAt(step);
    var dir = step > state.step ? 1 : -1;
    var horizontal = (state.step === 0 && step === 1) || (state.step === 1 && step === 0);

    screens.forEach(function (s) {
      if (s !== from && s !== to) { clearAnim(s); s.hidden = true; s.classList.remove('is-active'); }
    });
    clearAnim(from);
    clearAnim(to);
    window.scrollTo(0, 0);

    from.classList.remove('is-active');
    to.hidden = false;
    to.classList.add('is-active');

    state.step = step;
    if (step <= LAST_Q) state.maxReached = Math.max(state.maxReached, step);
    updateProgress();

    if (reduceMotion) {
      from.hidden = true;
      focusStep(step);
      return;
    }

    void to.offsetWidth; // reinicia animaciones
    from.classList.add('is-leaving', horizontal ? (dir > 0 ? 'anim-out-left' : 'anim-out-right')
                                                : (dir > 0 ? 'anim-out-up' : 'anim-out-down'));
    to.classList.add(horizontal ? (dir > 0 ? 'anim-in-right' : 'anim-in-left')
                                : (dir > 0 ? 'anim-in-up' : 'anim-in-down'));
    focusStep(step);

    from._animTimer = setTimeout(function () { clearAnim(from); from.hidden = true; }, CLEANUP_MS);
    to._animTimer = setTimeout(function () { clearAnim(to); }, CLEANUP_MS);
  }

  function next() {
    if (state.step >= 1 && state.step <= LAST_Q) {
      var invalid = validate(state.step);
      if (invalid) { invalid.focus(); return; }
    }
    if (state.step === LAST_Q) { submit(); return; }
    goTo(state.step + 1);
  }

  function prev() {
    if (state.step >= 1 && state.step <= LAST_Q) goTo(state.step - 1);
  }

  function updateProgress() {
    var q = state.step;
    var visible = q >= 1 && q <= LAST_Q;
    progress.hidden = !visible;
    if (!visible) return;
    progressFill.style.width = (q / TOTAL * 100) + '%';
    progressLabel.textContent = q + ' de ' + TOTAL;
    btnPrev.disabled = false; // en P1, ↑ vuelve a la bienvenida
    btnFwd.disabled = q >= state.maxReached || q >= LAST_Q;
  }

  // ---------- Opciones (P3 y P5) ----------
  var autoTimer = null;

  function selectOption(btn, auto) {
    var group = btn.closest('.options');
    var name = group.getAttribute('data-name');
    $$('.option', group).forEach(function (o) { o.setAttribute('aria-checked', o === btn ? 'true' : 'false'); });
    state.answers[name] = btn.getAttribute('data-value');
    var errEl = group.parentNode.querySelector('.error');
    if (errEl) errEl.textContent = '';

    var isOther = btn.hasAttribute('data-other');
    var otherField = group.parentNode.querySelector('.field--other');
    if (otherField) {
      otherField.hidden = !isOther;
      if (isOther) { $('input', otherField).focus(); return; }
    }

    if (!reduceMotion) { btn.classList.remove('is-pop'); void btn.offsetWidth; btn.classList.add('is-pop'); }
    if (auto) {
      clearTimeout(autoTimer);
      var stepAtClick = state.step;
      autoTimer = setTimeout(function () { if (state.step === stepAtClick) next(); }, AUTO_ADVANCE_MS);
    }
  }

  $$('.option').forEach(function (btn) {
    btn.addEventListener('click', function () { selectOption(btn, true); });
  });

  // Flechas dentro del grupo de opciones (sin seleccionar)
  $$('.options').forEach(function (group) {
    group.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var opts = $$('.option', group);
      var i = opts.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var j = (i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
      opts[j].focus();
    });
  });

  // ---------- Teclado global ----------
  document.addEventListener('keydown', function (e) {
    if (document.querySelector('dialog[open]')) return;
    if (e.isComposing || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target;
    var inText = t.matches && t.matches('input, textarea');

    // Atajos A–D en preguntas de opción (si no se está escribiendo)
    if (!inText && /^[a-dA-D]$/.test(e.key)) {
      var s = screenAt(state.step);
      var opt = $('.option[data-key="' + e.key.toUpperCase() + '"]', s);
      if (opt) { e.preventDefault(); opt.focus(); selectOption(opt, true); }
      return;
    }

    if (e.key === 'Enter') {
      if (t.tagName === 'TEXTAREA' && e.shiftKey) return; // salto de línea
      if (t.tagName === 'BUTTON' || t.tagName === 'A') return; // el botón hace lo suyo
      if (state.step === DONE) return;
      e.preventDefault();
      if (state.step === 0) goTo(1); else next();
    }
  });

  // ---------- Botones ----------
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    switch (el.getAttribute('data-action')) {
      case 'start': goTo(1); break;
      case 'next': next(); break;
      case 'prev': prev(); break;
      case 'fwd':
        if (state.step < state.maxReached) {
          var invalid = validate(state.step);
          if (invalid) invalid.focus(); else goTo(state.step + 1);
        }
        break;
      case 'retry': submit(); break;
      case 'close-lightbox': closeDialog(el.closest('dialog')); break;
      case 'open-info': openDialog(infoBox, el); break;
      case 'start-from-info': closeDialog(infoBox, function () { goTo(1); }); break;
    }
  });

  form.addEventListener('submit', function (e) { e.preventDefault(); next(); });

  // Contador P4
  var publico = $('#publico');
  var countEl = $('[data-count]');
  publico.addEventListener('input', function () { countEl.textContent = publico.value.length; });

  // ---------- Envío a Google Sheets ----------
  function getPayload() {
    var params = new URLSearchParams(location.search);
    var objetivo = state.answers.objetivo;
    if (objetivo === 'Otro') objetivo = 'Otro: ' + $('#objetivo_otro').value.trim();
    return {
      url_pagina: $('#url_pagina').value.trim(),
      anuncio_link: $('#anuncio_link').value.trim(),
      anuncio_texto: $('#anuncio_texto').value.trim(),
      objetivo: objetivo,
      publico: $('#publico').value.trim(),
      inversion_pauta: state.answers.inversion_pauta,
      nombre: $('#nombre').value.trim(),
      empresa: $('#empresa').value.trim(),
      correo: $('#correo').value.trim(),
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      referrer: document.referrer || '',
      website: $('#website').value // honeypot
    };
  }

  function isLocal() {
    return ['localhost', '127.0.0.1', '[::1]', ''].indexOf(location.hostname) !== -1;
  }

  function submit() {
    if (state.sending) return;
    var invalid = validate(LAST_Q);
    if (invalid) { invalid.focus(); return; }

    var btn = $('[data-action="submit"]');
    var errBox = $('#send-error');
    errBox.hidden = true;
    state.sending = true;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');

    var payload = getPayload();
    var endpoint = (CONFIG.SHEETS_ENDPOINT || '').trim();
    var request;

    if (!endpoint && isLocal()) {
      // Modo prueba local: sin endpoint configurado, simula éxito.
      console.warn('[TCC] SHEETS_ENDPOINT vacío: envío simulado (solo en local).', payload);
      request = new Promise(function (res) { setTimeout(function () { res({ ok: true }); }, 500); });
    } else if (!endpoint) {
      request = Promise.reject(new Error('SHEETS_ENDPOINT no configurado'));
    } else {
      // text/plain evita el preflight CORS que Apps Script no responde.
      request = fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
    }

    request.then(function (res) {
      if (!res || res.ok !== true) throw new Error((res && res.error) || 'Respuesta inválida');
      goTo(DONE);
    }).catch(function (err) {
      console.error('[TCC] Error de envío:', err);
      errBox.hidden = false;
      $('button', errBox).focus();
    }).then(function () {
      state.sending = false;
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    });
  }

  // ---------- Lightbox TCC? ----------
  var email = CONFIG.CONTACT_EMAIL || '';
  var mailLink = $('#mail-link');
  mailLink.href = 'mailto:' + email;

  // Dos lightbox: "TCC?" (quién está detrás) y "¿Qué obtienes?"
  function openDialog(dlg, opener) {
    clearTimeout(autoTimer);
    dlg._opener = opener;
    dlg.classList.remove('is-closing');
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    document.body.classList.add('is-locked');
    $('.lightbox__close', dlg).focus();
  }

  // Cierre con animación (salvo prefers-reduced-motion)
  function closeDialog(dlg, after) {
    if (!dlg || !dlg.open || dlg.classList.contains('is-closing')) return;
    dlg._after = after;
    if (reduceMotion) { dlg.close(); return; }
    dlg.classList.add('is-closing');
    setTimeout(function () { dlg.close(); }, 280);
  }

  [lightbox, infoBox].forEach(function (dlg) {
    dlg.addEventListener('close', function () {
      dlg.classList.remove('is-closing');
      document.body.classList.remove('is-locked');
      var after = dlg._after; dlg._after = null;
      if (after) after();
      else if (dlg._opener) dlg._opener.focus();
    });
    // Esc: cerrar con la misma animación
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); closeDialog(dlg); });
    // Clic fuera del contenido (sobre el fondo) cierra
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDialog(dlg); });
    // Foco atrapado (refuerzo sobre el comportamiento nativo de <dialog>)
    dlg.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled]), input, textarea', dlg);
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });

  badge.addEventListener('click', function () { openDialog(lightbox, badge); });

  // ---------- Mobile: que el teclado no tape el botón ----------
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function () {
      var a = document.activeElement;
      if (!a || !a.matches('input, textarea')) return;
      var btn = screenAt(state.step).querySelector('.actions .btn');
      (btn || a).scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // ---------- Inicio ----------
  updateProgress();
})();
