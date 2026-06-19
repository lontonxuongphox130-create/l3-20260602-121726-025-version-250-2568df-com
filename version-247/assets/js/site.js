(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }
        function start() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        show(0);
        start();
    }

    function normalize(value) {
        return (value || "").toString().toLowerCase().trim();
    }

    function initFilters() {
        var areas = Array.prototype.slice.call(document.querySelectorAll("[data-filter-area]"));
        areas.forEach(function (area) {
            var input = area.querySelector("[data-card-search]");
            var sort = area.querySelector("[data-card-sort]");
            var cards = Array.prototype.slice.call(area.querySelectorAll(".movie-card"));
            var grid = area.querySelector(".movie-grid");
            var empty = area.querySelector(".empty-state");
            function apply() {
                var q = normalize(input ? input.value : "");
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.dataset.title,
                        card.dataset.year,
                        card.dataset.genre,
                        card.dataset.region
                    ].join(" "));
                    var matched = !q || haystack.indexOf(q) !== -1;
                    card.style.display = matched ? "" : "none";
                    if (matched) {
                        visible += 1;
                    }
                });
                if (sort && grid) {
                    var shown = cards.filter(function (card) {
                        return card.style.display !== "none";
                    });
                    shown.sort(function (a, b) {
                        if (sort.value === "heat") {
                            return Number(b.dataset.heat || 0) - Number(a.dataset.heat || 0);
                        }
                        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                    });
                    shown.forEach(function (card) {
                        grid.appendChild(card);
                    });
                }
                if (empty) {
                    empty.style.display = visible ? "none" : "block";
                }
            }
            if (input) {
                input.addEventListener("input", apply);
                var params = new URLSearchParams(window.location.search);
                var q = params.get("q");
                if (q) {
                    input.value = q;
                }
            }
            if (sort) {
                sort.addEventListener("change", apply);
            }
            apply();
        });
    }

    function initPlayer() {
        var video = document.querySelector("#moviePlayer");
        if (!video) {
            return;
        }
        var trigger = document.querySelector("[data-play-trigger]");
        var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-video-src]"));
        var currentHls = null;
        function load(src, autoplay) {
            if (!src) {
                return;
            }
            if (currentHls) {
                currentHls.destroy();
                currentHls = null;
            }
            if (window.Hls && window.Hls.isSupported()) {
                currentHls = new window.Hls({ enableWorker: true });
                currentHls.loadSource(src);
                currentHls.attachMedia(video);
                currentHls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    if (autoplay) {
                        video.play().catch(function () {});
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
                if (autoplay) {
                    video.play().catch(function () {});
                }
            } else {
                video.src = src;
                if (autoplay) {
                    video.play().catch(function () {});
                }
            }
            buttons.forEach(function (button) {
                button.classList.toggle("active", button.dataset.videoSrc === src);
            });
        }
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                load(button.dataset.videoSrc, true);
                if (trigger) {
                    trigger.classList.add("hidden");
                }
            });
        });
        if (buttons[0]) {
            load(buttons[0].dataset.videoSrc, false);
        }
        if (trigger) {
            trigger.addEventListener("click", function () {
                var src = buttons[0] ? buttons[0].dataset.videoSrc : video.currentSrc;
                load(src, true);
                trigger.classList.add("hidden");
            });
            video.addEventListener("play", function () {
                trigger.classList.add("hidden");
            });
        }
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayer();
    });
})();
