(function () {
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Hero: the screenshot opens, then the send card arrives ---- */
  var shutter = document.querySelector('.shutter');
  var sender = document.querySelector('[data-demo]');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      if (shutter) shutter.classList.add('is-in');
      if (sender) sender.classList.add('is-in');
    });
  });

  /* ---- The live thing: send the example scan ---- */
  if (sender) {
    var btn0 = sender.querySelector('.s-btn');
    var status = sender.querySelector('.s-status');
    var timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, reduce ? Math.min(ms, 400) : ms)); }
    function setState(s) {
      sender.setAttribute('data-state', s);
      status.classList.remove('is-sent', 'is-opened');
      if (s === 'idle') { status.textContent = 'Ready to send'; btn0.textContent = 'Send scan'; btn0.disabled = false; }
      if (s === 'sending') { status.textContent = 'Uploading'; btn0.textContent = 'Sending…'; btn0.disabled = true; }
      if (s === 'sent') { status.textContent = 'Sent'; status.classList.add('is-sent'); }
      if (s === 'opened') { status.textContent = 'Opened in 3D'; status.classList.add('is-opened'); btn0.textContent = 'Send again'; btn0.disabled = false; }
    }
    setState('idle');
    btn0.addEventListener('click', function () {
      timers.forEach(clearTimeout); timers = [];
      if (sender.getAttribute('data-state') === 'opened') { setState('idle'); return; }
      setState('sending');
      later(function () { setState('sent'); }, 1600);
      later(function () { setState('opened'); }, 2900);
    });
  }

  /* ---- The clear read: tabs ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.seg [role="tab"]'));
  function pick(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
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

  /* ---- Pricing: the selected plan's figure ---- */
  var plans = Array.prototype.slice.call(document.querySelectorAll('.plan'));
  plans.forEach(function (p) {
    p.addEventListener('click', function () {
      plans.forEach(function (x) { x.setAttribute('aria-pressed', String(x === p)); });
      document.querySelectorAll('.p-card').forEach(function (c) {
        c.hidden = c.getAttribute('data-for') !== p.getAttribute('data-plan');
      });
    });
  });

  /* ---- Entrances: each section's parts arrive in reading order ---- */
  var rises = document.querySelectorAll('.rise');
  if (!reduce && 'IntersectionObserver' in window) {
    var groups = new Map();
    rises.forEach(function (el) {
      var host = el.closest('section, .field, .mod') || document.body;
      var n = groups.get(host) || 0;
      el.style.transitionDelay = Math.min(n, 6) * 80 + 'ms';
      groups.set(host, n + 1);
    });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rises.forEach(function (el) { ro.observe(el); });
    setTimeout(function () { rises.forEach(function (el) { el.classList.add('in'); }); }, 6000);
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
        if (f.type === 'email' && !f.checkValidity()) { fail('That email address doesn’t look right. Please check it.', f); return; }
      }
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad');
          form.hidden = true; thanks.hidden = false; thanks.focus();
        })
        .catch(function () {
          fail('Something went wrong and it didn’t send. Please try again in a minute.');
          btn.disabled = false; btn.textContent = 'Ask for a spot';
        });
    });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
