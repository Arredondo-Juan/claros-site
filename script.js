(function () {
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Dentist / patient toggle on the example read ---- */
  var seg = document.querySelector('.stage .seg');
  if (seg) {
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var mode = b.getAttribute('data-mode');
      seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      document.querySelectorAll('.stage [data-doc]').forEach(function (el) { el.textContent = el.getAttribute('data-' + mode); });
    });
  }

  /* ---- Stage follows the step in view ---- */
  var layers = document.querySelectorAll('.layer');
  function show(step) {
    layers.forEach(function (l) { l.classList.toggle('on', l.getAttribute('data-for') === step); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) show(en.target.getAttribute('data-step')); });
    }, { rootMargin: '-58% 0px -38% 0px' });
    document.querySelectorAll('[data-step]').forEach(function (el) { io.observe(el); });
  }

  /* ---- The clear read: tabs ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.idx [role="tab"]'));
  function pick(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      p.hidden = !on;
      if (on) { p.classList.remove('fade'); void p.offsetWidth; p.classList.add('fade'); }
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); pick(n, true); }
    });
  });

  /* ---- Entrances ---- */
  var rises = document.querySelectorAll('.rise');
  if (!reduce && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rises.forEach(function (el, i) { el.style.transitionDelay = ((i % 3) * 70) + 'ms'; ro.observe(el); });
    setTimeout(function () { rises.forEach(function (el) { el.classList.add('in'); }); }, 4000);
  } else {
    rises.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Contact form (Formspree) ---- */
  var form = document.querySelector('form.contact');
  if (form && window.fetch) {
    form.noValidate = true;
    var err = form.querySelector('.err');
    var btn = form.querySelector('button[type="submit"]');
    var thanks = form.parentNode.querySelector('.thanks');
    function fail(msg, field) {
      err.textContent = msg; err.hidden = false;
      if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
    }
    form.addEventListener('input', function (e) {
      if (e.target.hasAttribute('aria-invalid')) e.target.removeAttribute('aria-invalid');
      err.hidden = true;
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      var req = form.querySelectorAll('[required]');
      for (var i = 0; i < req.length; i++) {
        var f = req[i];
        if (!f.value.trim()) { fail('Please add ' + (f.labels && f.labels[0] ? f.labels[0].textContent.toLowerCase() : 'this field') + '.', f); return; }
        if (f.type === 'email' && !f.checkValidity()) { fail('That email address doesn\u2019t look right. Please check it.', f); return; }
      }
      btn.disabled = true; btn.textContent = 'Sending\u2026';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad');
          form.hidden = true; thanks.hidden = false; thanks.focus();
        })
        .catch(function () {
          fail('Something went wrong and it didn\u2019t send. Please try again in a minute.');
          btn.disabled = false; btn.textContent = 'Ask for a spot';
        });
    });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
