// Lightweight click-to-zoom lightbox — scoped ONLY to the workshop board
// images (Silent grouping, Speed-to-Verify Matrix, RICE framework, RICE
// scoring sheet). Every other case-study visual is a plain static image.
(function () {
  var ZOOM_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>' +
    '<line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>';
  var CLOSE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  var SELECTOR = '.case-img-row .case-img-col img';

  function init() {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<div class="lightbox-close" role="button" aria-label="Close">' + CLOSE_ICON + '</div>' +
      '<img alt="">';
    document.body.appendChild(overlay);
    var overlayImg = overlay.querySelector('img');
    var closeBtn = overlay.querySelector('.lightbox-close');

    function open(src, alt) {
      overlayImg.src = src;
      overlayImg.alt = alt || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === closeBtn || closeBtn.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    var imgs = document.querySelectorAll(SELECTOR);
    imgs.forEach(function (img) {
      if (img.closest('.zoomable')) return;
      var wrapper = document.createElement('span');
      wrapper.className = 'zoomable';
      wrapper.style.display = 'block';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      var icon = document.createElement('span');
      icon.className = 'zoom-icon';
      icon.innerHTML = ZOOM_ICON;
      wrapper.appendChild(icon);
      wrapper.addEventListener('click', function () {
        open(img.currentSrc || img.src, img.alt);
      });
    });

    document.querySelectorAll('.discovery-visual').forEach(function (box) {
      box.addEventListener('click', function () {
        var active = box.querySelector('.discovery-visual-img.is-active');
        if (active) open(active.currentSrc || active.src, active.alt);
      });
    });

    document.querySelectorAll('.figma-frame').forEach(function (frame) {
      frame.addEventListener('click', function () {
        var img = frame.querySelector('.figma-desktop');
        if (img) open(img.currentSrc || img.src, img.alt);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
