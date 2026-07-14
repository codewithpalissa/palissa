/* =========================================================
   Palissa Washington — main.js
   Smooth scroll, scroll-triggered reveals, stat counters,
   subtle network background, nav behavior, contact form.
   ========================================================= */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Smooth scroll (Lenis) ---------------- */
  var lenis = null;
  if (!prefersReducedMotion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------------- Nav: scrolled state + mobile toggle ---------------- */
  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.querySelector(".nav-links");

  function onScrollNav() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { navLinks.classList.remove("open"); });
    });
  }

  /* ---------------- Scroll progress bar ---------------- */
  var progressBar = document.getElementById("scrollProgress");
  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------------- Reveal animations ---------------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    var reveals = gsap.utils.toArray(".reveal");
    reveals.forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    /* Hero elements: staggered entrance on load, not scroll */
    var heroReveals = document.querySelectorAll(".hero .reveal");
    gsap.to(heroReveals, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.15,
    });
  } else {
    /* Fallback: just show everything if libraries fail to load */
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
  }

  /* ---------------- Animated stat counters ---------------- */
  var statNumbers = document.querySelectorAll(".stat-number");
  var counted = new WeakSet();

  function animateCounter(el) {
    if (counted.has(el)) return;
    counted.add(el);
    var target = parseFloat(el.getAttribute("data-target"));
    var suffix = el.getAttribute("data-suffix") || "";
    var obj = { val: 0 };
    if (window.gsap) {
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: function () {
          el.textContent = Math.round(obj.val) + suffix;
        },
      });
    } else {
      el.textContent = target + suffix;
    }
  }

  if ("IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) animateCounter(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach(function (el) { statObserver.observe(el); });
  } else {
    statNumbers.forEach(animateCounter);
  }

  /* ---------------- Subtle network canvas (hero background) ---------------- */
  var canvas = document.getElementById("networkCanvas");
  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var hero = document.getElementById("hero");
    var W, H, nodes, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.offsetWidth;
      H = hero.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNodes() {
      var count = Math.max(24, Math.min(60, Math.floor((W * H) / 28000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      var maxDist = 140;

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = "rgba(45, 212, 191, " + (0.16 * (1 - dist / maxDist)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240, 180, 41, 0.5)";
        ctx.fill();
      }

      requestAnimationFrame(step);
    }

    resize();
    makeNodes();
    requestAnimationFrame(step);

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        makeNodes();
      }, 200);
    });
  }

  /* ---------------- Contact form (Web3Forms) ---------------- */
  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var accessKey = form.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
        statusEl.textContent = "Form isn't connected yet — email palissawashington@gmail.com directly for now.";
        statusEl.style.color = "#f0b429";
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      statusEl.textContent = "";

      var formData = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            statusEl.textContent = "Thanks — I'll be in touch soon.";
            statusEl.style.color = "#2dd4bf";
            form.reset();
          } else {
            statusEl.textContent = "Something went wrong. Please email palissawashington@gmail.com directly.";
            statusEl.style.color = "#f0b429";
          }
        })
        .catch(function () {
          statusEl.textContent = "Something went wrong. Please email palissawashington@gmail.com directly.";
          statusEl.style.color = "#f0b429";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
