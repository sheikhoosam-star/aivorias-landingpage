/* AIvorias — shared script */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Loader: eye logo, first page of a visit only */
  var loader = document.getElementById('loader');
  if (loader) {
    var hide = function () {
      loader.classList.add('hide');
      try { sessionStorage.setItem('aiv_seen', '1'); } catch (e) {}
    };
    if (document.readyState === 'complete') { setTimeout(hide, 900); }
    else { window.addEventListener('load', function () { setTimeout(hide, 900); }); }
    setTimeout(hide, 3500); // safety net
  }

  /* Mobile menu */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    var setOpen = function (open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setOpen(false); });
  }

  /* Live call demo (home page only) */
  var call = document.getElementById('call');
  if (call) {
    var wave = call.querySelector('.wave');
    var heights = [38, 62, 84, 48, 72, 30, 58, 92, 44, 68, 36, 80, 54, 26, 64, 88, 42, 70, 34, 76, 50, 60, 28, 66];
    heights.forEach(function (h, i) {
      var b = document.createElement('i');
      b.style.setProperty('--h', h + '%');
      b.style.animationDelay = (i * 0.07) + 's';
      wave.appendChild(b);
    });

    var msgs = Array.prototype.slice.call(call.querySelectorAll('.msg'));
    var chips = Array.prototype.slice.call(call.querySelectorAll('.chip'));
    var timerEl = call.querySelector('.call-timer');
    var replay = call.querySelector('.replay');
    var timers = [];
    var tick = null;

    var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    var fmt = function (s) { return '00:' + (s < 10 ? '0' : '') + s; };

    var reset = function () {
      timers.forEach(clearTimeout); timers = [];
      if (tick) { clearInterval(tick); tick = null; }
      msgs.forEach(function (m) { m.classList.remove('show'); });
      chips.forEach(function (c) { c.classList.remove('show'); });
      call.classList.remove('speaking');
      timerEl.textContent = fmt(0);
    };

    var showAll = function () {
      msgs.forEach(function (m) { m.classList.add('show'); });
      chips.forEach(function (c) { c.classList.add('show'); });
      timerEl.textContent = fmt(38);
    };

    var play = function () {
      reset();
      if (reduce) { showAll(); return; }
      var secs = 0;
      tick = setInterval(function () { secs += 1; timerEl.textContent = fmt(secs); if (secs >= 38) { clearInterval(tick); tick = null; } }, 1000);
      var t = 500;
      msgs.forEach(function (m) {
        (function (el, at) {
          later(function () { el.classList.add('show'); call.classList.add('speaking'); }, at);
          later(function () { call.classList.remove('speaking'); }, at + 1900);
        })(m, t);
        t += 2600;
      });
      chips.forEach(function (c, i) {
        later(function () { c.classList.add('show'); }, t + i * 450);
      });
    };

    var startDelay = (loader && !document.documentElement.classList.contains('no-loader')) ? 1500 : 300;
    setTimeout(play, startDelay);
    if (replay) replay.addEventListener('click', play);
  }

  /* Contact form: opens the visitor's email app with the message ready to send */
  var form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = v('f-name'), biz = v('f-business'), phone = v('f-phone'), industry = v('f-industry'), msg = v('f-message');
      var subject = 'New AIvorias enquiry: ' + (biz || name);
      var body = 'Name: ' + name + '\nBusiness: ' + biz + '\nPhone / WhatsApp: ' + phone +
        '\nIndustry: ' + (industry || 'Not specified') + '\n\nWhat they want to automate:\n' + (msg || '(not provided)');
      var href = 'mailto:mudassir@aivorias.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var done = document.getElementById('form-done');
      var wrap = document.getElementById('form-fields');
      if (wrap) wrap.style.display = 'none';
      if (done) { done.classList.add('show'); var link = done.querySelector('[data-mailto]'); if (link) link.setAttribute('href', href); }
      window.location.href = href;
    });
  }
})();
