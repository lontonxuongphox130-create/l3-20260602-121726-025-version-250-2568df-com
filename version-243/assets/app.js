(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        var open = mobileNav.hasAttribute('hidden');
        if (open) {
          mobileNav.removeAttribute('hidden');
          toggle.setAttribute('aria-expanded', 'true');
        } else {
          mobileNav.setAttribute('hidden', '');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var active = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === active);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
    panels.forEach(function (panel) {
      var scope = panel.closest('main') || document;
      var input = panel.querySelector('.filter-input');
      var year = panel.querySelector('.filter-year');
      var region = panel.querySelector('.filter-region');
      var items = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .compact-card, .rank-item'));
      var empty = scope.querySelector('.empty-state');

      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }

      function apply() {
        var text = normalize(input && input.value);
        var y = normalize(year && year.value);
        var r = normalize(region && region.value);
        var visible = 0;

        items.forEach(function (item) {
          var blob = normalize([
            item.dataset.title,
            item.dataset.region,
            item.dataset.year,
            item.dataset.type,
            item.dataset.tags,
            item.textContent
          ].join(' '));
          var okText = !text || blob.indexOf(text) !== -1;
          var okYear = !y || normalize(item.dataset.year) === y;
          var okRegion = !r || normalize(item.dataset.region) === r;
          var ok = okText && okYear && okRegion;
          item.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.style.display = visible ? 'none' : 'block';
        }
      }

      [input, year, region].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && input) {
        input.value = q;
      }
      apply();
    });
  });
})();
