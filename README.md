# ETERNAL BLOOM
**Una experiencia digital creada para iluminar un día especial**

## Estructura del Proyecto
```text
/eternal-bloom
│
├── index.html
├── README.md
├── css/
│   ├── main.css
│   ├── animations.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   ├── fireworks.js
│   ├── flowers.js
│   ├── particles.js
│   ├── interactions.js
│   └── animations.js
│
└── assets/
    ├── images/
    │   └── celestial-crest.svg
    ├── fonts/
    │   └── typography-notes.txt
    └── icons/
        └── lotus-favicon.svg
```

## Cómo ejecutarlo
1. Descomprime la carpeta `eternal-bloom`.
2. Abre `index.html` directamente en cualquier navegador moderno (Chrome, Edge, Safari, Firefox) o sírvelo con Live Server / cualquier servidor local.
3. No requiere instalación de dependencias ni compilación previa.

## Características Principales
- **Pantalla inicial cinematográfica**: Transición con desenfoque y profundidad controlada por GSAP al presionar *"Descubrir este pequeño universo"*.
- **Espectáculo de fuegos artificiales en Canvas 2D**: Cohetes ascendentes y 4 patrones de explosión (*Chrysanthemum, Willow, Peony, Starlight*) con física de gravedad y estelas luminosas.
- **Jardín floral procedural SVG**: Rosas, flores de loto de apertura gradual, margaritas y flores silvestres luminosas interactivas.
- **Interacciones sensoriales**: Estrellas clicables con mensajes positivos, luna que cambia la atmósfera lumínica del cielo, tarjetas de recordatorios iluminables y gran final con apertura de loto y fuegos artificiales.
- **Accesibilidad y rendimiento**: Soporte automático y manual para `prefers-reduced-motion` (Modo Calma) y escalado adaptativo de Canvas (`devicePixelRatio`).
