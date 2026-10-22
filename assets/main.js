// STRAM — scripts du site
(function () {
  // Menu mobile
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  // Mode clair / sombre
  var root = document.documentElement;
  var toggles = document.querySelectorAll('.theme-toggle');
  function syncToggle() {
    var dark = root.getAttribute('data-theme') === 'dark';
    toggles.forEach(function (b) {
      b.setAttribute('aria-pressed', dark ? 'true' : 'false');
      b.setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
    });
  }
  toggles.forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('stram-theme', next); } catch (e) {}
      syncToggle();
    });
  });
  syncToggle();

  // Apparition au défilement
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Visionneuse d'images
  var gal = document.querySelectorAll('.gallery button');
  if (gal.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Visionneuse de photos');
    lb.innerHTML = '<img alt=""><button class="lb-btn lb-close" aria-label="Fermer">×</button>' +
      '<button class="lb-btn lb-prev" aria-label="Photo précédente">‹</button>' +
      '<button class="lb-btn lb-next" aria-label="Photo suivante">›</button><div class="lb-count"></div>';
    document.body.appendChild(lb);
    var img = lb.querySelector('img'), count = lb.querySelector('.lb-count'), idx = 0, last = null;
    var items = Array.prototype.map.call(gal, function (b) { var i = b.querySelector('img'); return { src: i.getAttribute('src'), alt: i.getAttribute('alt') }; });
    function show(n) {
      idx = (n + items.length) % items.length;
      img.src = items[idx].src; img.alt = items[idx].alt;
      count.textContent = (idx + 1) + ' / ' + items.length;
    }
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); }
    gal.forEach(function (b, i) {
      b.addEventListener('click', function () { last = b; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // Formulaire de contact : ouvre la messagerie avec la demande pré-remplie
  var form = document.getElementById('contact-form');
  if (form) {
    var params = new URLSearchParams(location.search);
    var sujet = params.get('besoin');
    if (sujet) { var sel = form.querySelector('#besoin'); if (sel) sel.value = sujet; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var f = form.elements;
      var subject = 'Demande de devis — ' + f.besoin.value + (f.societe.value ? ' — ' + f.societe.value : '');
      var body = [
        'Nom : ' + f.nom.value,
        'Entreprise : ' + (f.societe.value || '—'),
        'E-mail : ' + f.email.value,
        'Téléphone : ' + (f.tel.value || '—'),
        'Besoin : ' + f.besoin.value,
        '',
        f.message.value
      ].join('\n');
      window.location.href = 'mailto:stram@orange.fr?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      document.getElementById('form-msg').classList.add('show');
    });
  }

  // Année du copyright
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
