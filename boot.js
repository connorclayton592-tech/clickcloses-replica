(function () {
  var root = document.getElementById("root");
  var cta = document.body.getAttribute("data-cta") || "Apply to Work With Us";
  var files = ["/parts/1.html", "/parts/2.html", "/parts/3.html", "/parts/4.html"];
  Promise.all(files.map(function (url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error(url);
      return res.text();
    });
  })).then(function (chunks) {
    root.innerHTML = chunks.join("").split("__CTA__").join(cta);
    var floatCta = root.querySelector(".float-cta");
    if (floatCta) document.body.appendChild(floatCta);
    bootPage();
  }).catch(function () {
    root.innerHTML = '<p class="wrap" style="padding:2rem 0">The page did not load. <a href="https://calendly.com/d/dv83-gss-33k/assessment-call">' + cta + '</a>.</p>';
  });

  function bootPage() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var reveals = document.querySelectorAll(".reveal");
    var topbar = document.querySelector("[data-topbar]");
    var progress = document.querySelector("[data-progress]");
    var year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
    function markVisible(node) { node.classList.add("is-in"); }
    if (reduced || !("IntersectionObserver" in window)) {
      reveals.forEach(markVisible);
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          markVisible(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (node) { observer.observe(node); });
    }
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (topbar) topbar.classList.toggle("is-scrolled", y > 8);
      if (!progress) return;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = height > 0 ? Math.min(1, Math.max(0, y / height)) : 0;
      progress.style.transform = "scaleX(" + ratio + ")";
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
