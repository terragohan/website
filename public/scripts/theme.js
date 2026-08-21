// Set the day/dusk/night theme before first paint.
// Loaded synchronously in <head> so there is no theme flash.
(function () {
  var h = new Date().getHours();
  var theme = h < 6 || h >= 20 ? 'night' : h >= 17 ? 'dusk' : 'day';
  document.documentElement.dataset.theme = theme;
})();
