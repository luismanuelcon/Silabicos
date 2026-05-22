# Brief de Mejora de Diseño y Animaciones — SILABC

## 1. Resumen del Proyecto

**SILABC** es un juego web educativo gratuito para niños hispanohablantes de 4-6 años que enseña construcción de palabras mediante **dados silábicos animados**. El niño lanza un dado, obtiene una sílaba (ej. "MA"), y debe completar una palabra real en español arrastrando letras del alfabeto. Cada logro se celebra con animaciones — no hay errores, no hay "game over".

- **Stack**: React 19 + TypeScript + Vite + Framer Motion 12 + CSS Modules
- **Font**: Nunito (sans-serif redondeada, @fontsource)
- **Target**: Tablets/móviles en landscape, touch-first, niños pre-lectores
- **Restricción**: No backend, no login, no texto instructivo. Toda comunicación es visual/animada.

---

## 2. Arquitectura de Pantallas (flujo)

```
AvatarSelectScreen → NameInputScreen → WorldSelectScreen → GameplayScreen → SummaryScreen
                                                                ↑ (loop)
WelcomeScreen (returning player) → WorldSelectScreen → GameplayScreen → SummaryScreen
```

### Pantallas existentes:
| Pantalla | Propósito |
|----------|-----------|
| **AvatarSelectScreen** | Selección de avatar (mono 🐵, loro 🦜, rana 🐸). Grid circular. |
| **NameInputScreen** | Entrada opcional de nombre. Skip posible. |
| **WorldSelectScreen** | Selección de mundo (solo Selva activa, Granja/Océano bloqueados). |
| **GameplayScreen** | Pantalla principal: dado + zona de construcción + panel alfabeto + timer |
| **SummaryScreen** | Resumen de sesión: palabras completadas, avatar celebra |
| **WelcomeScreen** | Saludo a jugador recurrente con su avatar y nombre |

---

## 3. Componentes de Juego y Estado Actual de Animaciones

### 3.1 DiceRoller (Dado Silábico)
- **Actual**: `framer-motion` con rotateX/rotateY (720° en 0.8s), scale bounce [1, 0.85, 1], whileTap scale 0.95
- **CSS**: Cuadrado 80px (móvil 64px, desktop 100px), borde coral, radius 16px, shadow-md
- **Problemas**: 
  - No tiene animación idle (la spec pide micro-rotación lenta + glow pulsante)
  - La revelación es abrupta (no hay "sílaba sale del dado y vuela a zona de construcción")
  - Sin perspectiva 3D real del cubo
  - Sin spring physics con overshoot en la detención

### 3.2 LetterTile (Letras Arrastrables)
- **Actual**: Pointer events manuales con `framer-motion` animate (x, y, scale 1.1, rotate leve). Al soltar regresa a (0,0).
- **CSS**: 64px cuadrado, borde lavender, radius 12px, shadow-sm → shadow-drag al arrastrar
- **Problemas**:
  - No tiene "peso" visual ni cartoon physics (spec pide que se sientan como bloques físicos)
  - Sin scale up al primer contacto (spec: 1.1x + sombra elevada al contacto)
  - Sin snap magnético visual (spec: zona se "abre" al acercarse)
  - Sin animación de retorno satisfactoria cuando se suelta fuera de zona
  - Sin personalidad (Endless Alphabet style: letras que "pesan")

### 3.3 WordBuilder (Zona de Construcción)
- **Actual**: Slots dashed con letras colocadas. Animación entry: scale 0.5→1 con easing bounce.
- **CSS**: Background semi-transparente, radius-xl, shadow-sm. Syllable anclada en coral con ⚓
- **Problemas**:
  - La sílaba no tiene animación de "encaje pesado" al anclar (spec: cae con peso, rebota, se asienta)
  - Los slots vacíos no brillan invitando
  - Sin glow progresivo de proximidad a palabra válida
  - Sin wobble cuando se intenta mover la sílaba fija
  - El encaje de letras no tiene "snap magnético" satisfactorio

### 3.4 Celebration (Celebración)
- **Actual**: Overlay con confetti de emojis (8 partículas dispersándose), word reveal con spring scale, checkmark ✅. Duración 2s.
- **CSS**: Overlay fijo semi-transparente, flash amarillo de 500ms
- **Problemas**:
  - Solo 8 partículas — se siente escaso para "explosión de colores"
  - No hay variedad de celebraciones (spec pide 4-5 tipos rotando para evitar habituación)
  - No hay avatar bailando/saltando integrado en la celebración
  - La palabra no "cobra vida" ni crece con dramatismo suficiente
  - No hay secuencia temporal elaborada (spec: brilla → confetti → avatar baila → palabra vuela)
  - La session-end celebration es idéntica en estructura, solo más larga

