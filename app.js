(function () {
  "use strict";

  var nav = document.getElementById("main-nav");
  var toggle = document.querySelector(".nav-toggle");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function animateValue(el, target, duration) {
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = Math.floor(start + (target - start) * eased);
      el.textContent = current.toLocaleString("vi-VN");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statEl = document.querySelector(".stat-num[data-target]");
  if (statEl && "IntersectionObserver" in window) {
    var target = parseInt(statEl.getAttribute("data-target"), 10);
    var done = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !done) {
            done = true;
            animateValue(statEl, target, 1200);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(statEl);
  }

  function updateChiTietTriggersExpanded(isOpen) {
    document.querySelectorAll("a[data-course-tab-index]").forEach(function (a) {
      a.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function setCourseDetailOpen(open, tabIndex) {
    var reveal = document.getElementById("khoa-hoc-chi-tiet");
    var root = document.getElementById("course-detail-tabs");
    if (!reveal || !root) return;
    if (open) {
      reveal.removeAttribute("hidden");
      reveal.setAttribute("aria-hidden", "false");
      if (typeof tabIndex === "number" && typeof root._tabActivate === "function") {
        root._tabActivate(tabIndex);
      }
    } else {
      reveal.setAttribute("hidden", "");
      reveal.setAttribute("aria-hidden", "true");
    }
    updateChiTietTriggersExpanded(!!open);
  }

  function syncCourseDetailFromHash() {
    var h = location.hash;
    if (h === "#chi-tiet-thcs") setCourseDetailOpen(true, 0);
    else if (h === "#chi-tiet-thpt") setCourseDetailOpen(true, 1);
    else setCourseDetailOpen(false);
  }

  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    if (!tabs.length || tabs.length !== panels.length) return;

    function activate(index) {
      var i = Math.max(0, Math.min(index, tabs.length - 1));
      tabs.forEach(function (t, j) {
        var on = j === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
      });
      panels.forEach(function (p, j) {
        if (j === i) p.removeAttribute("hidden");
        else p.setAttribute("hidden", "");
      });
    }

    root._tabActivate = activate;

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        activate(i);
      });
      tab.addEventListener("keydown", function (e) {
        var next = i;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          next = (i + 1) % tabs.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          next = (i - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          e.preventDefault();
          next = 0;
        } else if (e.key === "End") {
          e.preventDefault();
          next = tabs.length - 1;
        } else {
          return;
        }
        tabs[next].focus();
        activate(next);
      });
    });
  });

  document.querySelectorAll("a[data-course-tab-index]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var rootId = a.getAttribute("data-tabs-root");
      var idx = parseInt(a.getAttribute("data-course-tab-index"), 10);
      var root = rootId ? document.getElementById(rootId) : null;
      if (!root || typeof root._tabActivate !== "function" || isNaN(idx)) return;
      e.preventDefault();
      var hash = idx === 1 ? "#chi-tiet-thpt" : "#chi-tiet-thcs";
      if (history.replaceState) {
        history.replaceState(null, "", hash);
      }
      setCourseDetailOpen(true, idx);
      var reveal = document.getElementById("khoa-hoc-chi-tiet");
      if (reveal) {
        reveal.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  syncCourseDetailFromHash();
  window.addEventListener("hashchange", syncCourseDetailFromHash);

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealNodes = document.querySelectorAll("main .hero, main > section, .site-footer");
    revealNodes.forEach(function (el) {
      el.classList.add("reveal-on-scroll");
    });

    var revealIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealIo.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealNodes.forEach(function (el) {
      revealIo.observe(el);
    });
  } else {
    document.querySelectorAll("main .hero, main > section, .site-footer").forEach(function (el) {
      el.classList.add("reveal-on-scroll", "is-revealed");
    });
  }

  function initTestimonialCarousels() {
    var motionReduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll("[data-carousel]").forEach(function (root) {
      var viewport = root.querySelector(".carousel-viewport");
      var track = root.querySelector(".carousel-track");
      var slides = root.querySelectorAll(".carousel-slide");
      var prevBtn = root.querySelector(".carousel-btn--prev");
      var nextBtn = root.querySelector(".carousel-btn--next");
      var dotsWrap = root.querySelector(".carousel-dots");
      if (!viewport || !track || !slides.length || !prevBtn || !nextBtn || !dotsWrap) return;

      var dots = [];
      var labelBase = dotsWrap.getAttribute("aria-label") || "Đánh giá";

      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
        dot.setAttribute("aria-label", labelBase + " — " + (i + 1) + "/" + slides.length);
        dot.addEventListener("click", function () {
          goTo(i);
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });

      function goTo(index) {
        if (index < 0 || index >= slides.length) return;
        var slide = slides[index];
        var target = slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
        var maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        viewport.scrollTo({
          left: Math.max(0, Math.min(target, maxScroll)),
          behavior: motionReduce ? "auto" : "smooth",
        });
        setTimeout(updateUI, motionReduce ? 0 : 320);
      }

      function getClosestIndex() {
        var mid = viewport.scrollLeft + viewport.clientWidth / 2;
        var best = 0;
        var bestDist = Infinity;
        slides.forEach(function (s, i) {
          var c = s.offsetLeft + s.offsetWidth / 2;
          var d = Math.abs(mid - c);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        return best;
      }

      function updateUI() {
        var maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        var idx = maxScroll < 8 ? 0 : getClosestIndex();
        dots.forEach(function (d, i) {
          d.classList.toggle("is-active", i === idx);
          d.setAttribute("aria-selected", i === idx ? "true" : "false");
        });
        prevBtn.disabled = maxScroll < 8 || idx <= 0;
        nextBtn.disabled = maxScroll < 8 || idx >= slides.length - 1;
      }

      prevBtn.addEventListener("click", function () {
        goTo(getClosestIndex() - 1);
      });
      nextBtn.addEventListener("click", function () {
        goTo(getClosestIndex() + 1);
      });

      var scrollT;
      viewport.addEventListener(
        "scroll",
        function () {
          clearTimeout(scrollT);
          scrollT = setTimeout(updateUI, 50);
        },
        { passive: true }
      );

      viewport.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goTo(getClosestIndex() - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goTo(getClosestIndex() + 1);
        }
      });

      window.addEventListener("resize", function () {
        clearTimeout(scrollT);
        scrollT = setTimeout(updateUI, 120);
      });

      updateUI();
    });
  }

  initTestimonialCarousels();
})();
