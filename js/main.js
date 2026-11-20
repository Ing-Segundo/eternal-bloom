/**
 * ETERNAL BLOOM — Orquestador Principal de la Experiencia Digital
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const {
      CelestialAtmosphere,
      CelestialFireworks,
      BotanicalGarden,
      CelestialInteractions,
      CelestialChoreography
    } = window.EternalBloom;

    const starCanvas = document.getElementById("starfield-canvas");
    const petalsCanvas = document.getElementById("petals-canvas");
    const fireworksCanvas = document.getElementById("fireworks-canvas");

    const atmosphere = new CelestialAtmosphere(starCanvas, petalsCanvas);
    atmosphere.start();

    const fireworks = new CelestialFireworks(fireworksCanvas);
    fireworks.start();

    const garden = new BotanicalGarden();

    const heroStrip = document.getElementById("hero-garden-strip");
    garden.renderMeadow(heroStrip, [
      { type: "glow", scale: 0.88, label: "Flor silvestre luminosa", message: "Pequeñas luces acompañan cada paso que das." },
      { type: "rose-pink", scale: 0.92, label: "Rosa pétalo nocturna", message: "La delicadeza también es una forma de fortaleza." },
      { type: "daisy", scale: 0.85, label: "Margarita lunar", message: "Los gestos sencillos tienen el poder de alegrar el alma." },
      { type: "lotus", scale: 0.95, open: true, label: "Flor de loto serena", message: "Incluso en aguas quietas florece una belleza extraordinaria." },
      { type: "rose-lavender", scale: 0.9, label: "Rosa lavanda", message: "Que la calma encuentre siempre un lugar junto a ti." },
      { type: "glow", scale: 0.84, label: "Flor de destellos", message: "Hay luz reservada para tus días más tranquilos." }
    ]);

    const mainMeadow = document.getElementById("main-floral-meadow");
    garden.renderMeadow(mainMeadow, [
      { type: "rose-lavender", scale: 1.02, label: "Rosa lavanda del santuario", message: "Respira hondo: mereces paz en medio de cualquier tormenta." },
      { type: "glow", scale: 1.05, label: "Espiga luminosa", message: "Cada pequeño avance cuenta, incluso cuando nadie lo nota." },
      { type: "daisy", scale: 0.98, label: "Margarita perlada", message: "Tu sonrisa tiene una forma única de iluminar los días." },
      { type: "lotus", scale: 1.24, open: false, label: "Flor de loto principal: presiona para abrir", message: "El loto abre sus pétalos recordándote todo lo bonito que hay en ti." },
      { type: "rose-pink", scale: 1.08, label: "Rosa champagne", message: "Nunca dudes del valor inmenso que tiene tu presencia." },
      { type: "glow", scale: 1.0, label: "Flor de rocío estelar", message: "Siempre hay motivos nuevos esperando florecer en tu camino." },
      { type: "daisy", scale: 0.92, label: "Margarita de medianoche", message: "Permítete descansar y recibir cosas bonitas sin culpa." }
    ]);

    const finaleLotusMount = document.getElementById("finale-lotus-mount");
    if (finaleLotusMount) {
      finaleLotusMount.innerHTML = garden.createLotusSVG(1.18, false);
    }

    const interactions = new CelestialInteractions({ atmosphere, fireworks });
    interactions.init();

    const choreography = new CelestialChoreography({ fireworks, atmosphere });
    choreography.init();
  });
})();
