# ETERNAL BLOOM (Edición Optimizada 60 FPS)
**Una experiencia digital creada para iluminar un día especial**

## Mejoras de Rendimiento Incluidas
- **Texturas luminosas pre-renderizadas en Canvas 2D**: Se eliminó `ctx.shadowBlur` y `createRadialGradient` dentro del bucle de animación de fuegos artificiales y luciérnagas, manteniendo exactamente el mismo brillo dorado/lavanda pero con un consumo mínimo de CPU/GPU.
- **Escalado adaptativo de resolución (`devicePixelRatio`)**: Ajustado automáticamente para pantallas Retina/4K y teléfonos móviles.
- **Composición CSS acelerada por hardware**: Eliminación de desenfoques pesados (`backdrop-filter`) sobre los lienzos animados en dispositivos móviles.
- **Modo Calma**: Botón integrado (y detección automática de `prefers-reduced-motion`) para reducir aún más el movimiento cuando se desee.

## Cómo ejecutarlo
1. Descomprime `eternal-bloom-v2.zip`.
2. Abre `eternal-bloom/index.html` en tu navegador (PC o celular).
