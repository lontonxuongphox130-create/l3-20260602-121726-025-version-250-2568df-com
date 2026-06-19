(function(){
function ready(fn){if(document.readyState!=="loading")fn();else document.addEventListener("DOMContentLoaded",fn)}
ready(function(){
var menu=document.querySelector(".menu-btn"),panel=document.querySelector(".mobile-panel");
if(menu&&panel){menu.addEventListener("click",function(){panel.classList.toggle("open")})}
var inputs=document.querySelectorAll("[data-filter-input]");
inputs.forEach(function(input){input.addEventListener("input",function(){var root=document.querySelector(input.getAttribute("data-filter-input"))||document;var q=input.value.trim().toLowerCase();root.querySelectorAll(".movie-card,.rank-item,.compact-list a").forEach(function(card){var s=(card.getAttribute("data-search")||card.textContent||"").toLowerCase();card.classList.toggle("hidden-by-search",q&&s.indexOf(q)===-1)})})});
var slides=[].slice.call(document.querySelectorAll(".hero-slide"));
var dots=[].slice.call(document.querySelectorAll(".hero-dots button"));
if(slides.length>1){var current=0;function show(i){slides[current].classList.remove("active");if(dots[current])dots[current].classList.remove("active");current=(i+slides.length)%slides.length;slides[current].classList.add("active");if(dots[current])dots[current].classList.add("active")}dots.forEach(function(dot,i){dot.addEventListener("click",function(){show(i)})});setInterval(function(){show(current+1)},5200)}
});
})();
function initMoviePlayer(src){
var video=document.getElementById("player-video");
var cover=document.querySelector(".player-cover");
var btn=document.querySelector(".player-start");
var loaded=false;
function load(){
if(!video||loaded)return;loaded=true;
if(video.canPlayType("application/vnd.apple.mpegurl")){video.src=src}else if(typeof Hls!=="undefined"&&Hls.isSupported()){var hls=new Hls();hls.loadSource(src);hls.attachMedia(video)}else{video.src=src}
}
function start(){load();if(cover)cover.classList.add("is-hidden");var p=video.play();if(p&&p.catch)p.catch(function(){})}
if(btn)btn.addEventListener("click",start);
if(cover)cover.addEventListener("click",start);
if(video)video.addEventListener("click",function(){if(video.paused)start()});
}