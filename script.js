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
    if (heroImg && heroSection) {
      let ticking = false;
      const updateParallax = function () {
        const rect = heroSection.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const offset = rect.top * -0.35;
          heroImg.style.transform = "translate3d(0, " + offset + "px, 0) scale(1.08)";
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
      updateParallax();
    }

    if ("IntersectionObserver" in window) {
      const revealTargets = document.querySelectorAll(".reveal, .reveal-group");
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      revealTargets.forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll(".reveal, .reveal-group").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }
})();
