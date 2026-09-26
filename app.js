// Interactions for the personal site of Han van Hulst.
// Plain JavaScript, no dependencies. The page stays readable without JS.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.querySelector("[data-nav]");
  var parallax = document.querySelector("[data-parallax]");

  /* ------------------------------------------------- sticky nav + parallax */
  var ticking = false;

  var updateScrollState = function () {
    var y = window.scrollY || window.pageYOffset || 0;

    if (nav) nav.classList.toggle("is-scrolled", y > 12);

    if (parallax && !reduceMotion) {
      var shift = Math.min(y, 600) * 0.05;
      parallax.style.setProperty("--parallax", shift.toFixed(2) + "px");
    }

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    },
    { passive: true }
  );

  updateScrollState();

  /* --------------------------------------------------------- scroll reveal */
  var revealables = document.querySelectorAll(".reveal");

  var settle = function (el, delay) {
    window.setTimeout(function () {
      el.classList.remove("reveal", "is-visible");
      el.style.transitionDelay = "";
    }, 1000 + delay);
  };

  var reveal = function (el, delay) {
    if (delay) el.style.transitionDelay = delay + "ms";
    el.classList.add("is-visible");
    settle(el, delay || 0);
  };

  var revealAll = function () {
    revealables.forEach(function (el) {
      if (!el.classList.contains("is-visible")) reveal(el, 0);
    });
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry, index) {
          if (!entry.isIntersecting) return;
          reveal(entry.target, Math.min(index * 70, 280));
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Safety net: content must never stay hidden.
    window.setTimeout(revealAll, 3000);
  }

  /* --------------------------------------------- highlight current section */
  var navLinks = document.querySelectorAll("[data-nav-link]");

  if (navLinks.length && "IntersectionObserver" in window) {
    var setActive = function (id) {
      navLinks.forEach(function (link) {
        var isActive = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    document.querySelectorAll("section[id]").forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ----------------------------------------------------- image fallbacks */
  document.querySelectorAll(".media").forEach(function (media) {
    var img = media.querySelector("img[data-fallback]");
    if (!img) return;

    var showFallback = function () {
      media.classList.add("is-empty");
    };

    var usePhoto = function () {
      media.classList.remove("is-empty");
      media.classList.add("is-loaded");
    };

    img.addEventListener("load", usePhoto);
    img.addEventListener("error", showFallback);

    if (img.complete) {
      if (img.naturalWidth === 0) {
        showFallback();
      } else {
        usePhoto();
      }
    }

    // Een eigen foto (assets/portret.jpg) krijgt voorrang op de illustratie:
    // is het bestand er, dan wordt het vanzelf geladen, anders blijft de
    // placeholder staan. Bestaat ook die niet, dan volgt de initiaal-fallback.
    var photo = img.getAttribute("data-photo");
    if (photo) {
      var probe = new Image();
      probe.addEventListener("load", function () {
        img.removeAttribute("data-fallback");
        img.addEventListener("error", showFallback);
        img.src = photo;
        usePhoto();
      });
      probe.src = photo;
    }
  });

  /* -------------------------------------------------------- footer year */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
