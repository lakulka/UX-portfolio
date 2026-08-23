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
  var PLUS_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
  var MINUS_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="5" y1="12" x2="19" y2="12"></line></svg>';
  var SELECTOR = '.case-img-row .case-img-col img';
  var MIN_SCALE = 1;
  var MAX_SCALE = 4;
  var DBLCLICK_SCALE = 2.5;

  function init() {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<div class="lightbox-close" role="button" aria-label="Close">' + CLOSE_ICON + '</div>' +
      '<div class="lightbox-zoom-controls">' +
        '<div class="lightbox-zoom-btn" data-action="out" role="button" aria-label="Zoom out">' + MINUS_ICON + '</div>' +
        '<div class="lightbox-zoom-pct" data-action="reset" role="button" aria-label="Reset zoom">100%</div>' +
        '<div class="lightbox-zoom-btn" data-action="in" role="button" aria-label="Zoom in">' + PLUS_ICON + '</div>' +
      '</div>' +
      '<div class="lightbox-frame"><img alt=""></div>';
    document.body.appendChild(overlay);
    var overlayImg = overlay.querySelector('img');
    var frame = overlay.querySelector('.lightbox-frame');
    var closeBtn = overlay.querySelector('.lightbox-close');
    var zoomControls = overlay.querySelector('.lightbox-zoom-controls');
    var zoomPct = overlay.querySelector('.lightbox-zoom-pct');

    // ---- pan/zoom state ----
    var scale = 1, tx = 0, ty = 0;
    var dragging = false, dragStartX = 0, dragStartY = 0, startTx = 0, startTy = 0;
    var lastTapTime = 0;

    function clampTranslate() {
      var w = overlayImg.offsetWidth * scale;
      var h = overlayImg.offsetHeight * scale;
      var maxX = Math.max(0, (w - frame.clientWidth) / 2);
      var maxY = Math.max(0, (h - frame.clientHeight) / 2);
      tx = Math.min(maxX, Math.max(-maxX, tx));
      ty = Math.min(maxY, Math.max(-maxY, ty));
    }

    function applyTransform(withTransition) {
      overlayImg.classList.toggle('is-panning', !withTransition);
      overlayImg.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
      frame.classList.toggle('is-zoomed', scale > 1);
      zoomControls.classList.toggle('at-min', scale <= MIN_SCALE);
      zoomControls.classList.toggle('at-max', scale >= MAX_SCALE);
      zoomPct.textContent = Math.round(scale * 100) + '%';
    }

    function setScale(next) {
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      if (scale === MIN_SCALE) { tx = 0; ty = 0; }
      clampTranslate();
      applyTransform(true);
    }

    function resetZoom() {
      scale = 1; tx = 0; ty = 0;
      applyTransform(true);
    }

    function open(src, alt) {
      overlayImg.src = src;
      overlayImg.alt = alt || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      resetZoom();
    }
    function close() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      resetZoom();
    }
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === frame || e.target === closeBtn || closeBtn.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === '+' || e.key === '=') setScale(scale + 0.5);
      else if (e.key === '-' || e.key === '_') setScale(scale - 0.5);
      else if (e.key === '0') resetZoom();
    });

    zoomControls.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'in') setScale(scale + 0.75);
      else if (action === 'out') setScale(scale - 0.75);
      else resetZoom();
    });

    // Scroll wheel to zoom, centered roughly on the frame.
    frame.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? -0.4 : 0.4;
      setScale(scale + delta);
    }, { passive: false });

    // Double-click / double-tap to toggle zoom.
    overlayImg.addEventListener('dblclick', function () {
      setScale(scale > 1 ? 1 : DBLCLICK_SCALE);
    });

    // Drag to pan once zoomed in (mouse + touch via Pointer Events).
    overlayImg.addEventListener('pointerdown', function (e) {
      if (scale <= 1) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      startTx = tx;
      startTy = ty;
      overlayImg.setPointerCapture(e.pointerId);
      overlayImg.classList.add('is-grabbing');
    });
    overlayImg.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      tx = startTx + (e.clientX - dragStartX);
      ty = startTy + (e.clientY - dragStartY);
      clampTranslate();
      applyTransform(false);
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      overlayImg.classList.remove('is-grabbing');
      applyTransform(true);
    }
    overlayImg.addEventListener('pointerup', endDrag);
    overlayImg.addEventListener('pointercancel', endDrag);

    // Fallback double-tap detection for touch devices without dblclick support.
    overlayImg.addEventListener('touchend', function () {
      var now = Date.now();
      if (now - lastTapTime < 300) setScale(scale > 1 ? 1 : DBLCLICK_SCALE);
      lastTapTime = now;
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
