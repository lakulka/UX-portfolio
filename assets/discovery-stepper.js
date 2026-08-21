// Interactive discovery-process stepper — click a stage to see its visual,
// mirroring a slide-build effect (each stage swaps the board shown below).
(function () {
  function init() {
    document.querySelectorAll('.discovery-stepper').forEach(function (root) {
      var steps = root.querySelectorAll('.discovery-step');
      var visuals = root.querySelectorAll('.discovery-visual-img');
      var captions = root.querySelectorAll('.discovery-caption [data-step]');

      steps.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var step = btn.getAttribute('data-step');
          steps.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
          visuals.forEach(function (img) {
            img.classList.toggle('is-active', img.getAttribute('data-step') === step);
          });
          captions.forEach(function (c) {
            c.classList.toggle('is-active', c.getAttribute('data-step') === step);
          });
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Mobile accordion variant — one step open at a time, first step open by default.
(function () {
  function initAccordion(root) {
    var items = root.querySelectorAll('.acc-item');

    // Panels animate to their exact measured height. A ResizeObserver on
    // each panel's content re-measures automatically whenever its size
    // actually changes for ANY reason — image finishing loading, fonts
    // settling, or the accordion switching from display:none (desktop) to
    // visible (mobile) when the viewport crosses the breakpoint — so an
    // open panel can never get stuck showing a stale/zero height.
    function closeAll() {
      items.forEach(function (item) {
        item.classList.remove('is-open');
        item.querySelector('.acc-panel').style.maxHeight = '';
        item.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
      });
    }

    function openItem(item) {
      item.classList.add('is-open');
      var panel = item.querySelector('.acc-panel');
      item.querySelector('.acc-trigger').setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }

    items.forEach(function (item) {
      var trigger = item.querySelector('.acc-trigger');
      var panel = item.querySelector('.acc-panel');
      var inner = panel.querySelector('.acc-panel-inner');

      trigger.addEventListener('click', function () {
        var wasOpen = item.classList.contains('is-open');
        closeAll();
        if (!wasOpen) openItem(item);
      });

      if (window.ResizeObserver && inner) {
        new ResizeObserver(function () {
          if (item.classList.contains('is-open')) {
            panel.style.maxHeight = panel.scrollHeight + 'px';
          }
        }).observe(inner);
      }

      if (item.classList.contains('is-open')) {
        openItem(item);
      } else {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function init() {
    document.querySelectorAll('.discovery-accordion').forEach(initAccordion);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
