(function (win, doc) {
  if (!win.addEventListener) return;
  function setFont() {
    var html = document.documentElement;
    var k = 2560;
    html.style.fontSize =
      ((html.clientWidth / k) * 100 > 100
        ? 100
        : (html.clientWidth / k) * 100) + "px";
  }
  setFont();
  setTimeout(function () {
    setFont();
  }, 300);
  doc.addEventListener("DOMContentLoaded", setFont, false);
  win.addEventListener("resize", setFont, false);
  win.addEventListener("load", setFont, false);
})(window, document);
