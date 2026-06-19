(function () {
  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = next % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-target') || 0));
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function initInlineFilter() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
    forms.forEach(function (form) {
      var input = form.querySelector('[data-filter-input]');
      var list = document.querySelector('[data-filter-list]');
      if (!input || !list) {
        return;
      }
      function applyFilter() {
        var keyword = input.value.trim().toLowerCase();
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.textContent
          ].join(' ').toLowerCase();
          card.style.display = text.indexOf(keyword) >= 0 ? '' : 'none';
        });
      }
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        applyFilter();
      });
      input.addEventListener('input', applyFilter);
    });
  }

  function initPlayer() {
    var video = document.getElementById('videoPlayer');
    var button = document.querySelector('[data-play-button]');
    if (!video) {
      return;
    }
    var src = video.getAttribute('data-src') || '';
    var prepared = false;
    function prepare() {
      if (prepared || !src) {
        return;
      }
      prepared = true;
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      }
    }
    function play() {
      prepare();
      if (button) {
        button.classList.add('is-hidden');
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          if (button) {
            button.classList.remove('is-hidden');
          }
        });
      }
    }
    video.addEventListener('click', prepare, { once: true });
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
    if (button) {
      button.addEventListener('click', play);
    }
  }

  function movieCardHtml(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="movies/' + movie.file + '">',
      '    <img src="./' + movie.cover + '" alt="' + escapeHtml(movie.title) + '封面" loading="lazy" />',
      '    <span class="poster-badge">' + escapeHtml(movie.rating) + '</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '    <h3><a href="movies/' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.one_line || '') + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('
');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function initSearchPage() {
    var form = document.querySelector('[data-site-search]');
    var results = document.querySelector('[data-search-results]');
    var title = document.querySelector('[data-search-title]');
    if (!form || !results) {
      return;
    }
    var input = form.querySelector('input[name="q"]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (input) {
      input.value = initial;
    }
    function render(movies, keyword) {
      var q = keyword.trim().toLowerCase();
      var filtered = q ? movies.filter(function (movie) {
        return [movie.title, movie.region, movie.year, movie.genre, movie.type, (movie.tags || []).join(' '), movie.one_line].join(' ').toLowerCase().indexOf(q) >= 0;
      }) : movies.slice(0, 24);
      if (title) {
        title.textContent = q ? '“' + keyword + '” 的搜索结果：' + filtered.length + ' 部' : '最新推荐';
      }
      results.innerHTML = filtered.slice(0, 120).map(movieCardHtml).join('
') || '<p>没有找到匹配影片，请尝试更短的关键词。</p>';
    }
    fetch('assets/movies.json').then(function (response) {
      return response.json();
    }).then(function (movies) {
      render(movies, initial);
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        render(movies, input ? input.value : '');
      });
      if (input) {
        input.addEventListener('input', function () {
          render(movies, input.value);
        });
      }
    }).catch(function () {
      if (title) {
        title.textContent = '搜索数据暂不可用';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHero();
    initInlineFilter();
    initPlayer();
    initSearchPage();
  });
})();
