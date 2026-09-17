// Sebastian Salinas portfolio — Lenis smooth scroll + GSAP ScrollTrigger.
// Libraries load from CDN (see index.html). Everything below degrades
// gracefully: no CDN, no JS, or reduced-motion all show plain content.
(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";
  var lenis = null;

  // ---- Smooth scroll (Lenis) ----
  if (hasLenis && !reduceMotion) {
    try {
      lenis = new Lenis({ lerp: 0.1 });
      if (hasGsap && window.ScrollTrigger) {
        lenis.on("scroll", window.ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        var rafLenis = function (time) { lenis.raf(time); requestAnimationFrame(rafLenis); };
        requestAnimationFrame(rafLenis);
      }
    } catch (err) { lenis = null; }
  }

  // Anchor links: route through Lenis when active, else native jump.
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -64 });
      else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  // Header intensifies after scrolling past the hero top.
  var header = document.getElementById("site-header");
  var onScrollHeader = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  // Scrollspy (works with Lenis: native scroll position still updates).
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navAnchors.forEach(function (x) {
          x.classList.toggle("active", x.getAttribute("href") === id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // ---- Scroll-linked animation (GSAP + ScrollTrigger) ----
  // Wrapped so any failure leaves a plain readable page, never a frozen one.
  if (hasGsap && window.ScrollTrigger && !reduceMotion) {
    try {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    document.documentElement.classList.add("anim");

    // Hero entrance: masked lines rise in stagger.
    gsap.timeline({ defaults: { ease: "power4.out" } })
      .from(".hero .kicker", { y: 18, opacity: 0, duration: 0.7 }, 0.1)
      .from(".hero .line-inner", { yPercent: 112, duration: 1.05, stagger: 0.12 }, 0.2)
      .from(".hero-sub", { y: 24, opacity: 0, duration: 0.8 }, 0.65)
      .from(".hero-actions", { y: 24, opacity: 0, duration: 0.8 }, 0.8)
      .from(".hero-note", { opacity: 0, duration: 0.8 }, 0.95);

    // Hero drifts up gently as you scroll away (transform-only: cheap).
    gsap.to(".hero-title", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // Section kickers + headings slide up on entry.
    gsap.utils.toArray(".section .kicker, .section h2").forEach(function (el) {
      gsap.from(el, {
        y: 34, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    // Cards rise with a slight stagger per group.
    gsap.utils.toArray(".cards, .about-grid, .strip, .contact-grid").forEach(function (group) {
      var items = group.querySelectorAll(".card, .contact-card");
      var targets = items.length ? items : [group];
      gsap.from(targets, {
        y: 44, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: group, start: "top 85%" }
      });
    });

    // Publication rows fade-slide in batches.
    ScrollTrigger.batch(".pub-list li", {
      start: "top 92%",
      onEnter: function (batch) {
        gsap.fromTo(batch, { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.05, overwrite: true });
      }
    });
    gsap.set(".pub-list li", { opacity: 0 });

    // Image parallax: photo drifts slower, card images pan inside frames.
    var parallaxImg = function (img, amount) {
      gsap.fromTo(img, { yPercent: -amount }, {
        yPercent: amount, ease: "none",
        scrollTrigger: { trigger: img.closest("section") || img, start: "top bottom", end: "bottom top", scrub: true }
      });
    };
    var wireParallax = function () {
      document.querySelectorAll(".card-image img, .photo-placeholder img").forEach(function (img) {
        if (img.dataset.parallaxWired) return;
        img.dataset.parallaxWired = "1";
        parallaxImg(img, 7);
      });
      ScrollTrigger.refresh();
    };
    wireParallax();
    // Images swap in below via probe onload, which refreshes ScrollTrigger itself.
    window.__wireParallax = wireParallax;
    } catch (err) { /* fall through to static content */ }
  }

  // Image placeholders: swap in real images once the files exist.
  // Drop assets/photo.jpg, assets/j20.jpg, assets/leishmania.jpg,
  // assets/nasa.jpg into the repo and they appear automatically.
  document.querySelectorAll("[data-src]").forEach(function (slot) {
    var src = slot.getAttribute("data-src");
    var alt = slot.getAttribute("data-alt") || "";
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      slot.appendChild(img);
      slot.querySelectorAll(".placeholder-initials, .placeholder-label").forEach(function (n) {
        n.style.display = "none";
      });
      if (window.ScrollTrigger && window.__wireParallax) window.__wireParallax();
    };
    probe.src = src;
  });
})();
