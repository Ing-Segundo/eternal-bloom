/**
 * ETERNAL BLOOM — Jardín Botánico Procedural SVG (Rosas, Lotos, Margaritas y Flores Luminosas)
 */
(function () {
  "use strict";

  window.EternalBloom = window.EternalBloom || {};

  class BotanicalGarden {
    constructor() {
      this.uidCounter = 0;
    }

    nextId(prefix) {
      this.uidCounter += 1;
      return `${prefix}-${this.uidCounter}`;
    }

    createLotusSVG(scale = 1, initiallyOpen = false) {
      const gradId = this.nextId("lotus-grad");
      const coreId = this.nextId("lotus-core");
      const openClass = initiallyOpen ? "is-open" : "";
      const w = Math.round(170 * scale);
      const h = Math.round(130 * scale);

      return `
        <svg class="lotus-svg ${openClass}" width="${w}" height="${h}" viewBox="0 0 180 140" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="${gradId}" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#fffcfe"/>
              <stop offset="52%" stop-color="#f4b8ce"/>
              <stop offset="100%" stop-color="#9f8be0"/>
            </linearGradient>
            <radialGradient id="${coreId}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fff8de"/>
              <stop offset="65%" stop-color="#ebd09e"/>
              <stop offset="100%" stop-color="#ebd09e" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <ellipse cx="90" cy="122" rx="64" ry="10" fill="rgba(200, 182, 255, 0.16)"/>

          <path class="lotus-petal-outer-left" d="M90 118 C54 114, 24 92, 24 64 C48 68, 72 88, 90 118 Z" fill="url(#${gradId})" fill-opacity="0.72"/>
          <path class="lotus-petal-outer-right" d="M90 118 C126 114, 156 92, 156 64 C132 68, 108 88, 90 118 Z" fill="url(#${gradId})" fill-opacity="0.72"/>

          <path class="lotus-petal-mid-left" d="M90 118 C62 104, 44 74, 52 42 C72 54, 84 82, 90 118 Z" fill="url(#${gradId})" fill-opacity="0.88"/>
          <path class="lotus-petal-mid-right" d="M90 118 C118 104, 136 74, 128 42 C108 54, 96 82, 90 118 Z" fill="url(#${gradId})" fill-opacity="0.88"/>

          <path class="lotus-petal-inner-left" d="M90 116 C72 95, 66 64, 76 32 C86 52, 90 82, 90 116 Z" fill="url(#${gradId})" fill-opacity="0.95"/>
          <path class="lotus-petal-inner-right" d="M90 116 C108 95, 114 64, 104 32 C94 52, 90 82, 90 116 Z" fill="url(#${gradId})" fill-opacity="0.95"/>

          <path d="M90 22 C103 48, 103 86, 90 116 C77 86, 77 48, 90 22 Z" fill="url(#${gradId})"/>

          <circle class="lotus-core-glow" cx="90" cy="96" r="18" fill="url(#${coreId})"/>
          <circle cx="90" cy="98" r="4.5" fill="#fff7db"/>
        </svg>
      `;
    }

    createRoseSVG(scale = 1, variant = "pink") {
      const id = this.nextId("rose");
      const c1 = variant === "lavender" ? "#f3ecff" : "#fff5f9";
      const c2 = variant === "lavender" ? "#c8b6ff" : "#f4b8ce";
      const c3 = variant === "lavender" ? "#7d62b8" : "#c96f94";
      const w = Math.round(92 * scale);
      const h = Math.round(170 * scale);

      return `
        <svg width="${w}" height="${h}" viewBox="0 0 100 185" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="${id}" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stop-color="${c1}"/>
              <stop offset="55%" stop-color="${c2}"/>
              <stop offset="100%" stop-color="${c3}"/>
            </radialGradient>
          </defs>
          <path d="M50 185 C49 140, 53 102, 50 64" stroke="#6c8c82" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M50 132 C34 126, 26 114, 30 104 C40 108, 46 118, 50 132 Z" fill="#5e7f76" opacity="0.85"/>
          <path d="M51 112 C67 106, 75 94, 71 84 C61 88, 55 98, 51 112 Z" fill="#6d9187" opacity="0.85"/>
          <path d="M50 72 C28 72, 22 46, 36 32 C42 26, 58 26, 64 32 C78 46, 72 72, 50 72 Z" fill="url(#${id})"/>
          <path d="M35 42 C42 32, 58 32, 65 42 C60 54, 40 54, 35 42 Z" fill="${c1}" fill-opacity="0.55"/>
          <path d="M41 44 C46 38, 54 38, 59 44 C55 50, 45 50, 41 44 Z" fill="${c3}" fill-opacity="0.45"/>
        </svg>
      `;
    }

    createDaisySVG(scale = 1) {
      const w = Math.round(82 * scale);
      const h = Math.round(150 * scale);
      const petals = Array.from({ length: 10 }, (_, idx) => {
        const angle = idx * 36;
        return `<ellipse cx="45" cy="24" rx="5.5" ry="16" fill="#f8f6fc" fill-opacity="0.92" transform="rotate(${angle} 45 45)"/>`;
      }).join("");

      return `
        <svg width="${w}" height="${h}" viewBox="0 0 90 165" fill="none" aria-hidden="true">
          <path d="M45 165 C44 122, 46 84, 45 48" stroke="#6f8f85" stroke-width="2" stroke-linecap="round"/>
          <path d="M45 118 C32 113, 27 103, 31 96 C39 100, 43 108, 45 118 Z" fill="#638379" opacity="0.82"/>
          ${petals}
          <circle cx="45" cy="45" r="9.5" fill="#ebd09e"/>
          <circle cx="43" cy="43" r="4" fill="#fff7dc"/>
        </svg>
      `;
    }

    createGlowWildflowerSVG(scale = 1) {
      const id = this.nextId("glowflower");
      const w = Math.round(74 * scale);
      const h = Math.round(160 * scale);

      return `
        <svg width="${w}" height="${h}" viewBox="0 0 80 175" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="${id}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fff8e0"/>
              <stop offset="50%" stop-color="#ebd09e" stop-opacity="0.75"/>
              <stop offset="100%" stop-color="#c8b6ff" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <path d="M40 175 C38 128, 44 82, 36 34" stroke="#758ca8" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M40 112 C28 96, 22 78, 22 62" stroke="#758ca8" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M41 94 C52 80, 58 66, 58 52" stroke="#758ca8" stroke-width="1.4" stroke-linecap="round"/>

          <circle cx="36" cy="32" r="16" fill="url(#${id})"/>
          <circle cx="36" cy="32" r="4.2" fill="#fffdf6"/>

          <circle cx="22" cy="60" r="12" fill="url(#${id})"/>
          <circle cx="22" cy="60" r="3" fill="#f4b8ce"/>

          <circle cx="58" cy="50" r="12" fill="url(#${id})"/>
          <circle cx="58" cy="50" r="3" fill="#c8b6ff"/>
        </svg>
      `;
    }

    renderMeadow(container, specList) {
      if (!container) return;
      container.innerHTML = "";

      specList.forEach((item, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = `flower-unit ${index % 2 === 0 ? "flower-sway-a" : "flower-sway-b"}`;
        wrapper.setAttribute("role", "button");
        wrapper.setAttribute("tabindex", "0");
        wrapper.setAttribute("aria-label", item.label);
        wrapper.dataset.flowerMessage = item.message;

        if (item.type === "lotus") {
          wrapper.innerHTML = this.createLotusSVG(item.scale || 1, Boolean(item.open));
        } else if (item.type === "rose-pink") {
          wrapper.innerHTML = this.createRoseSVG(item.scale || 1, "pink");
        } else if (item.type === "rose-lavender") {
          wrapper.innerHTML = this.createRoseSVG(item.scale || 1, "lavender");
        } else if (item.type === "daisy") {
          wrapper.innerHTML = this.createDaisySVG(item.scale || 1);
        } else {
          wrapper.innerHTML = this.createGlowWildflowerSVG(item.scale || 1);
        }

        container.appendChild(wrapper);
      });
    }
  }

  window.EternalBloom.BotanicalGarden = BotanicalGarden;
})();
