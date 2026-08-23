document.addEventListener('DOMContentLoaded', function () {
  // Local-only unlock for the NDA-protected Zendesk card. On the deployed
  // site this check fails and the card stays exactly as-is (locked, not
  // clickable). Opened locally (file:// or a local server), it unlocks so
  // the case study can be demoed live without ever being pushed to git.
  var isLocal = window.location.protocol === 'file:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  var lockedCard = document.querySelector('.card.locked[data-local-href]');
  if (isLocal && lockedCard) {
    lockedCard.classList.remove('locked');
    lockedCard.style.cursor = 'pointer';
    lockedCard.addEventListener('click', function (e) {
      if (e.target.closest('.nda-cta')) return;
      window.location.href = lockedCard.getAttribute('data-local-href');
    });
  }

  var header = document.querySelector('.topnav');
  var toggle = document.querySelector('.nav-toggle');
  var nav = header ? header.querySelector('nav') : null;

  // Mobile menu open/close
  if (toggle && nav) {
    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // Sticky header: hide on scroll down, reveal on scroll up
  if (header) {
    var lastY = window.scrollY;
    var hideThreshold = 80;
    var minDelta = 6;
    var ticking = false;

    // Mobile-only: swap the name for the case study title once the hero
    // has scrolled past, so the header stays meaningful while reading.
    var logoEl = header.querySelector('.logo');
    var caseHero = document.querySelector('.cs-hero');
    var caseTitle = document.body.getAttribute('data-case-title');
    var originalLogoText = logoEl ? logoEl.textContent : null;
    var mobileQuery = window.matchMedia('(max-width: 640px)');
    var showingTitle = false;

    function updateLogoTitle() {
      if (!logoEl || !caseHero || !caseTitle) return;

      var shouldShowTitle = mobileQuery.matches &&
        caseHero.getBoundingClientRect().bottom <= 0;

      if (shouldShowTitle === showingTitle) return;
      showingTitle = shouldShowTitle;

      logoEl.textContent = showingTitle ? caseTitle : originalLogoText;
      header.classList.toggle('showing-case-title', showingTitle);
    }

    function onScroll() {
      var currentY = Math.max(window.scrollY, 0);

      updateLogoTitle();

      if (toggle && nav && nav.classList.contains('is-open')) {
        lastY = currentY;
        ticking = false;
        return;
      }

      var delta = currentY - lastY;

      if (currentY <= hideThreshold) {
        header.classList.remove('nav-hidden');
      } else if (delta > minDelta) {
        header.classList.add('nav-hidden');
        lastY = currentY;
      } else if (delta < -minDelta) {
        header.classList.remove('nav-hidden');
        lastY = currentY;
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }
});
