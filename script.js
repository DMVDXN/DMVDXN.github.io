// script.js
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const themeBtn = document.getElementById("themeToggle");
  const storageKey = "portfolio-theme";

  function setTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {}
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (e) {
      return null;
    }
  }

  const saved = getSavedTheme();
  if (saved === "light" || saved === "dark") setTheme(saved);
  else setTheme("dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      setTheme(isLight ? "dark" : "light");
    });
  }

  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");

  function setNavOpen(open) {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    primaryNav.classList.toggle("is-open", open);
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!open);
    });

    primaryNav.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") setNavOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (!primaryNav.classList.contains("is-open")) return;
      if (primaryNav.contains(e.target) || navToggle.contains(e.target)) return;
      setNavOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && primaryNav.classList.contains("is-open")) {
        setNavOpen(false);
        navToggle.focus();
      }
    });
  }

  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const projectCards = Array.from(document.querySelectorAll("#projectsGrid .project"));

  function setActiveFilter(filter) {
    filterButtons.forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.filter === filter);
    });

    projectCards.forEach(function (card) {
      const category = card.getAttribute("data-category");
      const show = filter === "all" || category === filter;
      card.style.display = show ? "" : "none";
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setActiveFilter(btn.dataset.filter);
    });
  });

  const modal = document.getElementById("projectModal");
  const modalImage = document.getElementById("modalImage");
  const modalVideo = document.getElementById("modalVideo");
  const modalTitle = document.getElementById("modalTitle");
  const modalTag = document.getElementById("modalTag");
  const modalDesc = document.getElementById("modalDesc");
  const modalBullets = document.getElementById("modalBullets");
  const modalRepo = document.getElementById("modalRepo");
  const modalDemo = document.getElementById("modalDemo");

  let lastFocused = null;

  function openModalFromCard(card) {
    if (!modal) return;

    lastFocused = document.activeElement;

    const title = card.getAttribute("data-title") || "Project";
    const tag = card.getAttribute("data-tag") || "";
    const img = card.getAttribute("data-image") || "";
    const desc = card.getAttribute("data-description") || "";
    const bullets = card.getAttribute("data-bullets") || "";
    const repo = card.getAttribute("data-repo") || "#";
    const demo = card.getAttribute("data-demo") || "#";
    const video = card.getAttribute("data-video") || "";

    modalTitle.textContent = title;
    modalTag.textContent = tag;
    modalDesc.textContent = desc;

    const modalMedia = modal.querySelector(".modal-media");
    const modalBody = modal.querySelector(".modal-body");

    if (video) {
      if (modalMedia) modalMedia.style.display = "";
      if (modalBody) modalBody.classList.remove("no-media");
      if (modalVideo) {
        modalVideo.style.display = "block";
        modalVideo.src = video;
      }
      if (modalImage) {
        modalImage.style.display = "none";
        modalImage.src = "";
      }
    } else if (img) {
      if (modalMedia) modalMedia.style.display = "";
      if (modalBody) modalBody.classList.remove("no-media");
      if (modalVideo) {
        modalVideo.style.display = "none";
        modalVideo.src = "";
      }
      if (modalImage) {
        modalImage.style.display = "block";
        modalImage.src = img;
        modalImage.alt = title + " preview";
      }
    } else {
      if (modalMedia) modalMedia.style.display = "none";
      if (modalBody) modalBody.classList.add("no-media");
      if (modalVideo) {
        modalVideo.style.display = "none";
        modalVideo.src = "";
      }
      if (modalImage) {
        modalImage.style.display = "none";
        modalImage.src = "";
      }
    }

    modalRepo.href = repo;
    modalDemo.href = demo;

    while (modalBullets.firstChild) modalBullets.removeChild(modalBullets.firstChild);
    bullets.split("|").map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      modalBullets.appendChild(li);
    });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    const closeBtn = modal.querySelector("[data-close='true']");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;

    if (modalVideo) modalVideo.src = "";

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  projectCards.forEach(function (card) {
    card.setAttribute("tabindex", "0");
    card.addEventListener("click", function () {
      openModalFromCard(card);
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModalFromCard(card);
      }
    });
  });

  if (modal) {
    modal.addEventListener("click", function (e) {
      const target = e.target;
      if (target && target.getAttribute && target.getAttribute("data-close") === "true") {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    const heroImg = document.querySelector(".hero-banner-img");
    const heroSection = document.querySelector(".hero-banner");
    const parallaxCards = Array.from(document.querySelectorAll(".card"));

    let ticking = false;

    const updateParallax = function () {
      const viewportH = window.innerHeight;
      const viewportCenter = viewportH / 2;

      if (heroImg && heroSection) {
        const rect = heroSection.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < viewportH) {
          const offset = rect.top * -0.35;
          heroImg.style.transform = "translate3d(0, " + offset + "px, 0) scale(1.08)";
        }
      }

      for (let i = 0; i < parallaxCards.length; i++) {
        const card = parallaxCards[i];
        const rect = card.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > viewportH + 80) continue;

        const cardCenter = rect.top + rect.height / 2;
        const distance = cardCenter - viewportCenter;
        const speed = 0.05 + (i % 3) * 0.015;
        const offset = -distance * speed;
        card.style.setProperty("--parallax-y", offset.toFixed(2) + "px");
      }

      ticking = false;
    };

    const onScroll = function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateParallax();

    if ("IntersectionObserver" in window) {
      const revealTargets = document.querySelectorAll(".reveal, .reveal-group");
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -80px 0px" });
      revealTargets.forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll(".reveal, .reveal-group").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  if ("IntersectionObserver" in window) {
    const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
    const sectionMap = new Map();
    navLinks.forEach(function (link) {
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (section) sectionMap.set(section, link);
    });

    const visible = new Set();

    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });

      if (visible.size === 0) {
        navLinks.forEach(function (l) { l.classList.remove("is-active"); });
        return;
      }

      let topmost = null;
      let topmostY = Infinity;
      visible.forEach(function (section) {
        const top = section.getBoundingClientRect().top;
        if (top < topmostY) {
          topmostY = top;
          topmost = section;
        }
      });

      const activeLink = sectionMap.get(topmost);
      navLinks.forEach(function (l) {
        l.classList.toggle("is-active", l === activeLink);
      });
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0
    });

    sectionMap.forEach(function (_link, section) { spy.observe(section); });
  }
})();
