/* AIvorias — shared script */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
