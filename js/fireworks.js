/**
 * ETERNAL BLOOM — Espectáculo Coreografiado de Fuegos Artificiales (Canvas 2D)
 */
(function () {
  "use strict";

  window.EternalBloom = window.EternalBloom || {};

  class CelestialFireworks {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.rockets = [];
      this.sparks = [];
      this.running = false;
      this.lastTime = 0;
      this.ambientTimer = 0;
      this.nextAmbientInterval = 3400;
      this.ambientEnabled = false;
      this.calmMode = false;

      // Paleta elegante y armoniosa (sin tonos neón agresivos)
      this.palettes = [
        ["#ebd09e", "#f9e8c7", "#f8f6fc"], // Champagne y perla
        ["#f4b8ce", "#ebd09e", "#f8f6fc"], // Rosa pétalo y oro suave
        ["#c8b6ff", "#f4b8ce", "#f8f6fc"], // Lavanda y rosa
        ["#ebd09e", "#c8b6ff", "#a9c5ff"]  // Dorado celestial y azul noche claro
      ];

      this.resize();
      this.bindEvents();
    }

    bindEvents() {
      let timer = null;
      window.addEventListener("resize", () => {
        clearTimeout(timer);
        timer = setTimeout(() => this.resize(), 160);
      });
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
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

    /**
     * Lanza un cohete luminoso hacia una coordenada objetivo en el cielo superior
     */
    launchRocket(targetX = null, targetY = null, scale = 1) {
      if (this.sparks.length > 900) return; // Protección de rendimiento

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

      this.rockets.push({
        x: startX,
        y: this.height + 10,
        startX,
        startY: this.height + 10,
        destX,
        destY,
        progress: 0,
        speed: (0.014 + Math.random() * 0.005) * (this.calmMode ? 0.82 : 1),
        trail: [],
        palette,
        pattern,
        scale: this.calmMode ? scale * 0.78 : scale
      });
    }

    /**
     * Coreografía escalonada de múltiples fuegos artificiales
     */
    launchChoreography(count = 5, spreadDelay = 420) {
      const actualCount = this.calmMode ? Math.max(2, Math.floor(count * 0.6)) : count;
      for (let i = 0; i < actualCount; i++) {
        setTimeout(() => {
          const ratio = (i + 1) / (actualCount + 1);
          const x = this.width * (0.16 + ratio * 0.68 + (Math.random() - 0.5) * 0.08);
          const y = this.height * (0.14 + (i % 2) * 0.09 + Math.random() * 0.08);
          const scale = i === Math.floor(actualCount / 2) ? 1.22 : 0.92 + Math.random() * 0.22;
          this.launchRocket(x, y, scale);
        }, i * spreadDelay);
      }
    }

    explode(rocket) {
      const { destX, destY, palette, pattern, scale } = rocket;
      const baseCount = pattern === "willow" ? 68 : pattern === "peony" ? 76 : 60;
      const count = Math.floor(baseCount * scale);

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.08;
        let speed = (1.8 + Math.random() * 3.1) * scale;

        if (pattern === "peony" && i % 2 === 0) {
          speed *= 0.58; // Doble anillo interior y exterior
        }

        const color = palette[i % palette.length];
        this.sparks.push({
          x: destX,
          y: destY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          drag: pattern === "willow" ? 0.955 : 0.968,
          gravity: pattern === "willow" ? 0.032 : 0.044,
          alpha: 1,
          decay: pattern === "willow"
            ? 0.0085 + Math.random() * 0.005
            : 0.012 + Math.random() * 0.007,
          size: (pattern === "starlight" ? 2.3 : 1.85) * scale,
          color,
          twinkle: pattern === "starlight",
          history: []
        });
      }
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.lastTime = performance.now();

      const loop = (now) => {
        if (!this.running) return;
        const dtMs = Math.min(now - this.lastTime, 42);
        const dt = dtMs / 16.666;
        this.lastTime = now;

        this.update(dt, dtMs);
        this.draw();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    update(dt, dtMs) {
      // Lanzamientos ambientales pausados y progresivos
      if (this.ambientEnabled && !document.hidden) {
        this.ambientTimer += dtMs;
        if (this.ambientTimer >= this.nextAmbientInterval) {
          this.ambientTimer = 0;
          this.nextAmbientInterval = (this.calmMode ? 6200 : 3600) + Math.random() * 2400;
          this.launchRocket(null, null, 0.88 + Math.random() * 0.25);
        }
      }

      // Actualizar cohetes ascendentes
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.progress += r.speed * dt;
        const ease = 1 - Math.pow(1 - Math.min(r.progress, 1), 3);

        const prevX = r.x;
        const prevY = r.y;
        r.x = r.startX + (r.destX - r.startX) * ease + Math.sin(r.progress * Math.PI) * 12;
        r.y = r.startY + (r.destY - r.startY) * ease;

        r.trail.push({ x: prevX, y: prevY, alpha: 0.85 });
        if (r.trail.length > 10) r.trail.shift();
        for (const t of r.trail) t.alpha *= 0.88;

        if (r.progress >= 1) {
          this.explode(r);
          this.rockets.splice(i, 1);
        }
      }

      // Actualizar partículas de explosión
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];
        s.history.push({ x: s.x, y: s.y });
        if (s.history.length > 5) s.history.shift();

        s.vx *= Math.pow(s.drag, dt);
        s.vy *= Math.pow(s.drag, dt);
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

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Estelas de cohetes
      for (const r of this.rockets) {
        for (let i = 0; i < r.trail.length; i++) {
          const t = r.trail[i];
          ctx.globalAlpha = t.alpha * 0.65;
          ctx.fillStyle = "#f9e8c7";
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 0.95;
        ctx.fillStyle = "#fffdf8";
        ctx.shadowColor = "#ebd09e";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Partículas luminosas y destellos
      for (const s of this.sparks) {
        const flicker = s.twinkle ? (0.65 + Math.random() * 0.35) : 1;
        const alpha = Math.max(0, s.alpha * flicker);

        if (s.history.length > 1) {
          ctx.globalAlpha = alpha * 0.45;
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.size * 0.85;
          ctx.beginPath();
          ctx.moveTo(s.history[0].x, s.history[0].y);
          for (let j = 1; j < s.history.length; j++) {
            ctx.lineTo(s.history[j].x, s.history[j].y);
          }
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  window.EternalBloom.CelestialFireworks = CelestialFireworks;
})();
