/**
 * ETERNAL BLOOM — Espectáculo Coreografiado de Fuegos Artificiales de Alto Rendimiento (Canvas 2D)
 * Sustituye shadowBlur por texturas luminosas pre-renderizadas en memoria para lograr 60 FPS fluidos
 * tanto en computadoras como en teléfonos móviles.
 */
(function () {
  "use strict";

  window.EternalBloom = window.EternalBloom || {};

  class CelestialFireworks {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: true });
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.isMobile = this.width < 768;
      this.dpr = this.getOptimalDPR();

      this.rockets = [];
      this.sparks = [];
      this.running = false;
      this.lastTime = 0;
      this.ambientTimer = 0;
      this.nextAmbientInterval = 3600;
      this.ambientEnabled = false;
      this.calmMode = false;

      this.palettes = [
        ["#ebd09e", "#f9e8c7", "#f8f6fc"],
        ["#f4b8ce", "#ebd09e", "#f8f6fc"],
        ["#c8b6ff", "#f4b8ce", "#f8f6fc"],
        ["#ebd09e", "#c8b6ff", "#a9c5ff"]
      ];

      this.sparkSprites = this.buildSparkSprites();
      this.resize();
      this.bindEvents();
    }

    getOptimalDPR() {
      const raw = window.devicePixelRatio || 1;
      return this.width < 768 ? Math.min(raw, 1.25) : Math.min(raw, 1.5);
    }

    /**
     * Pre-renderiza un resplandor circular suave por color (evita el costoso ctx.shadowBlur en cada frame)
     */
    buildSparkSprites() {
      const colors = ["#ebd09e", "#f9e8c7", "#f8f6fc", "#f4b8ce", "#c8b6ff", "#a9c5ff"];
      const cache = {};
      const size = 36;
      const half = size / 2;

      colors.forEach((hex) => {
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");

        const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.22, hex);
        grad.addColorStop(0.55, `${hex}66`);
        grad.addColorStop(1, `${hex}00`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        cache[hex] = c;
      });

      return cache;
    }

    bindEvents() {
      let timer = null;
      window.addEventListener("resize", () => {
        clearTimeout(timer);
        timer = setTimeout(() => this.resize(), 180);
      });
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.isMobile = this.width < 768;
      this.dpr = this.getOptimalDPR();

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    setAmbientEnabled(enabled) {
      this.ambientEnabled = Boolean(enabled);
    }

    setCalmMode(enabled) {
      this.calmMode = Boolean(enabled);
    }

    launchRocket(targetX = null, targetY = null, scale = 1) {
      const maxSparks = this.isMobile ? 280 : 480;
      if (this.sparks.length > maxSparks) return;

      const startX = targetX !== null
        ? targetX + (Math.random() - 0.5) * 90
        : this.width * (0.18 + Math.random() * 0.64);
      const destX = targetX !== null ? targetX : startX + (Math.random() - 0.5) * 110;
      const destY = targetY !== null
        ? targetY
        : this.height * (0.14 + Math.random() * 0.28);

      const palette = this.palettes[Math.floor(Math.random() * this.palettes.length)];
      const patterns = ["chrysanthemum", "willow", "peony", "starlight"];
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];

      const mobileScale = this.isMobile ? 0.85 : 1;

      this.rockets.push({
        x: startX,
        y: this.height + 10,
        startX,
        startY: this.height + 10,
        destX,
        destY,
        progress: 0,
        speed: (0.015 + Math.random() * 0.005) * (this.calmMode ? 0.82 : 1),
        trail: [],
        palette,
        pattern,
        scale: (this.calmMode ? scale * 0.78 : scale) * mobileScale
      });
    }

    launchChoreography(count = 5, spreadDelay = 420) {
      const baseCount = this.isMobile ? Math.max(3, Math.ceil(count * 0.7)) : count;
      const actualCount = this.calmMode ? Math.max(2, Math.floor(baseCount * 0.6)) : baseCount;

      for (let i = 0; i < actualCount; i++) {
        setTimeout(() => {
          const ratio = (i + 1) / (actualCount + 1);
          const x = this.width * (0.16 + ratio * 0.68 + (Math.random() - 0.5) * 0.08);
          const y = this.height * (0.14 + (i % 2) * 0.09 + Math.random() * 0.08);
          const scale = i === Math.floor(actualCount / 2) ? 1.18 : 0.92 + Math.random() * 0.2;
          this.launchRocket(x, y, scale);
        }, i * spreadDelay);
      }
    }

    explode(rocket) {
      const { destX, destY, palette, pattern, scale } = rocket;
      const baseCount = this.isMobile
        ? (pattern === "peony" ? 44 : 36)
        : (pattern === "willow" ? 54 : pattern === "peony" ? 62 : 48);
      const count = Math.floor(baseCount * scale);

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.08;
        let speed = (1.8 + Math.random() * 3.0) * scale;

        if (pattern === "peony" && i % 2 === 0) {
          speed *= 0.58;
        }

        const color = palette[i % palette.length];
        this.sparks.push({
          x: destX,
          y: destY,
          prevX: destX,
          prevY: destY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          drag: pattern === "willow" ? 0.955 : 0.968,
          gravity: pattern === "willow" ? 0.032 : 0.044,
          alpha: 1,
          decay: pattern === "willow"
            ? 0.0095 + Math.random() * 0.005
            : 0.013 + Math.random() * 0.007,
          size: (pattern === "starlight" ? 15 : 12) * scale,
          color,
          sprite: this.sparkSprites[color] || this.sparkSprites["#ebd09e"],
          twinkle: pattern === "starlight"
        });
      }
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.lastTime = performance.now();

      const loop = (now) => {
        if (!this.running) return;
        if (!document.hidden) {
          const dtMs = Math.min(now - this.lastTime, 42);
          const dt = dtMs / 16.666;
          this.lastTime = now;

          this.update(dt, dtMs);
          this.draw();
        } else {
          this.lastTime = now;
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    update(dt, dtMs) {
      if (this.ambientEnabled) {
        this.ambientTimer += dtMs;
        if (this.ambientTimer >= this.nextAmbientInterval) {
          this.ambientTimer = 0;
          this.nextAmbientInterval = (this.calmMode ? 6500 : this.isMobile ? 4600 : 3600) + Math.random() * 2400;
          this.launchRocket(null, null, 0.88 + Math.random() * 0.22);
        }
      }

      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.progress += r.speed * dt;
        const ease = 1 - Math.pow(1 - Math.min(r.progress, 1), 3);

        const prevX = r.x;
        const prevY = r.y;
        r.x = r.startX + (r.destX - r.startX) * ease + Math.sin(r.progress * Math.PI) * 12;
        r.y = r.startY + (r.destY - r.startY) * ease;

        r.trail.push({ x: prevX, y: prevY, alpha: 0.85 });
        if (r.trail.length > 7) r.trail.shift();
        for (let j = 0; j < r.trail.length; j++) {
          r.trail[j].alpha *= 0.86;
        }

        if (r.progress >= 1) {
          this.explode(r);
          this.rockets.splice(i, 1);
        }
      }

      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];
        s.prevX = s.x;
        s.prevY = s.y;

        const dragFactor = Math.pow(s.drag, dt);
        s.vx *= dragFactor;
        s.vy *= dragFactor;
        s.vy += s.gravity * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.alpha -= s.decay * dt;

        if (s.alpha <= 0.02) {
          this.sparks.splice(i, 1);
        }
      }
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      if (this.rockets.length === 0 && this.sparks.length === 0) return;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const headSprite = this.sparkSprites["#f9e8c7"];

      for (let i = 0; i < this.rockets.length; i++) {
        const r = this.rockets[i];
        for (let j = 0; j < r.trail.length; j++) {
          const t = r.trail[j];
          ctx.globalAlpha = t.alpha * 0.6;
          ctx.fillStyle = "#f9e8c7";
          ctx.fillRect(t.x - 1, t.y - 1, 2, 2);
        }

        ctx.globalAlpha = 0.95;
        ctx.drawImage(headSprite, r.x - 8, r.y - 8, 16, 16);
      }

      for (let i = 0; i < this.sparks.length; i++) {
        const s = this.sparks[i];
        const flicker = s.twinkle ? (0.68 + Math.random() * 0.32) : 1;
        const alpha = Math.max(0, s.alpha * flicker);

        // Estela ligera de movimiento (1 segmento en lugar de múltiples curvas)
        ctx.globalAlpha = alpha * 0.42;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(s.prevX, s.prevY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Resplandor luminoso pre-renderizado
        ctx.globalAlpha = alpha;
        const half = s.size * 0.5;
        ctx.drawImage(s.sprite, s.x - half, s.y - half, s.size, s.size);
      }

      ctx.restore();
    }
  }

  window.EternalBloom.CelestialFireworks = CelestialFireworks;
})();
