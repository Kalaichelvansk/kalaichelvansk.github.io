/* Kalaichelvan S — Portfolio interactions */
(function () {
  "use strict";

  /* ----- Mobile menu toggle ----- */
  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".mobile-menu-btn");
  if (navbar && toggle) {
    toggle.addEventListener("click", () => {
      const open = navbar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    navbar.querySelectorAll(".nav-link").forEach((a) =>
      a.addEventListener("click", () => navbar.classList.remove("open"))
    );
  }

  /* ----- Scroll reveal ----- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ----- Single-open FAQ (native <details>) ----- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ----- Version tabs (radar page) ----- */
  document.querySelectorAll("[data-tabs]").forEach((group) => {
    const tabs = group.querySelectorAll(".vtab");
    const panels = group.querySelectorAll(".vpanel");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-tab");
        tabs.forEach((t) => t.classList.toggle("active", t === tab));
        panels.forEach((p) =>
          p.classList.toggle("active", p.getAttribute("data-panel") === target)
        );
      });
    });
  });

  /* ----- Animated count-up ----- */
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.getAttribute("data-count"));
          const suffix = el.getAttribute("data-suffix") || "";
          const prefix = el.getAttribute("data-prefix") || "";
          const dur = 1400;
          let start = null;
          const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.textContent =
              prefix + (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io2.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => io2.observe(c));
  }

  /* ----- Contact form (demo submit) ----- */
  const form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      if (status) {
        status.textContent =
          "Thanks for reaching out — I'll get back to you shortly.";
        status.classList.add("show");
      }
      form.reset();
    });
  }

  /* ----- Custom cursor: blue arrow (precise) + black dot (trailing) ----- */
  if (
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.classList.add("has-cursor");
    const arrow = document.createElement("div");
    const dot = document.createElement("div");
    arrow.className = "cur-arrow";
    dot.className = "cur-dot";
    arrow.innerHTML =
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M4 3 L4 19.5 L8.2 15.5 L10.9 21.6 L13.4 20.5 L10.7 14.6 L16 14.6 Z" ' +
      'fill="#1d4ed8" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    document.body.appendChild(arrow);
    document.body.appendChild(dot);

    // arrow tip sits at (4,3) inside the 24x24 svg — offset so the tip is on the pointer
    const TIPX = 4,
      TIPY = 3;
    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2,
      dx = mx,
      dy = my;

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        arrow.style.transform =
          "translate(" + (mx - TIPX) + "px," + (my - TIPY) + "px)";
        arrow.classList.add("on");
        dot.classList.add("on");
      },
      { passive: true }
    );
    document.addEventListener("mouseleave", () => {
      arrow.classList.remove("on");
      dot.classList.remove("on");
    });

    // Enlarge the dot over interactive elements
    const hot = "a, button, .btn, .feature-card, .nav-link, summary, label, select, input, textarea, [role='button'], .shot-zoom, .link-arrow, .code-chip";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest && e.target.closest(hot)) dot.classList.add("grow");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest && e.target.closest(hot)) dot.classList.remove("grow");
    });

    const tick = () => {
      dx += (mx - dx) * 0.16;
      dy += (my - dy) * 0.16;
      dot.style.transform =
        "translate(" + dx + "px," + dy + "px) translate(-50%,-50%)";
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ----- Footer year ----- */
  const yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
