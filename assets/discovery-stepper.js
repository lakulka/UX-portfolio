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