### 3.5 SessionTimer (Temporizador)
- **Actual**: Un emoji ☀️ que se mueve en un arco punteado de izquierda a derecha usando `will-change: left, bottom`
- **CSS**: Arco con borde dashed amarillo translúcido
- **Problemas**:
  - Sin animación suave del sol (spec: "sol moviéndose en el cielo")
  - El arco es poco atractivo visualmente
  - Podría tener gradiente de cielo o transición de colores (amanecer → mediodía → atardecer)

### 3.6 VisualHint (Sugerencias)
- **Actual**: Un emoji de animal (🐵💭) con background semi-transparente
- **CSS**: Flexbox centrado, padding, radius-lg, shadow-sm
- **Problemas**:
  - Es estático — sin animación de aparición/desaparición suave
  - No comunica progresión (spec: avatar con ojos brillantes, inclina cabeza)
  - Podría ser más sutil y orgánico

### 3.7 AvatarCard (Selección de Avatar)
- **Actual**: Circulares 120px con borde transparente → coral al seleccionar, shadow-glow
- **CSS**: Transición de shadow y border-color con duration-normal
- **Problemas**:
  - Sin animación de celebración al seleccionar (spec: "avatar celebra selección")
  - Sin micro-animaciones de idle (avatares respirando o parpadeando)
  - Los SVG de avatares son estáticos

### 3.8 ScreenManager (Transiciones entre pantallas)
- **Actual**: AnimatePresence con slide (20px) + fade, duración 0.3s, easing smooth
- **Problemas**:
  - Transiciones muy sutiles/genéricas (spec: "transiciones que entretienen")
  - Sin variación por contexto (entrar a gameplay debería sentirse diferente a volver a menú)
  - Sin scale sutil adicional

### 3.9 AlphabetPanel
- **Actual**: Grid responsivo de LetterTiles, sin animaciones propias
- **CSS**: Flex wrap con gap, background semi-transparente
- **Problemas**:
  - Las letras no tienen entrada escalonada (staggered) al aparecer
  - Sin feedback de qué letras ya fueron usadas (podrían atenuarse suavemente)

### 3.10 HomeButton
- **Actual**: Botón circular fijo top-right, scale 1.05 en :active
- **Problemas**:
  - Muy discreto. Spec dice opacity 0.7 (correcto), pero sin animación de hover/idle

---

## 4. Design Tokens Actuales (tokens.css)

```css
/* Paleta: cream, coral, mint, lavender, sun, sky + mundo selva */
/* Timing: fast 100ms, normal 200ms, slow 300ms, dice 800ms */
/* Easing: bounce cubic-bezier(0.34, 1.56, 0.64, 1), smooth cubic-bezier(0.4, 0, 0.2, 1) */
/* Touch: min 48px, game 56px, letter 64px, dice 80px */
/* Radius: sm 8px, md 12px, lg 16px, xl 24px, full 9999px */
/* Shadows: sm, md, lg, glow (coral), drag */
```

---

## 5. Assets Visuales Actuales

- **Avatares**: 3 SVGs estáticos (avatar-mono.svg, avatar-loro.svg, avatar-rana.svg)
- **Mundos**: Solo .gitkeep — sin assets de fondo para mundos
- **Sin**: Ilustraciones de fondo, decoraciones temáticas, partículas custom, sprites animados

---

## 6. Lo que la Spec UX Pide vs. Lo Implementado

| Aspecto | Spec UX Pide | Estado Actual | Prioridad |
|---------|--------------|---------------|-----------|
| **Dado idle** | Micro-rotación lenta + glow pulsante cada 3s | Sin idle animation | 🔴 Alta |
| **Dado revelación** | Sílaba "sale" del dado y vuela a zona | Sílaba aparece instantáneamente en WordBuilder | 🔴 Alta |
| **Cartoon physics** | Bounce, overshoot, spring en TODO | Solo en dado roll y letter entry | 🔴 Alta |
| **Celebración variada** | 4-5 tipos rotando | 1 solo tipo (emojis dispersos) | 🔴 Alta |
| **Avatar reactivo** | Idle, curioso, celebra según estado | Emoji estático 🐵 | 🔴 Alta |
| **Snap magnético** | Zona "se abre" al acercarse con letra | Sin feedback de proximidad drag | 🟡 Media |
| **Glow de proximidad** | Brillo progresivo al acercarse a palabra | Sin implementar | 🟡 Media |
| **Idle hints** | 5s→avatar gesto, 10s→dado wobble, 20s→señala | Sin implementar | 🟡 Media |
| **Transiciones elaboradas** | Slide + fade + scale con personalidad | Slide 20px + fade genérico | 🟡 Media |
| **Letras con peso** | Scale al contacto, sombra elevada, snap | Solo scale 1.1 al drag | 🟡 Media |
| **Timer visual rico** | Sol con gradiente de cielo, transición de color | Sol emoji sobre arco dashed | 🟢 Baja |
| **Stagger de alfabeto** | Letras aparecen con delay escalonado | Todas aparecen instantáneamente | 🟢 Baja |
| **Fondo temático** | Selva con vegetación, animales ambientales | Solo gradient verde plano | 🟢 Baja |
| **Entrada staggered** | Componentes de pantalla entran secuencialmente | Todo entra junto | 🟢 Baja |

