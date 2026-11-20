/**
 * ETERNAL BLOOM — Coreografía GSAP (Transición Inicial, Revelado Poético y Gran Final)
 */
(function () {
  "use strict";

  window.EternalBloom = window.EternalBloom || {};

  class CelestialChoreography {
    constructor({ fireworks, atmosphere }) {
      this.fireworks = fireworks;
      this.atmosphere = atmosphere;
      this.finaleTriggered = false;
    }

    init() {
      const hasGSAP = typeof window.gsap !== "undefined";
      if (!hasGSAP) {
        this.setupFallbackEntrance();
        return;
      }

      if (typeof window.ScrollTrigger !== "undefined") {
        window.gsap.registerPlugin(window.ScrollTrigger);
      }

      this.animateIntroEntrance();
      this.bindEnterUniverseButton();
    }

    animateIntroEntrance() {
      const reduced = document.body.classList.contains("calm-motion");
      if (reduced) return;

      window.gsap.from(".intro-stagger", {
        y: 22,
        opacity: 0,
        duration: 1.15,
        stagger: 0.18,
        ease: "power3.out",
        clearProps: "transform"
      });
    }

    bindEnterUniverseButton() {
      const enterBtn = document.getElementById("btn-enter-universe");
      const introScreen = document.getElementById("intro-screen");
      const hud = document.getElementById("ambient-hud");

      if (!enterBtn || !introScreen) return;

      enterBtn.addEventListener("click", () => {
        const rect = enterBtn.getBoundingClientRect();
        this.atmosphere.spawnInteractionBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);

        if (typeof window.gsap === "undefined") {
          this.completeTransition(introScreen, hud);
          return;
        }

        const tl = window.gsap.timeline({
          onComplete: () => this.completeTransition(introScreen, hud)
        });

        tl.to(".intro-content", {
          y: -26,
          opacity: 0,
          duration: 0.75,
          ease: "power2.inOut"
        })
        .to(introScreen, {
          opacity: 0,
          scale: 1.04,
          duration: 0.85,
          ease: "power2.inOut"
        }, "-=0.4");
      });
    }

    completeTransition(introScreen, hud) {
      introScreen.classList.add("is-dismissed");
      document.body.classList.remove("intro-locked");
      if (hud) hud.classList.add("is-visible");

      this.fireworks.setAmbientEnabled(true);
      this.fireworks.launchChoreography(4, 420);

      this.setupScrollAnimations();
      this.setupPoeticMessageReveal();
      this.setupFinaleLotus();
    }

    setupFallbackEntrance() {
      const enterBtn = document.getElementById("btn-enter-universe");
      const introScreen = document.getElementById("intro-screen");
      const hud = document.getElementById("ambient-hud");
      if (enterBtn && introScreen) {
        enterBtn.addEventListener("click", () => {
          this.completeTransition(introScreen, hud);
        });
      }
    }

    setupScrollAnimations() {
      if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") return;
      const reduced = document.body.classList.contains("calm-motion");
      if (reduced) return;

      window.gsap.utils.toArray(".reveal-up").forEach((el) => {
        window.gsap.from(el, {
          y: 26,
          opacity: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true
          }
        });
      });

      window.gsap.utils.toArray(".flower-unit").forEach((flower, idx) => {
        window.gsap.from(flower, {
          scaleY: 0.15,
          opacity: 0,
          y: 24,
          duration: 1.1,
          delay: (idx % 6) * 0.08,
          ease: "back.out(1.25)",
          scrollTrigger: {
            trigger: flower.parentElement,
            start: "top 88%",
            once: true
          }
        });
      });

      window.gsap.from(".reminder-card", {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: "#reminders-grid",
          start: "top 82%",
          once: true
        }
      });
    }

    setupPoeticMessageReveal() {
      const lines = document.querySelectorAll("[data-poetic-line]");
      const replayBtn = document.getElementById("btn-replay-message");

      const playLines = () => {
        if (typeof window.gsap === "undefined") return;
        window.gsap.fromTo(
          lines,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            stagger: 0.5,
            ease: "power2.out"
          }
        );
      };

      if (typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined") {
        window.ScrollTrigger.create({
          trigger: "#emotional-message",
          start: "top 76%",
          once: true,
          onEnter: playLines
        });
      }

      if (replayBtn) {
        replayBtn.addEventListener("click", playLines);
      }
    }

    setupFinaleLotus() {
      const mount = document.getElementById("finale-lotus-mount");
      const btn = document.getElementById("btn-finale-celebration");

      const triggerGrandFinale = () => {
        const lotusSvg = mount ? mount.querySelector(".lotus-svg") : null;
        if (lotusSvg) {
          lotusSvg.classList.add("is-open");
        }

        if (mount) {
          const rect = mount.getBoundingClientRect();
          this.atmosphere.spawnInteractionBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
        }

        this.fireworks.launchChoreography(6, 380);
      };

      if (btn) {
        btn.addEventListener("click", triggerGrandFinale);
      }
      if (mount) {
        mount.addEventListener("click", triggerGrandFinale);
        mount.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerGrandFinale();
          }
        });
      }

      if (typeof window.ScrollTrigger !== "undefined" && mount) {
        window.ScrollTrigger.create({
          trigger: "#final-letter-section",
          start: "top 68%",
          once: true,
          onEnter: () => {
            if (!this.finaleTriggered) {
              this.finaleTriggered = true;
              setTimeout(triggerGrandFinale, 900);
            }
          }
        });
      }
    }
  }

  window.EternalBloom.CelestialChoreography = CelestialChoreography;
})();
