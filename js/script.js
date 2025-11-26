document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.querySelector("#currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const topbar = document.querySelector(".topbar");
  let lastScrollY = window.scrollY;
  let scrollTimeout;

  function updateTopbarState() {
    if (!topbar) return;
    const currentY = window.scrollY;

    if (currentY > lastScrollY + 10 && currentY > 40) {
      topbar.classList.add("topbar--hidden");
    } else if (currentY < lastScrollY - 10 || currentY <= 40) {
      topbar.classList.remove("topbar--hidden");
    }

    if (currentY > 12) {
      topbar.classList.add("topbar--shadow");
    } else {
      topbar.classList.remove("topbar--shadow");
    }

    lastScrollY = currentY;
  }

  function onScroll() {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(updateTopbarState);
  }
  function showToastfy(message) {
    // remove se já existir
    const existing = document.querySelector(".toastfy");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toastfy";
    toast.textContent = message;

    document.body.appendChild(toast);

    // força reflow para animar
    void toast.offsetWidth;

    toast.classList.add("toastfy--visible");

    setTimeout(() => {
      toast.classList.remove("toastfy--visible");
      setTimeout(() => toast.remove(), 400);
    }, 2600);
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  const copyButton = document.querySelector("[data-copy-pix]");
  const pixKeyEl = document.querySelector("[data-pix-key]");
  const feedbackEl = document.querySelector("[data-copy-feedback]");
  let toastEl;

  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }

    toastEl.textContent = message;
    toastEl.classList.add("toast--visible");

    window.setTimeout(() => {
      toastEl.classList.remove("toast--visible");
    }, 2500);
  }

  if (copyButton && pixKeyEl) {
    copyButton.addEventListener("click", async () => {
      const key = pixKeyEl.textContent.trim();
      if (!key) return;

      try {
        await navigator.clipboard.writeText(key);
        showToastfy("Chave PIX copiada com sucesso!");
      } catch (error) {
        const fallbackMsg =
          "Não foi possível copiar automaticamente. Copie manualmente: " + key;
        showToastfy(fallbackMsg);
      }
    });
  }

  const tabs = Array.from(document.querySelectorAll(".tab-button"));
  const panels = Array.from(document.querySelectorAll(".tab-panel"));
  function activateTab(targetId) {
    tabs.forEach((button) => {
      const isActive = button.dataset.tab === targetId;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === targetId);
    });
  }

  if (tabs.length) {
    activateTab(tabs[0].dataset.tab);
    tabs.forEach((button) => {
      button.addEventListener("click", () => {
        activateTab(button.dataset.tab);
      });
    });
  }

  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  if (faqItems.length) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (!question) return;

      question.setAttribute("aria-expanded", "false");

      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("open");
            const otherBtn = other.querySelector(".faq-question");
            if (otherBtn) {
              otherBtn.setAttribute("aria-expanded", "false");
            }
          }
        });

        if (!isOpen) {
          item.classList.add("open");
          question.setAttribute("aria-expanded", "true");
        } else {
          item.classList.remove("open");
          question.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  const buddyTrack = document.querySelector(".buddy-track");
  const buddyDots = Array.from(document.querySelectorAll(".buddy-dot"));
  const buddyPrev = document.querySelector('[data-buddy="prev"]');
  const buddyNext = document.querySelector('[data-buddy="next"]');
  if (buddyTrack && buddyDots.length) {
    let currentBuddy = 0;

    function setBuddySlide(index) {
      currentBuddy = (index + buddyDots.length) % buddyDots.length;
      buddyTrack.style.transform = `translateX(-${currentBuddy * 100}%)`;
      buddyDots.forEach((dot, idx) =>
        dot.classList.toggle("active", idx === currentBuddy)
      );
    }

    buddyDots.forEach((dot, idx) => {
      dot.addEventListener("click", () => setBuddySlide(idx));
    });

    if (buddyPrev) {
      buddyPrev.addEventListener("click", () =>
        setBuddySlide(currentBuddy - 1)
      );
    }

    if (buddyNext) {
      buddyNext.addEventListener("click", () =>
        setBuddySlide(currentBuddy + 1)
      );
    }
  }
});
