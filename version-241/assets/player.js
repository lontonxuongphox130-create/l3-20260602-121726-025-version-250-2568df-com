(function () {
  function createMessage(container, text) {
    var old = container.querySelector('.player-message');
    if (old) {
      old.remove();
    }
    var message = document.createElement('div');
    message.className = 'player-message';
    message.textContent = text;
    container.appendChild(message);
    window.setTimeout(function () {
      message.remove();
    }, 4200);
  }

  function mount(containerId, source, poster) {
    var container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    var video = container.querySelector('video');
    var overlay = container.querySelector('.play-overlay');
    var hls = null;
    var initialized = false;

    if (!video || !source) {
      return;
    }

    if (poster) {
      video.setAttribute('poster', poster);
    }

    function prepare() {
      if (initialized) {
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              createMessage(container, '播放未能开启，请稍后再试');
            }
          }
        });
        return;
      }

      video.src = source;
    }

    function start() {
      prepare();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
          createMessage(container, '点击播放按钮开始观看');
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
  }

  window.CinemaPlayer = {
    mount: mount
  };
})();
