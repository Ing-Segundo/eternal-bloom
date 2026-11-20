/**
 * ETERNAL BLOOM — Interacciones Sensoriales (Estrellas, Flores, Luna y Tarjetas)
 */
(function () {
  "use strict";

  window.EternalBloom = window.EternalBloom || {};

  class CelestialInteractions {
    constructor({ atmosphere, fireworks }) {
      this.atmosphere = atmosphere;
      this.fireworks = fireworks;

      this.whisperEl = document.getElementById("celestial-whisper");
      this.whisperTextEl = document.getElementById("celestial-whisper-text");
      this.whisperTimer = null;

      this.moonMoods = [
        { key: "silver", label: "Luz: Plata", message: "La luna baña el jardín con un resplandor sereno y plateado." },
        { key: "lavender", label: "Luz: Lavanda", message: "Un matiz lavanda envuelve la noche en calma y suavidad." },
        { key: "champagne", label: "Luz: Champagne", message: "Una calidez dorada ilumina cada rincón de este cielo." }
      ];
      this.currentMoodIndex = 0;

      this.starMessages = [
        "Incluso una sola estrella basta para guiar una noche entera.",
        "Lo que haces con cariño siempre deja una luz bonita.",
        "Está bien ir despacio; las estrellas no tienen prisa por brillar.",
        "Eres mucho más fuerte y valiosa de lo que hoy alcanzas a ver.",
        "Siempre habrá un rincón del cielo guardado para tu calma.",
        "Tu sensibilidad es una forma hermosa de mirar el mundo.",
        "Hoy no necesitas demostrar nada: basta con que existas y respires."
      ];
    }

    init() {
      this.populateInteractiveStars();
      this.bindFlowerClicks();
      this.bindMoonControl();
      this.bindReminderCards();
      this.bindFireworksControls();
      this.bindCalmMode();
    }

    showWhisper(text, clientX, clientY) {
      if (!this.whisperEl || !this.whisperTextEl) return;

      this.whisperTextEl.textContent = text;
      this.whisperEl.hidden = false;

      const pad = 16;
      const boxWidth = 300;
      const left = Math.min(Math.max(pad, clientX - boxWidth / 2), window.innerWidth - boxWidth - pad);
      const top = Math.max(pad, clientY - 76);

      this.whisperEl.style.left = `${left}px`;
      this.whisperEl.style.top = `${top}px`;

      requestAnimationFrame(() => {
        this.whisperEl.classList.add("is-visible");
      });

      clearTimeout(this.whisperTimer);
      this.whisperTimer = setTimeout(() => {
        this.whisperEl.classList.remove("is-visible");
        setTimeout(() => {
          if (!this.whisperEl.classList.contains("is-visible")) {
            this.whisperEl.hidden = true;
          }
        }, 320);
      }, 3600);
    }

    populateInteractiveStars() {
      const layer = document.getElementById("interactive-stars-layer");
      if (!layer) return;

      const positions = [
        { top: "14%", left: "12%" },
        { top: "22%", left: "28%" },
        { top: "12%", left: "54%" },
        { top: "30%", left: "86%" },
        { top: "48%", left: "9%" },
        { top: "56%", left: "91%" },
        { top: "74%", left: "14%" }
      ];

      layer.innerHTML = "";
      positions.forEach((pos, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "star-node";
        btn.style.top = pos.top;
        btn.style.left = pos.left;
        btn.setAttribute("aria-label", `Estrella luminosa ${idx + 1}: presiona para descubrir un mensaje`);
        btn.innerHTML = `<span class="star-node-core" aria-hidden="true"></span>`;

        const msg = this.starMessages[idx % this.starMessages.length];
        btn.addEventListener("click", (e) => {
          const rect = btn.getBoundingClientRect();
          const cx = e.clientX || rect.left + rect.width / 2;
          const cy = e.clientY || rect.top + rect.height / 2;
          this.atmosphere.spawnInteractionBurst(cx, cy, 10);
          this.showWhisper(msg, cx, cy);
        });

        layer.appendChild(btn);
      });
    }

    bindFlowerClicks() {
      document.addEventListener("click", (e) => {
        const flower = e.target.closest(".flower-unit");
        if (!flower) return;
        this.activateFlower(flower, e.clientX, e.clientY);
      });

      document.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const flower = e.target.closest(".flower-unit");
        if (!flower) return;
        e.preventDefault();
        const rect = flower.getBoundingClientRect();
        this.activateFlower(flower, rect.left + rect.width / 2, rect.top + rect.height * 0.35);
      });
    }

    activateFlower(flowerEl, clientX, clientY) {
      const rect = flowerEl.getBoundingClientRect();
      const x = clientX || rect.left + rect.width / 2;
      const y = clientY || rect.top + rect.height * 0.35;

      flowerEl.classList.remove("is-bloom-clicked");
      void flowerEl.offsetWidth;
      flowerEl.classList.add("is-bloom-clicked");

      const lotusSvg = flowerEl.querySelector(".lotus-svg");
      if (lotusSvg) {
        lotusSvg.classList.toggle("is-open");
      }

      this.atmosphere.spawnInteractionBurst(x, y, 14);
      const customMsg = flowerEl.dataset.flowerMessage || "Un pequeño pétalo de calma florece para ti.";
      this.showWhisper(customMsg, x, y);
    }

    bindMoonControl() {
      const moonBtn = document.getElementById("interactive-moon");
      const hudMoonBtn = document.getElementById("btn-moon-aura");
      const labelEl = document.getElementById("moon-mood-label");

      const cycleMood = (event) => {
        this.currentMoodIndex = (this.currentMoodIndex + 1) % this.moonMoods.length;
        const mood = this.moonMoods[this.currentMoodIndex];
        document.body.setAttribute("data-moon-mood", mood.key);
        if (labelEl) labelEl.textContent = mood.label;

        const target = event?.currentTarget;
        if (target) {
          const rect = target.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          this.atmosphere.spawnInteractionBurst(cx, cy, 12);
          this.showWhisper(mood.message, cx, cy);
        }
      };

      if (moonBtn) moonBtn.addEventListener("click", cycleMood);
      if (hudMoonBtn) hudMoonBtn.addEventListener("click", cycleMood);
    }

    bindReminderCards() {
      const cards = document.querySelectorAll(".reminder-card");
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }, { passive: true });

        const toggleCard = (e) => {
          const isLit = card.classList.toggle("is-lit");
          card.setAttribute("aria-pressed", String(isLit));
          const rect = card.getBoundingClientRect();
          const cx = e.clientX || rect.left + rect.width / 2;
          const cy = e.clientY || rect.top + 36;
          this.atmosphere.spawnInteractionBurst(cx, cy, isLit ? 12 : 6);
        };

        card.addEventListener("click", toggleCard);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleCard(e);
          }
        });
      });
    }

    bindFireworksControls() {
      const hudFireworksBtn = document.getElementById("btn-fireworks-show");
      if (hudFireworksBtn) {
        hudFireworksBtn.addEventListener("click", () => {
          this.fireworks.launchChoreography(6, 360);
        });
      }
    }

    bindCalmMode() {
      const calmBtn = document.getElementById("btn-calm-mode");
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const applyCalm = (active) => {
        document.body.classList.toggle("calm-motion", active);
        this.atmosphere.setCalmMode(active);
        this.fireworks.setCalmMode(active);
        if (calmBtn) {
          calmBtn.setAttribute("aria-pressed", String(active));
        }
      };

      if (prefersReduced) {
        applyCalm(true);
      }

      if (calmBtn) {
        calmBtn.addEventListener("click", () => {
          const next = !document.body.classList.contains("calm-motion");
          applyCalm(next);
        });
      }
    }
  }

  window.EternalBloom.CelestialInteractions = CelestialInteractions;
})();
