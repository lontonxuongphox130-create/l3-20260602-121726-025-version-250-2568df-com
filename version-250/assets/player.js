(function () {
    function bindVideo(video, overlay, source) {
        var hlsInstance = null;

        function attachSource() {
            if (video.dataset.ready === "1") {
                return;
            }

            video.dataset.ready = "1";

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function playVideo() {
            attachSource();
            if (overlay) {
                overlay.classList.add("hidden");
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove("hidden");
                    }
                });
            }
        }

        if (overlay) {
            overlay.addEventListener("click", playVideo);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("hidden");
            }
        });

        video.addEventListener("pause", function () {
            if (video.currentTime === 0 && overlay) {
                overlay.classList.remove("hidden");
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.SitePlayer = {
        init: function (videoId, overlayId, source) {
            var video = document.getElementById(videoId);
            var overlay = document.getElementById(overlayId);
            if (!video || !source) {
                return;
            }
            bindVideo(video, overlay, source);
        }
    };
})();