---

## 7. Principios de Diseño a Respetar

1. **Cero texto instructivo** — Todo se comunica con animación, color, posición
2. **El error no existe** — Solo "explorando", "acercándose", "¡lo logró!"
3. **Cartoon physics** — Bounce, overshoot, spring. NUNCA lineal
4. **Celebrar > Instruir** — Ante la duda, más celebración
5. **Touch targets grandes** — Mínimo 48px, juego 56-64px, dado 80px+
6. **Pastel saturado** — Colores vivos pero no agresivos sobre fondo crema
7. **Bordes ultra-redondeados** — 16-24px radius en todo
8. **prefers-reduced-motion** — Respetar siempre con fallback funcional

---

## 8. Áreas Prioritarias de Mejora

### A. Animaciones Críticas Faltantes
1. **Dado idle + revelación dramatizada** — El corazón de la experiencia
2. **Avatar animado reactivo** — Pasar de emoji estático a personaje vivo (SVG animado o Lottie)
3. **Celebraciones variadas y explosivas** — Más partículas, tipos variados, avatar integrado
4. **Snap magnético visual** — Drag & drop debe sentirse como bloques físicos

### B. Mejoras de Diseño Visual
1. **Fondos temáticos por mundo** — Selva con vegetación, capas parallax suaves
2. **Dado con apariencia 3D real** — Faces del cubo con perspectiva, no solo rotación plana
3. **Letras con más personalidad** — Colores alternados, micro-shadows individuales
4. **Zona de construcción más invitante** — Glow, pulso en slots vacíos, bandeja con profundidad

### C. Micro-interacciones Faltantes
1. **Hover/touch feedback** — Scale 1.05 + elevación inmediata en TODO lo tocable
2. **Idle system** — Sistema progresivo de invitaciones cuando el niño no interactúa
3. **Transiciones contextuales** — Diferentes animaciones para avanzar vs. retroceder
4. **Letter return** — Animación satisfactoria cuando una letra vuelve al panel

---

## 9. Constraints Técnicos

- **Bundle < 500KB gzipped** — Cuidado con assets pesados
- **Framer Motion 12** — Ya instalado, usar para orquestar animaciones
- **CSS Modules** — Sin CSS-in-JS adicional ni Tailwind
- **Sin Lottie actualmente** — Si se agrega, considerar impacto en bundle
- **60fps en tablets gama media-baja** — Optimizar con `will-change`, GPU layers
- **prefers-reduced-motion** — Obligatorio en toda animación
- **Mobile landscape mínimo 568px** — Diseño responsive obligatorio

---

## 10. Referentes de Diseño (inspiración)

| Producto | Qué Tomar |
|----------|-----------|
| **Toca Boca** | Cartoon physics, paleta saturada pastel, zero texto, exploración sin castigo |
| **Endless Alphabet** | Letras como objetos con personalidad física, drag & drop como juego |
| **Khan Academy Kids** | Avatar como guía no verbal, celebraciones variadas, transiciones suaves |
| **Duolingo** | Micro-interacciones en cada tap, progreso visual inmediato, enseñar haciendo |
| **Fisher-Price digital** | Suavidad, bordes redondeados, colores amables, sensación de juguete |

---

## 11. Estructura de Archivos Relevantes

```
src/
├── styles/
│   ├── tokens.css          ← Design tokens (colores, spacing, timing, easing)
│   └── reset.css           ← CSS reset
├── components/
│   ├── DiceRoller/         ← Dado silábico (TSX + CSS Module)
│   ├── LetterTile/         ← Letra arrastrable (TSX + CSS Module)
│   ├── WordBuilder/        ← Zona de construcción (TSX + CSS Module)
│   ├── AlphabetPanel/      ← Panel de letras (TSX + CSS Module)
│   ├── Celebration/        ← Overlay de celebración (TSX + CSS Module)
│   ├── SessionTimer/       ← Temporizador visual (TSX + CSS Module)
│   ├── VisualHint/         ← Sugerencias sutiles (TSX + CSS Module)
│   ├── AvatarCard/         ← Card de avatar (TSX + CSS Module)
│   ├── WorldCard/          ← Card de mundo (TSX + CSS Module)
│   ├── ScreenManager/      ← Transiciones entre pantallas (TSX + CSS Module)
│   ├── HomeButton/         ← Botón casita (TSX + CSS Module)
│   └── OrientationOverlay/ ← Indicador de rotación (TSX + CSS Module)
├── screens/
│   ├── AvatarSelectScreen/
│   ├── NameInputScreen/
│   ├── WorldSelectScreen/
│   ├── GameplayScreen/
│   ├── SummaryScreen/
│   └── WelcomeScreen/
└── assets/
    ├── avatars/            ← 3 SVGs estáticos (mono, loro, rana)
    └── worlds/             ← Vacío
```
