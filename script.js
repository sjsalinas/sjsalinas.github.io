// Sebastian Salinas portfolio interactions
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

  // Scrollspy: highlight current section in nav
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Reveal-on-scroll
  var revealTargets = document.querySelectorAll(".card, .strip, .contact-card, .about-grid, .pub-list");
  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      revealer.observe(el);
    });
  }

  // Image placeholders: swap in real images once the folder files exist.
  // Drop files named assets/photo.jpg, assets/j20.jpg, assets/leishmania.jpg,
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
    };
    probe.src = src;
  });
})();
