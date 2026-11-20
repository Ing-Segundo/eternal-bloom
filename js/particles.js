/**
 * ETERNAL BLOOM — Sistema Optimizado de Estrellas, Polvo Luminoso y Pétalos (Canvas 2D)
 * Utiliza sprites pre-renderizados fuera de pantalla para eliminar gradientes por fotograma.
 */
(function () {
  "use strict";

  window.EternalBloom = window.EternalBloom || {};

  class CelestialAtmosphere {
    constructor(starCanvas, petalsCanvas) {
      this.starCanvas = starCanvas;
      this.starCtx = starCanvas.getContext("2d", { alpha: true });
      this.petalsCanvas = petalsCanvas;
      this.petalsCtx = petalsCanvas.getContext("2d", { alpha: true });

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.isMobile = this.width < 768;
      this.dpr = this.getOptimalDPR();

      this.stars = [];
      this.fireflies = [];
      this.petals = [];
      this.burstPetals = [];

      this.calmMode = false;
      this.running = false;
      this.lastTime = 0;

      this.sprites = this.buildSprites();
      this.resize();
      this.seedEntities();
      this.bindEvents();
    }

    getOptimalDPR() {
      const raw = window.devicePixelRatio || 1;
      return this.width < 768 ? Math.min(raw, 1.25) : Math.min(raw, 1.5);
    }

    buildSprites() {
      const makeGlowOrb = (rgbStr, size = 32) => {
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");
        const half = size / 2;
        const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
        grad.addColorStop(0, `rgba(${rgbStr}, 0.95)`);
        grad.addColorStop(0.35, `rgba(${rgbStr}, 0.35)`);
        grad.addColorStop(1, `rgba(${rgbStr}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        return c;
      };

      const makePetalSprite = (fill, stroke, size = 28) => {
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");
        const half = size / 2;
        const r = size * 0.34;
        ctx.translate(half, half);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.bezierCurveTo(r * 0.85, -r * 0.45, r * 0.75, r * 0.65, 0, r);
        ctx.bezierCurveTo(-r * 0.75, r * 0.65, -r * 0.85, -r * 0.45, 0, -r);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        return c;
      };

      return {
        flyGold: makeGlowOrb("235, 208, 158", 32),
        flyLavender: makeGlowOrb("200, 182, 255", 32),
        sparkGold: makeGlowOrb("249, 232, 199", 24),
        petals: [
          makePetalSprite("rgba(244, 184, 206, 0.62)", "rgba(248, 246, 252, 0.38)"),
          makePetalSprite("rgba(200, 182, 255, 0.54)", "rgba(248, 246, 252, 0.32)"),
          makePetalSprite("rgba(248, 246, 252, 0.48)", "rgba(235, 208, 158, 0.34)")
        ],
        burstPetal: makePetalSprite("rgba(244, 184, 206, 0.88)", "rgba(235, 208, 158, 0.65)")
      };
    }

    bindEvents() {
      let resizeTimer = null;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.resize();
          this.seedEntities();
        }, 180);
      });
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.isMobile = this.width < 768;
      this.dpr = this.getOptimalDPR();

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
      const maxStars = this.isMobile ? 85 : 145;
      const maxFlies = this.isMobile ? 14 : 26;
      const maxPetals = this.isMobile ? 12 : 22;

      const starCount = Math.min(maxStars, Math.max(55, Math.floor(area / 13000)));
      const fireflyCount = Math.min(maxFlies, Math.max(10, Math.floor(area / 55000)));
      const petalCount = Math.min(maxPetals, Math.max(10, Math.floor(this.width / 65)));

      const starColors = ["#f8f6fc", "#ebd09e", "#c8b6ff", "#f4b8ce"];

      this.stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.85,
        radius: Math.random() * 1.45 + 0.4,
        baseAlpha: Math.random() * 0.65 + 0.25,
        twinkleSpeed: Math.random() * 0.022 + 0.006,
        phase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        hasCross: Math.random() > 0.88
      }));

      this.fireflies = Array.from({ length: fireflyCount }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -Math.random() * 0.24 - 0.06,
        size: Math.random() * 10 + 10,
        phase: Math.random() * Math.PI * 2,
        sprite: Math.random() > 0.45 ? this.sprites.flyGold : this.sprites.flyLavender
      }));

      this.petals = Array.from({ length: petalCount }, () => this.createPetal(true));
    }

    createPetal(randomY = false) {
      const sprite = this.sprites.petals[Math.floor(Math.random() * this.sprites.petals.length)];
      return {
        x: Math.random() * this.width,
        y: randomY ? Math.random() * this.height : -24,
        vx: Math.random() * 0.55 + 0.18,
        vy: Math.random() * 0.52 + 0.28,
        scale: Math.random() * 0.55 + 0.65,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.024,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: Math.random() * 0.65 + 0.25,
        sprite
      };
    }

    spawnInteractionBurst(clientX, clientY, count = 12) {
      const base = this.isMobile ? Math.ceil(count * 0.7) : count;
      const effectiveCount = this.calmMode ? Math.ceil(base / 2) : base;
      for (let i = 0; i < effectiveCount; i++) {
        const angle = (Math.PI * 2 * i) / effectiveCount + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 2.2 + 0.9;
        this.burstPetals.push({
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          scale: Math.random() * 0.45 + 0.55,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.06,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
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
        if (!document.hidden) {
          const dt = Math.min((now - this.lastTime) / 16.666, 2.5);
          this.lastTime = now;
          this.updateAndDraw(dt);
        } else {
          this.lastTime = now;
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    updateAndDraw(dt) {
      const speedFactor = this.calmMode ? 0.35 : 1;

      // 1. Campo estelar y luciérnagas pre-renderizadas
      const sCtx = this.starCtx;
      sCtx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        star.phase += star.twinkleSpeed * dt * speedFactor;
        const alpha = Math.max(0.14, star.baseAlpha + Math.sin(star.phase) * 0.28);

        sCtx.globalAlpha = alpha;
        sCtx.fillStyle = star.color;
        sCtx.beginPath();
        sCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        sCtx.fill();

        if (star.hasCross && alpha > 0.58) {
          sCtx.strokeStyle = star.color;
          sCtx.lineWidth = 0.6;
          const len = star.radius * 4;
          sCtx.beginPath();
          sCtx.moveTo(star.x - len, star.y);
          sCtx.lineTo(star.x + len, star.y);
          sCtx.moveTo(star.x, star.y - len);
          sCtx.lineTo(star.x, star.y + len);
          sCtx.stroke();
        }
      }

      for (let i = 0; i < this.fireflies.length; i++) {
        const fly = this.fireflies[i];
        fly.phase += 0.025 * dt * speedFactor;
        fly.x += (fly.vx + Math.sin(fly.phase) * 0.16) * dt * speedFactor;
        fly.y += fly.vy * dt * speedFactor;

        if (fly.y < -16) {
          fly.y = this.height + 16;
          fly.x = Math.random() * this.width;
        }
        if (fly.x < -16) fly.x = this.width + 16;
        if (fly.x > this.width + 16) fly.x = -16;

        sCtx.globalAlpha = 0.35 + (Math.sin(fly.phase * 1.4) + 1) * 0.3;
        const half = fly.size * 0.5;
        sCtx.drawImage(fly.sprite, fly.x - half, fly.y - half, fly.size, fly.size);
      }
      sCtx.globalAlpha = 1;

      // 2. Pétalos flotantes y ráfagas locales
      const pCtx = this.petalsCtx;
      pCtx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.petals.length; i++) {
        const petal = this.petals[i];
        petal.swayPhase += 0.018 * dt * speedFactor;
        petal.x += (petal.vx + Math.sin(petal.swayPhase) * petal.swayAmp) * dt * speedFactor;
        petal.y += petal.vy * dt * speedFactor;
        petal.rotation += petal.rotSpeed * dt * speedFactor;

        if (petal.y > this.height + 24 || petal.x > this.width + 24) {
          Object.assign(petal, this.createPetal(false));
          petal.x = Math.random() * this.width * 0.9;
        }

        const sz = 28 * petal.scale;
        pCtx.save();
        pCtx.translate(petal.x, petal.y);
        pCtx.rotate(petal.rotation);
        pCtx.drawImage(petal.sprite, -sz / 2, -sz / 2, sz, sz);
        pCtx.restore();
      }

      for (let i = this.burstPetals.length - 1; i >= 0; i--) {
        const bp = this.burstPetals[i];
        bp.x += bp.vx * dt;
        bp.y += bp.vy * dt;
        bp.vy += 0.025 * dt;
        bp.vx *= 0.985;
        bp.rotation += bp.rotSpeed * dt;
        bp.alpha -= bp.decay * dt;

        if (bp.alpha <= 0.02) {
          this.burstPetals.splice(i, 1);
          continue;
        }

        pCtx.globalAlpha = bp.alpha;
        if (bp.isSpark) {
          const sz = 18 * bp.scale;
          pCtx.drawImage(this.sprites.sparkGold, bp.x - sz / 2, bp.y - sz / 2, sz, sz);
        } else {
          const sz = 28 * bp.scale;
          pCtx.save();
          pCtx.translate(bp.x, bp.y);
          pCtx.rotate(bp.rotation);
          pCtx.drawImage(this.sprites.burstPetal, -sz / 2, -sz / 2, sz, sz);
          pCtx.restore();
        }
      }
      pCtx.globalAlpha = 1;
    }
  }

  window.EternalBloom.CelestialAtmosphere = CelestialAtmosphere;
})();
