(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  ready(function () {
    var body = document.body;
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
        body.classList.toggle('is-menu-open', panel.classList.contains('is-open'));
      });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var base = form.getAttribute('data-search-base') || 'search.html';
        var query = input ? input.value.trim() : '';
        var joiner = base.indexOf('?') === -1 ? '?' : '&';
        window.location.href = query ? base + joiner + 'q=' + encodeURIComponent(query) : base;
      });
    });

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
      var current = 0;
      var timer = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5600);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          show(index);
          start();
        });
      });

      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      show(0);
      start();
    }

    var filterInput = document.querySelector('[data-card-filter]');
    var cardList = document.querySelector('[data-card-list]');
    var emptyState = document.querySelector('[data-empty-state]');
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip]'));

    if (filterInput && cardList) {
      var cards = Array.prototype.slice.call(cardList.querySelectorAll('[data-card]'));
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q') || '';

      if (initial) {
        filterInput.value = initial;
      }

      function applyFilter(extra) {
        var query = normalize(extra || filterInput.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-year'),
            card.getAttribute('data-type'),
            card.getAttribute('data-tags')
          ].join(' '));
          var match = !query || haystack.indexOf(query) !== -1;
          card.classList.toggle('is-hidden', !match);
          if (match) {
            visible += 1;
          }
        });

        if (emptyState) {
          emptyState.hidden = visible !== 0;
        }
      }

      filterInput.addEventListener('input', function () {
        chips.forEach(function (chip) {
          chip.classList.remove('is-active');
        });
        applyFilter();
      });

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var value = chip.getAttribute('data-filter-chip') || chip.textContent || '';
          filterInput.value = value;
          chips.forEach(function (item) {
            item.classList.toggle('is-active', item === chip);
          });
          applyFilter(value);
        });
      });

      applyFilter();
    }
  });
})();
