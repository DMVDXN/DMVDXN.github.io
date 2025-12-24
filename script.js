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

    if (video) {
      if (modalVideo) {
        modalVideo.style.display = "block";
        modalVideo.src = video;
      }
      if (modalImage) {
        modalImage.style.display = "none";
        modalImage.src = "";
      }
    } else {
      if (modalVideo) {
        modalVideo.style.display = "none";
        modalVideo.src = "";
      }
      if (modalImage) {
        modalImage.style.display = "block";
        modalImage.src = img;
        modalImage.alt = title + " preview";
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
})();
