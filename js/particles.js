/**
 * ETERNAL BLOOM — Sistema de Estrellas, Polvo Luminoso y Pétalos Flotantes (Canvas 2D)
 */
(function () {
  "use strict";

  window.EternalBloom = window.EternalBloom || {};

  class CelestialAtmosphere {
    constructor(starCanvas, petalsCanvas) {
      this.starCanvas = starCanvas;
      this.starCtx = starCanvas.getContext("2d");
      this.petalsCanvas = petalsCanvas;
      this.petalsCtx = petalsCanvas.getContext("2d");

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.stars = [];
      this.fireflies = [];
      this.petals = [];
      this.burstPetals = [];

      this.calmMode = false;
      this.running = false;
      this.lastTime = 0;

      this.resize();
      this.seedEntities();
      this.bindEvents();
    }

    bindEvents() {
      let resizeTimer = null;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.resize();
          this.seedEntities();
        }, 160);
      });
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      [this.starCanvas, this.petalsCanvas].forEach((canvas) => {
        canvas.width = Math.floor(this.width * this.dpr);
        canvas.height = Math.floor(this.height * this.dpr);
        canvas.style.width = `${this.width}px`;
        canvas.style.height = `${this.height}px`;
      });

      this.starCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.petalsCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    seedEntities() {
      const area = this.width * this.height;
      const starCount = Math.min(180, Math.max(70, Math.floor(area / 10500)));
      const fireflyCount = Math.min(34, Math.max(14, Math.floor(area / 45000)));
      const petalCount = Math.min(26, Math.max(12, Math.floor(this.width / 55)));

      const starColors = ["#f8f6fc", "#ebd09e", "#c8b6ff", "#f4b8ce"];

      this.stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.85,
        radius: Math.random() * 1.45 + 0.35,
        baseAlpha: Math.random() * 0.65 + 0.25,
        twinkleSpeed: Math.random() * 0.022 + 0.006,
        phase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        hasCross: Math.random() > 0.86
      }));

      this.fireflies = Array.from({ length: fireflyCount }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -Math.random() * 0.24 - 0.06,
        size: Math.random() * 2.1 + 1.1,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.45 ? "235, 208, 158" : "200, 182, 255"
      }));

      this.petals = Array.from({ length: petalCount }, () => this.createPetal(true));
    }

    createPetal(randomY = false) {
      const palette = [
        { fill: "rgba(244, 184, 206, 0.55)", edge: "rgba(248, 246, 252, 0.35)" },
        { fill: "rgba(200, 182, 255, 0.48)", edge: "rgba(248, 246, 252, 0.3)" },
        { fill: "rgba(248, 246, 252, 0.42)", edge: "rgba(235, 208, 158, 0.3)" }
      ];
      const tone = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * this.width,
        y: randomY ? Math.random() * this.height : -24,
        vx: Math.random() * 0.55 + 0.18,
        vy: Math.random() * 0.52 + 0.28,
        size: Math.random() * 6.5 + 4.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.024,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: Math.random() * 0.65 + 0.25,
        tone
      };
    }

    /**
     * Genera pétalos y destellos locales cuando el usuario toca una flor o tarjeta
     */
    spawnInteractionBurst(clientX, clientY, count = 12) {
      const effectiveCount = this.calmMode ? Math.ceil(count / 2) : count;
      for (let i = 0; i < effectiveCount; i++) {
        const angle = (Math.PI * 2 * i) / effectiveCount + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 2.2 + 0.9;
        this.burstPetals.push({
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          size: Math.random() * 5.2 + 3.2,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.06,
          alpha: 1,
          decay: Math.random() * 0.014 + 0.011,
          isSpark: i % 3 === 0
        });
      }
    }

    setCalmMode(enabled) {
      this.calmMode = Boolean(enabled);
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.lastTime = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        const dt = Math.min((now - this.lastTime) / 16.666, 2.5);
        this.lastTime = now;
        this.updateAndDraw(dt);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    updateAndDraw(dt) {
      const speedFactor = this.calmMode ? 0.35 : 1;

      // 1. Dibujar campo estelar y luciérnagas suaves
      const sCtx = this.starCtx;
      sCtx.clearRect(0, 0, this.width, this.height);

      for (const star of this.stars) {
        star.phase += star.twinkleSpeed * dt * speedFactor;
        const alpha = Math.max(0.12, star.baseAlpha + Math.sin(star.phase) * 0.28);

        sCtx.save();
        sCtx.globalAlpha = alpha;
        sCtx.fillStyle = star.color;
        sCtx.beginPath();
        sCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        sCtx.fill();

        if (star.hasCross && alpha > 0.55) {
          sCtx.strokeStyle = star.color;
          sCtx.lineWidth = 0.6;
          const len = star.radius * 4.2;
          sCtx.beginPath();
          sCtx.moveTo(star.x - len, star.y);
          sCtx.lineTo(star.x + len, star.y);
          sCtx.moveTo(star.x, star.y - len);
          sCtx.lineTo(star.x, star.y + len);
          sCtx.stroke();
        }
        sCtx.restore();
      }

      for (const fly of this.fireflies) {
        fly.phase += 0.025 * dt * speedFactor;
        fly.x += (fly.vx + Math.sin(fly.phase) * 0.16) * dt * speedFactor;
        fly.y += fly.vy * dt * speedFactor;

        if (fly.y < -12) {
          fly.y = this.height + 12;
          fly.x = Math.random() * this.width;
        }
        if (fly.x < -12) fly.x = this.width + 12;
        if (fly.x > this.width + 12) fly.x = -12;

        const glowAlpha = 0.25 + (Math.sin(fly.phase * 1.4) + 1) * 0.28;
        const grad = sCtx.createRadialGradient(fly.x, fly.y, 0, fly.x, fly.y, fly.size * 4.5);
        grad.addColorStop(0, `rgba(${fly.hue}, ${glowAlpha})`);
        grad.addColorStop(1, `rgba(${fly.hue}, 0)`);

        sCtx.fillStyle = grad;
        sCtx.beginPath();
        sCtx.arc(fly.x, fly.y, fly.size * 4.5, 0, Math.PI * 2);
        sCtx.fill();
      }

      // 2. Dibujar pétalos flotantes y ráfagas de interacción
      const pCtx = this.petalsCtx;
      pCtx.clearRect(0, 0, this.width, this.height);

      for (const petal of this.petals) {
        petal.swayPhase += 0.018 * dt * speedFactor;
        petal.x += (petal.vx + Math.sin(petal.swayPhase) * petal.swayAmp) * dt * speedFactor;
        petal.y += petal.vy * dt * speedFactor;
        petal.rotation += petal.rotSpeed * dt * speedFactor;

        if (petal.y > this.height + 24 || petal.x > this.width + 24) {
          Object.assign(petal, this.createPetal(false));
          petal.x = Math.random() * this.width * 0.9;
        }

        this.drawPetalShape(pCtx, petal.x, petal.y, petal.size, petal.rotation, petal.tone.fill, petal.tone.edge, 1);
      }

      for (let i = this.burstPetals.length - 1; i >= 0; i--) {
        const bp = this.burstPetals[i];
        bp.x += bp.vx * dt;
        bp.y += bp.vy * dt;
        bp.vy += 0.025 * dt;
        bp.vx *= 0.985;
        bp.rotation += bp.rotSpeed * dt;
        bp.alpha -= bp.decay * dt;

        if (bp.alpha <= 0) {
          this.burstPetals.splice(i, 1);
          continue;
        }

        if (bp.isSpark) {
          pCtx.save();
          pCtx.globalAlpha = bp.alpha;
          pCtx.fillStyle = "#f9e8c7";
          pCtx.shadowColor = "#ebd09e";
          pCtx.shadowBlur = 10;
          pCtx.beginPath();
          pCtx.arc(bp.x, bp.y, bp.size * 0.45, 0, Math.PI * 2);
          pCtx.fill();
          pCtx.restore();
        } else {
          this.drawPetalShape(
            pCtx,
            bp.x,
            bp.y,
            bp.size,
            bp.rotation,
            "rgba(244, 184, 206, 0.85)",
            "rgba(235, 208, 158, 0.6)",
            bp.alpha
          );
        }
      }
    }

    drawPetalShape(ctx, x, y, size, rotation, fill, stroke, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.85, -size * 0.45, size * 0.75, size * 0.65, 0, size);
      ctx.bezierCurveTo(-size * 0.75, size * 0.65, -size * 0.85, -size * 0.45, 0, -size);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    }
  }

  window.EternalBloom.CelestialAtmosphere = CelestialAtmosphere;
})();
