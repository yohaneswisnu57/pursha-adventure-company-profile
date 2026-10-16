(() => {
  "use strict";

  const config = window.PURSHA_CONFIG || {};
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector("#primary-nav");
  const notice = document.querySelector("[data-notice]");
  const packageNames = {
    "bromo-sunrise": "Bromo Sebelum Kota Terbangun",
    "ijen-blue-hour": "Ijen di Jam Biru",
    "komodo-private-sail": "Komodo dari Geladak",
    "sumba-slow-journey": "Sumba dalam Ritme Pelan",
  };

  function track(eventName, detail = {}) {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...detail,
    };

    window.dispatchEvent(new CustomEvent("pursha:analytics", { detail: payload }));

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }
  }

  function showNotice(message) {
    if (!notice) return;
    notice.textContent = message;
    notice.hidden = false;
    window.clearTimeout(showNotice.timeoutId);
    showNotice.timeoutId = window.setTimeout(() => {
      notice.hidden = true;
    }, 5200);
  }

  function validWhatsappNumber(value) {
    return /^\d{9,15}$/.test(String(value || "").replace(/\D/g, ""));
  }

  function buildWhatsappUrl(packageSlug, source) {
    const rawNumber = String(config.whatsappNumber || "").replace(/\D/g, "");
    if (!validWhatsappNumber(rawNumber)) return null;

    const packageName = packageSlug ? packageNames[packageSlug] : "private trip Pursha Adventure";
    const message = [
      "Halo Pursha Adventure, saya ingin konsultasi perjalanan.",
      `Paket yang dilihat: ${packageName}.`,
      `Sumber: ${source || "landing-page"}.`,
      "Boleh bantu saya membahas tanggal dan kebutuhan perjalanan?",
    ].join("\n");

    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  }

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("nav-open", !expanded);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 821px)").matches) closeMenu();
    });
  }

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const packageSlug = link.dataset.packageCta || "";
      const source = link.dataset.source || "unknown";
      const url = buildWhatsappUrl(packageSlug, source);

      track(packageSlug ? "click_whatsapp_package" : "click_whatsapp", {
        package: packageSlug || undefined,
        source,
      });

      if (!url) {
        event.preventDefault();
        showNotice("Nomor WhatsApp Pursha belum dikonfigurasi. Isi WHATSAPP_NUMBER pada file .env sebelum menjalankan situs.");
        return;
      }

      event.preventDefault();
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  document.querySelectorAll("[data-package]").forEach((article) => {
    article.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      track("click_package", { package: article.dataset.package });
    });
  });

  document.querySelectorAll("details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (detail.open) {
        track("open_faq", { question: detail.querySelector("summary")?.textContent?.trim() });
      }
    });
  });

  const seenPackages = new Set();
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const packageSlug = entry.target.dataset.package;
          if (!entry.isIntersecting || seenPackages.has(packageSlug)) return;
          seenPackages.add(packageSlug);
          track("view_package", { package: packageSlug });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.55 },
    );

    document.querySelectorAll("[data-package]").forEach((article) => observer.observe(article));
  }

  const prices = config.prices || {};
  Object.entries(prices).forEach(([key, value]) => {
    const target = document.querySelector(`[data-price="${key}"]`);
    if (target && String(value || "").trim()) target.textContent = value;
  });

  const configuredPrices = Object.values(prices).filter((value) => String(value || "").trim()).length;
  const pricingNote = document.querySelector("[data-pricing-note]");
  if (pricingNote && configuredPrices > 0) {
    pricingNote.textContent = "Harga merupakan estimasi awal dan dapat berubah setelah tanggal serta cakupan perjalanan dikonfirmasi.";
  }
})();
