// Shared countdown ticker for all .countdown elements.
(function () {
  var els = document.querySelectorAll('.countdown');
  if (!els.length) return;
  function pad(n) {
    return String(n).padStart(2, '0');
  }
  function tick() {
    var now = Date.now();
    els.forEach(function (el) {
      var diff = new Date(el.dataset.date).getTime() - now;
      if (diff <= 0) {
        el.textContent = 'TODAY!';
        el.classList.add('countdown--today');
        return;
      }
      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400);
      var h = Math.floor((s % 86400) / 3600);
      var m = Math.floor((s % 3600) / 60);
      var sec = s % 60;
      el.textContent = pad(d) + ' : ' + pad(h) + ' : ' + pad(m) + ' : ' + pad(sec);
    });
  }
  tick();
  setInterval(tick, 1000);
})();
