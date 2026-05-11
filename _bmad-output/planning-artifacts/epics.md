---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: complete
completedAt: '2026-05-11'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# SILABC - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for SILABC, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR1:** El niño puede seleccionar un avatar animal de entre 3-5 opciones disponibles.
- **FR2:** El avatar seleccionado reacciona con una animación de celebración al ser elegido.
- **FR3:** El niño puede ingresar opcionalmente un nombre mediante entrada simplificada.
- **FR4:** El sistema reconoce a un jugador recurrente y muestra su avatar, nombre y progreso acumulado.
- **FR5:** Un jugador nuevo accede directamente al flujo de selección de avatar sin pasos previos.
- **FR6:** El niño puede acceder al mundo Selva desde la pantalla principal.
- **FR7:** El sistema muestra un indicador visual amigable para rotar el dispositivo si está en orientación vertical.
- **FR8:** El niño puede volver a la pantalla de inicio desde cualquier punto del juego.
- **FR9:** El niño puede lanzar el dado silábico tocándolo.
- **FR10:** El dado muestra una animación de giro al ser lanzado.
- **FR11:** El dado genera una sílaba directa (consonante + vocal) acorde al mundo Selva.
- **FR12:** La sílaba generada se coloca automáticamente en la zona de construcción como pieza obligatoria.
- **FR13:** El niño puede arrastrar letras del alfabeto disponible a la zona de construcción.
- **FR14:** El niño puede posicionar letras antes o después de la sílaba obligatoria.
- **FR15:** El niño puede remover letras ya colocadas de la zona de construcción.
- **FR16:** El alfabeto completo está disponible sin restricción de cantidad de letras.
- **FR17:** La sílaba del dado permanece fija como parte obligatoria de la palabra en construcción.
- **FR18:** El sistema valida automáticamente la combinación contra el diccionario embebido.
- **FR19:** Cuando la combinación forma una palabra válida, el sistema muestra una celebración animada con el avatar del niño.
- **FR20:** Cuando la combinación se acerca a una palabra válida, el sistema muestra una sugerencia visual sutil.
- **FR21:** El sistema nunca muestra mensajes de error, fallo o penalización.
- **FR22:** Cada sílaba generada por el dado tiene al menos 3 palabras formables del vocabulario objetivo.
- **FR23:** El sistema muestra un temporizador visual suave (metáfora visual, no numérico) durante la sesión de juego.
- **FR24:** Al agotarse el temporizador, el sistema celebra lo logrado en lugar de penalizar.
- **FR25:** Al finalizar la sesión, el sistema muestra una pantalla de resumen con las palabras completadas y el avatar celebrando.
- **FR26:** El sistema guarda el progreso del jugador en LocalStorage del dispositivo.
- **FR27:** El sistema persiste las últimas 20 palabras completadas.
- **FR28:** El sistema persiste el avatar seleccionado, nombre y progreso acumulado entre sesiones.
- **FR29:** Al completar una palabra nueva (no repetida), el sistema la marca como nueva en el resumen.
- **FR30:** El diccionario contiene exclusivamente palabras apropiadas para niños de 4-6 años.
- **FR31:** El sistema no contiene enlaces externos, publicidad ni formularios de recolección de datos.
- **FR32:** El sistema no realiza comunicación de red durante el gameplay una vez cargado.

### NonFunctional Requirements

- **NFR1:** First Contentful Paint < 1.5 segundos en conexión 3G.
- **NFR2:** Time to Interactive < 3.0 segundos en conexión 3G.
- **NFR3:** Total bundle size < 500KB gzipped (incluido diccionario).
- **NFR4:** Animaciones de juego a 60fps constantes en dispositivos con ≥ 2GB RAM.
- **NFR5:** Respuesta visual a interacciones de drag & drop < 16ms (un frame).
- **NFR6:** Validación de palabra contra diccionario < 50ms.
- **NFR7:** Lighthouse Performance score ≥ 90.
- **NFR8:** La aplicación no transmite datos a ningún servidor durante o después del gameplay.
- **NFR9:** No se incluyen scripts de terceros (analytics, ads, tracking).
- **NFR10:** El diccionario embebido es revisado manualmente y no contiene palabras inapropiadas para menores.
- **NFR11:** No existen enlaces que dirijan al usuario fuera de la aplicación.
- **NFR12:** Content Security Policy (CSP) configurada para bloquear recursos externos.
- **NFR13:** Todas las áreas interactivas tienen un tamaño mínimo de 48x48px.
- **NFR14:** Contraste de color ≥ 3:1 para elementos interactivos sobre fondo pastel.
- **NFR15:** La información nunca se transmite únicamente por color (formas + color siempre).
- **NFR16:** Sin parpadeos > 3 por segundo ni flashes de contenido (criterio de convulsiones WCAG 2.1).
- **NFR17:** La aplicación respeta `prefers-reduced-motion` desactivando animaciones no esenciales.
- **NFR18:** Foco visible en todos los elementos interactivos cuando se usa mouse/teclado.
- **NFR19:** Funciona correctamente en Chrome, Safari y Edge (últimas 2 versiones).
- **NFR20:** Responsive horizontal en viewports de 568px a 1920px de ancho.
- **NFR21:** Drag & drop funciona con touch (Pointer Events API) y mouse.
- **NFR22:** Persistencia LocalStorage funciona correctamente en navegación privada (degradación graceful si no disponible).
- **NFR23:** La aplicación funciona completamente offline una vez cargada (no depende de red para gameplay).
- **NFR24:** Si LocalStorage no está disponible, el juego funciona normalmente sin persistencia (sesión única sin error).
- **NFR25:** El diccionario embebido siempre está disponible (no hay estado de "datos no cargados").

### Additional Requirements

- **Starter Template:** Vite react-ts — `npm create vite@latest silabc -- --template react-ts` (Architecture Story 1)
- Configuración de ESLint + Prettier con reglas React/TypeScript
- Configuración de Vitest con React Testing Library
- Estructura de carpetas por feature (components/, screens/, contexts/, services/, hooks/, data/, styles/, types/, assets/)
- CSP headers configurados en `staticwebapp.config.json`
- CI/CD pipeline: GitHub Actions (lint → typecheck → test → build → deploy)
- Azure Static Web Apps tier gratuito como plataforma de despliegue
- React Context + useReducer para state management (GameContext, PlayerContext, DictionaryContext)
- CSS Modules como styling solution con variables CSS globales para tokens
- Framer Motion como framework de animación (~32KB)
- State-based navigation con ScreenManager (sin router)
- Dictionary JSON embebido parseado a Map/Set al inicio
- Storage abstraction layer con fallback a in-memory
- Pointer Events API para drag & drop unificado (touch + mouse)
- Named exports siempre (no export default)
- Anti-patterns prohibidos: `any`, CSS inline, estado global fuera de Context, `useEffect` para lógica derivable

### UX Design Requirements

- **UX-DR1:** Implementar design tokens completos en `tokens.css`: paleta pastel (--color-cream #FFF8F0, --color-coral #FF6B6B, --color-mint #00D2D3, --color-lavender #A29BFE, --color-sun #FECA57, --color-sky #48DBFB), tipografía Nunito (32px-80px escalas), spacing system (4px base), border-radius (12-24px), sombras (3 niveles)
- **UX-DR2:** Implementar OrientationOverlay como componente que detecta portrait y muestra animación de rotación con avatar — bloquea interacción hasta landscape
- **UX-DR3:** Implementar WorldThemeProvider con temas Selva/Granja/Océano (cada uno con 5 colores + gradient de fondo + ilustración de escenario SVG)
- **UX-DR4:** DiceRoller con animación de lanzamiento 3D (rotateX/Y spring physics 800ms), tamaño 80-100px en viewport óptimo, feedback táctil (scale 0.95 → spring back), glow proximity
- **UX-DR5:** LetterTile con estados idle/hover/active/dragging/placed/disabled, tamaño responsive (48px-64px según breakpoint), sombra en drag, snap-to-grid en zona de construcción
- **UX-DR6:** WordBuilder con slots visuales, sílaba anclada con estilo diferenciado (color-coral, fixed indicator), posicionamiento antes/después de sílaba, animación de snap al colocar letra
- **UX-DR7:** AlphabetPanel con layout responsive (2 rows ≥1024px, 3 rows <1024px), letras seleccionables y draggables, visual feedback al arrastrar
- **UX-DR8:** Avatar con 3 animaciones reactivas (celebración/curioso/excited), tamaño responsive (48px-80px), posición fija en esquina, reacción a eventos de juego
- **UX-DR9:** Celebration component reutilizable con variantes (word-complete: confetti + avatar dance, new-word: confetti + star burst + special animation, session-end: fireworks + resumen)
- **UX-DR10:** Timer visual tipo sol moviéndose por arco (no numérico), animación fluida CSS, respeta prefers-reduced-motion (posición estática sin transición)
- **UX-DR11:** SummaryScreen con lista de palabras logradas, diferenciación nueva vs repetida (star badge), avatar celebrando, botón "jugar de nuevo" prominente
- **UX-DR12:** VisualHint con aparición sutil al 50% de proximidad a palabra válida (opacity fade 300ms), imagen/ícono como pista (no texto)
- **UX-DR13:** Breakpoints responsive: 568px (mobile landscape compact), 768px (tablet reducido), 1024px (óptimo), 1440px+ (max-width 1200px centrado); escalar elementos sin reorganizar layout
- **UX-DR14:** Accessibility: WCAG 2.1 AA compliance — semantic HTML con roles/aria-labels, :focus-visible (3px blue outline), keyboard navigation (Tab, Enter/Space, Arrows, Escape), useReducedMotion() en toda animación Framer Motion, contraste verificado
- **UX-DR15:** Micro-interacciones táctiles estandarizadas: touch-hold scale(1.08) 100ms, release scale(1.0) 200ms easing-bounce, drag pickup scale(1.1) + shadow + rotate(±2deg), drop success snap 150ms, drop fail animate-back 300ms
- **UX-DR16:** ScreenManager transitions con AnimatePresence: fade+slide entre screens (300ms), immediate en reduced-motion

### FR Coverage Map

| FR | Epic | Descripción |
|---|---|---|
| FR1 | Epic 1 | Selección de avatar animal |
| FR2 | Epic 1 | Animación de celebración al elegir avatar |
| FR3 | Epic 1 | Nombre opcional con entrada simplificada |
| FR5 | Epic 1 | Jugador nuevo accede directo a selección de avatar |
| FR7 | Epic 1 | Indicador visual de rotación en portrait |
| FR31 | Epic 1 | Sin enlaces externos, publicidad ni formularios |
| FR32 | Epic 1 | Sin comunicación de red durante gameplay |
| FR6 | Epic 2 | Acceso al mundo Selva |
| FR8 | Epic 2 | Volver a inicio desde cualquier punto |
| FR9 | Epic 2 | Lanzar dado silábico tocándolo |
| FR10 | Epic 2 | Animación de giro del dado |
| FR11 | Epic 2 | Dado genera sílaba directa (CV) del mundo Selva |
| FR12 | Epic 2 | Sílaba se coloca automáticamente como pieza obligatoria |
| FR13 | Epic 2 | Arrastrar letras del alfabeto a zona de construcción |
| FR14 | Epic 2 | Posicionar letras antes o después de sílaba |
| FR15 | Epic 2 | Remover letras ya colocadas |
| FR16 | Epic 2 | Alfabeto completo sin restricción |
| FR17 | Epic 2 | Sílaba del dado permanece fija como obligatoria |
| FR18 | Epic 2 | Validación automática contra diccionario |
| FR19 | Epic 2 | Celebración animada con avatar al formar palabra válida |
| FR20 | Epic 2 | Sugerencia visual al acercarse a palabra válida |
| FR21 | Epic 2 | Nunca muestra mensajes de error o penalización |
| FR22 | Epic 2 | Cada sílaba tiene ≥3 palabras formables |
| FR30 | Epic 2 | Diccionario curado para niños 4-6 años |
| FR4 | Epic 3 | Reconocimiento de jugador recurrente |
| FR23 | Epic 3 | Temporizador visual suave (metáfora, no numérico) |
| FR24 | Epic 3 | Al agotarse temporizador, celebra lo logrado |
| FR25 | Epic 3 | Pantalla de resumen con palabras y avatar |
| FR26 | Epic 3 | Guarda progreso en LocalStorage |
| FR27 | Epic 3 | Persiste últimas 20 palabras |
| FR28 | Epic 3 | Persiste avatar, nombre y progreso entre sesiones |
| FR29 | Epic 3 | Marca palabras nuevas (no repetidas) en resumen |

## Epic List

### Epic 1: Fundación del Proyecto y Onboarding del Niño

Un niño abre SILABC en su tableta, ve una interfaz colorida con paleta pastel, el dispositivo se orienta correctamente (o muestra indicador de rotación), selecciona su avatar animal favorito con celebración animada, e ingresa opcionalmente su nombre. La app está lista para jugar.

**FRs cubiertos:** FR1, FR2, FR3, FR5, FR7, FR31, FR32
**NFRs transversales:** NFR3, NFR7, NFR8, NFR9, NFR11, NFR12, NFR13, NFR14, NFR15, NFR16, NFR17, NFR18, NFR19, NFR20, NFR21
**UX-DRs:** UX-DR1, UX-DR2, UX-DR8, UX-DR13, UX-DR14 (base), UX-DR16
**Incluye:** Scaffold Vite react-ts, design tokens CSS, CSS reset, ScreenManager con AnimatePresence, AvatarSelectScreen, NameInputScreen, OrientationOverlay, PlayerContext, estructura de carpetas completa, ESLint + Prettier, Vitest, CSP en staticwebapp.config.json, Avatar component base, responsive breakpoints

### Epic 2: Gameplay Central — Dado Silábico y Construcción de Palabras

El niño accede al mundo Selva, lanza un dado silábico animado que genera una sílaba, arrastra letras del alfabeto para construir una palabra real que contenga esa sílaba, recibe celebraciones con su avatar al acertar y sugerencias visuales sutiles al acercarse. Puede volver al inicio en cualquier momento. El juego nunca muestra errores ni penaliza.

**FRs cubiertos:** FR6, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR30
**NFRs transversales:** NFR4, NFR5, NFR6, NFR10, NFR22, NFR23, NFR24, NFR25
**UX-DRs:** UX-DR3, UX-DR4, UX-DR5, UX-DR6, UX-DR7, UX-DR9, UX-DR12, UX-DR15
**Incluye:** WorldSelectScreen, GameplayScreen, DiceRoller, WordBuilder, AlphabetPanel, LetterTile, Celebration, VisualHint, DictionaryContext, dictionaryService, dictionary.json, gameEngine, GameContext, useDragAndDrop hook, WorldThemeProvider

### Epic 3: Sesiones, Progreso y Jugador Recurrente

El niño juega con un temporizador visual suave (sol moviéndose), al finalizar la sesión ve un resumen celebratorio con todas las palabras logradas (las nuevas destacadas). Su progreso se guarda automáticamente. Al volver al juego días después, SILABC lo reconoce, muestra su avatar, nombre y progreso acumulado.

**FRs cubiertos:** FR4, FR23, FR24, FR25, FR26, FR27, FR28, FR29
**NFRs transversales:** NFR1, NFR2, NFR22, NFR24
**UX-DRs:** UX-DR10, UX-DR11
**Incluye:** Timer, SummaryScreen, WelcomeScreen, storageService, PlayerContext (extensión con persistencia)

## Epic 1: Fundación del Proyecto y Onboarding del Niño

Un niño abre SILABC en su tableta, ve una interfaz colorida con paleta pastel, el dispositivo se orienta correctamente (o muestra indicador de rotación), selecciona su avatar animal favorito con celebración animada, e ingresa opcionalmente su nombre. La app está lista para jugar.

### Story 1.1: Scaffold del Proyecto y Design System Foundation

As a **desarrollador**,
I want **un proyecto Vite + React + TypeScript inicializado con design tokens, estructura de carpetas, y herramientas de calidad configuradas**,
So that **pueda construir componentes SILABC con la paleta pastel, tipografía y estándares definidos desde el inicio**.

**Acceptance Criteria:**

**Given** que no existe código del proyecto
**When** se ejecuta `npm create vite@latest silabc -- --template react-ts` y se aplica la configuración
**Then** el proyecto incluye:
- Estructura de carpetas: `components/`, `screens/`, `contexts/`, `services/`, `hooks/`, `data/`, `styles/`, `types/`, `assets/`
- `tokens.css` con paleta completa (#FFF8F0, #FF6B6B, #00D2D3, #A29BFE, #FECA57, #48DBFB), tipografía Nunito (escalas 32-80px), spacing (4px base), border-radius (12-24px), sombras (3 niveles), touch targets (48/56/64px)
- `reset.css` con box-sizing y normalización
- ESLint + Prettier configurados con reglas React/TypeScript
- Vitest configurado con React Testing Library
- `staticwebapp.config.json` con CSP: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'` (FR31, FR32, NFR12)
- Breakpoints responsive: 568px, 768px, 1024px, 1440px como custom properties (UX-DR13)
- Named exports enforced (no default exports)
**And** `npm run dev` inicia sin errores
**And** `npm run build` produce bundle estático en `/dist`
**And** Lighthouse score ≥ 90 en página vacía (NFR7)

### Story 1.2: ScreenManager, Navegación por Estado y Orientación

As a **niño**,
I want **que la app detecte si mi tableta está en vertical y me pida rotarla con una animación amigable**,
So that **siempre vea el juego en la orientación correcta sin confusión**.

**Acceptance Criteria:**

**Given** que la app está cargada
**When** el dispositivo está en landscape
**Then** se muestra el ScreenManager que renderiza la pantalla activa según estado del contexto (UX-DR16)
**And** las transiciones entre screens usan AnimatePresence con fade+slide (300ms)

**Given** que el dispositivo está en orientación portrait
**When** se detecta `orientation: portrait` via media query
**Then** se muestra OrientationOverlay con animación de rotación y avatar (UX-DR2)
**And** la interacción con el juego está bloqueada hasta que se rote a landscape (FR7)

**Given** que el usuario usa `prefers-reduced-motion`
**When** se aplican transiciones de pantalla
**Then** las transiciones son instantáneas sin animación (UX-DR14, NFR17)

**Given** que se navega con teclado
**When** se presiona Tab en cualquier pantalla
**Then** los elementos interactivos muestran `:focus-visible` con outline 3px azul (NFR18)

### Story 1.3: Selección de Avatar con Celebración

As a **niño**,
I want **ver animales simpáticos y tocar el que más me guste para que salte de alegría**,
So that **me sienta bienvenido y elija mi compañero de juego**.

**Acceptance Criteria:**

**Given** que es un jugador nuevo (no hay datos en LocalStorage) (FR5)
**When** la app carga por primera vez
**Then** se muestra AvatarSelectScreen con 3-5 avatares animales (FR1)
**And** cada avatar tiene tamaño mínimo 48px (NFR13) y responsive (48px mobile, 60-80px tablet+) (UX-DR8)

**Given** que el niño está en AvatarSelectScreen
**When** toca un avatar animal
**Then** el avatar seleccionado reacciona con animación de celebración (saltar/bailar) (FR2, UX-DR8)
**And** el touch feedback es scale(1.08) en 100ms, release scale(1.0) en 200ms con easing-bounce (UX-DR15)

**Given** que un avatar ha sido seleccionado
**When** se confirma la selección (segundo toque o auto-avance tras celebración)
**Then** el estado del PlayerContext se actualiza con el avatar elegido
**And** se navega a NameInputScreen con transición animada (UX-DR16)

**Given** que los avatares se renderizan
**When** se verifica accesibilidad
**Then** cada avatar tiene `role="button"` y `aria-label` descriptivo (UX-DR14)
**And** la información no depende solo del color (formas distintas por animal) (NFR15)

### Story 1.4: Entrada de Nombre y Perfil del Jugador

As a **niño**,
I want **poder escribir mi nombre opcionalmente con un teclado grande y fácil**,
So that **el juego me llame por mi nombre si quiero**.

**Acceptance Criteria:**

**Given** que se completó la selección de avatar
**When** se muestra NameInputScreen
**Then** aparece un input de texto grande con teclado simplificado y un botón de "saltar" prominente (FR3)
**And** todos los botones tienen mínimo 48px (NFR13)
**And** el teclado/input es legible con tipografía Nunito ≥32px (UX-DR1)

**Given** que el niño ingresa un nombre
**When** confirma la entrada
**Then** el PlayerContext se actualiza con avatar + nombre
**And** se navega a la siguiente pantalla (placeholder para WorldSelect) con transición (UX-DR16)

**Given** que el niño toca "saltar"
**When** no se ingresa nombre
**Then** el PlayerContext se guarda con avatar y nombre vacío (sin error, FR21)
**And** se navega a la siguiente pantalla igualmente

**Given** que se crea el PlayerContext
**When** se revisan los datos del jugador
**Then** contiene: avatar seleccionado, nombre (string vacío si se saltó), progreso inicial en 0, lista de palabras vacía
**And** no se transmite dato alguno fuera del navegador (NFR8, FR32)

## Epic 2: Gameplay Central — Dado Silábico y Construcción de Palabras

El niño accede al mundo Selva, lanza un dado silábico animado que genera una sílaba, arrastra letras del alfabeto para construir una palabra real que contenga esa sílaba, recibe celebraciones con su avatar al acertar y sugerencias visuales sutiles al acercarse. Puede volver al inicio en cualquier momento. El juego nunca muestra errores ni penaliza.

### Story 2.1: Diccionario Embebido y Servicio de Validación

As a **niño**,
I want **que el juego conozca palabras reales en español y sepa cuándo formo una correcta**,
So that **pueda descubrir palabras válidas y recibir celebración inmediata**.

**Acceptance Criteria:**

**Given** que la app se carga
**When** se inicializa DictionaryContext
**Then** el diccionario JSON se parsea a Map<string, DictionaryEntry[]> + Set<string> (NFR25)
**And** contiene ≥50 palabras curadas apropiadas para niños 4-6 años (FR30)
**And** cada sílaba disponible tiene ≥3 palabras formables (FR22)

**Given** que el dictionaryService está inicializado
**When** se llama `isValidWord("mama")`
**Then** retorna `true` en <50ms (NFR6)

**Given** que se busca proximidad
**When** se llama `getClosestMatch("mam", "ma")`
**Then** retorna la entrada más cercana que contenga la sílaba obligatoria (para FR20)

**Given** que se solicita sílaba aleatoria
**When** se llama `getRandomSyllable('selva')`
**Then** retorna una sílaba directa CV del mundo Selva (FR11)

**Given** el contenido del diccionario
**When** se revisan todas las palabras
**Then** no contiene palabras inapropiadas para menores (FR30, NFR10)

### Story 2.2: WorldSelect, GameContext y Estructura del GameplayScreen

As a **niño**,
I want **entrar al mundo Selva y ver un escenario colorido listo para jugar**,
So that **me sienta en una aventura en la selva**.

**Acceptance Criteria:**

**Given** que se completó el onboarding (Epic 1)
**When** se muestra WorldSelectScreen
**Then** el mundo Selva es seleccionable con visual temático (FR6)
**And** los mundos Granja y Océano aparecen bloqueados/coming-soon (diseño extensible)

**Given** que el niño selecciona Selva
**When** toca el mundo
**Then** se inicializa GameContext con: sílaba null, letras vacías, palabras completadas [], ronda 0
**And** se navega a GameplayScreen con transición (UX-DR16)
**And** WorldThemeProvider aplica tema Selva (5 colores + gradient de fondo) (UX-DR3)

**Given** que el niño está en GameplayScreen
**When** mira la pantalla
**Then** ve: zona de dado, zona de construcción, panel de letras, avatar en esquina, botón de inicio (FR8)
**And** el layout escala sin reorganizarse entre breakpoints (UX-DR13)

**Given** que el niño quiere volver al inicio
**When** toca el botón de inicio (icono casa)
**Then** regresa a la pantalla principal (FR8) con transición animada

### Story 2.3: Dado Silábico con Animación de Lanzamiento

As a **niño**,
I want **tocar un dado grande y ver cómo gira hasta mostrar una sílaba**,
So that **descubra qué sílaba usaré para formar mi palabra**.

**Acceptance Criteria:**

**Given** que el niño está en GameplayScreen
**When** ve el DiceRoller
**Then** el dado tiene tamaño 80-100px en viewport óptimo (1024px), 64px en mobile (UX-DR4)
**And** tiene feedback táctil: scale(0.95) al presionar (UX-DR4)

**Given** que el niño toca el dado (FR9)
**When** se activa el lanzamiento
**Then** el dado muestra animación de giro 3D (rotateX/Y con spring physics, ~800ms) (FR10, UX-DR4)
**And** la animación se ejecuta a 60fps (NFR4)

**Given** que la animación del dado termina
**When** se revela la sílaba
**Then** se muestra una sílaba directa CV generada por dictionaryService para mundo Selva (FR11)
**And** la sílaba se coloca automáticamente en la zona de construcción como pieza obligatoria (FR12)
**And** el avatar reacciona con animación "curioso" (UX-DR8)

**Given** que el usuario tiene `prefers-reduced-motion`
**When** lanza el dado
**Then** la sílaba aparece instantáneamente sin animación de giro (NFR17)

### Story 2.4: AlphabetPanel y LetterTile Draggable

As a **niño**,
I want **ver todas las letras del abecedario y poder arrastrarlas con mi dedo**,
So that **elija las letras que necesito para formar mi palabra**.

**Acceptance Criteria:**

**Given** que hay una sílaba activa en la zona de construcción
**When** se renderiza AlphabetPanel
**Then** muestra el alfabeto completo sin restricción (FR16)
**And** layout: 2 rows en ≥1024px, 3 rows en <1024px, gap 8px/4px respectivamente (UX-DR7)

**Given** que el niño ve una LetterTile
**When** la letra está en estado idle
**Then** tiene tamaño responsive: 48px (568px), 56px (768px), 64px (1024px+) (UX-DR5, NFR13)
**And** tiene estados visuales: idle, hover, active, dragging, placed, disabled (UX-DR5)

**Given** que el niño toca y arrastra una letra (FR13)
**When** la LetterTile entra en estado dragging
**Then** scale(1.1) + sombra de drag + rotate(±2deg random) (UX-DR15)
**And** la letra sigue el pointer sin lag, z-index: 100 (UX-DR15)
**And** funciona con touch (Pointer Events API) y mouse (NFR21)

**Given** que la letra se suelta fuera de la zona de construcción
**When** no está sobre un drop zone válido
**Then** animate-back a la posición original en 300ms con easing-smooth (UX-DR15)

### Story 2.5: WordBuilder — Zona de Construcción y Sílaba Anclada

As a **niño**,
I want **soltar letras en casillas al lado de mi sílaba para ir armando una palabra**,
So that **vea cómo se forma la palabra paso a paso**.

**Acceptance Criteria:**

**Given** que una sílaba está en la zona de construcción (FR12)
**When** se renderiza WordBuilder
**Then** la sílaba anclada tiene estilo diferenciado (color-coral, fixed indicator) (UX-DR6, FR17)
**And** muestra slots visuales vacíos antes y después de la sílaba (UX-DR6)

**Given** que el niño arrastra una letra sobre un slot vacío
**When** la letra está sobre un drop zone válido
**Then** el drop zone muestra glow de proximidad (UX-DR4)
**And** el niño puede posicionar la letra antes o después de la sílaba (FR14)

**Given** que el niño suelta la letra en un slot válido
**When** se completa el drop
**Then** la letra hace snap a la posición en 150ms con easing-bounce (UX-DR15, UX-DR6)
**And** la sílaba del dado permanece fija e inamovible (FR17)

**Given** que el niño quiere quitar una letra colocada (FR15)
**When** toca una letra ya posicionada
**Then** la letra se remueve de la zona de construcción y vuelve al panel
**And** la sílaba obligatoria NO puede removerse (FR17)

**Given** que se colocan/remueven letras
**When** cambia la combinación en WordBuilder
**Then** se llama automáticamente a dictionaryService para validar (FR18)
**And** la respuesta de validación ocurre en <50ms (NFR6)

### Story 2.6: Validación, Celebración y Sugerencias Visuales

As a **niño**,
I want **que cuando formo una palabra correcta mi avatar salte y lance confeti, y que si estoy cerca me ayude con una pista**,
So that **siempre me sienta motivado y nunca me frustre**.

**Acceptance Criteria:**

**Given** que la combinación actual forma una palabra válida (FR18)
**When** dictionaryService.isValidWord() retorna true
**Then** se muestra Celebration con variante word-complete: confetti + avatar dance (FR19, UX-DR9)
**And** el avatar celebra con animación dedicada (UX-DR8)
**And** la palabra se registra en GameContext como completada
**And** el sistema nunca muestra mensajes de error (FR21)

**Given** que la combinación se acerca a una palabra válida (FR20)
**When** getClosestMatch() retorna un resultado con ≥50% de proximidad
**Then** se muestra VisualHint con opacity fade 300ms (UX-DR12)
**And** la pista es una imagen/ícono, nunca texto (UX-DR12)

**Given** que la combinación no es válida ni cercana
**When** se evalúa la combinación
**Then** no se muestra ningún mensaje de error, fallo o penalización (FR21)
**And** el avatar puede mostrar estado "curioso" sutil (UX-DR8)

**Given** que una palabra se completa exitosamente
**When** se cierra la celebración
**Then** se limpia la zona de construcción (RESET_ROUND)
**And** el dado queda disponible para nuevo lanzamiento
**And** las animaciones se ejecutan a 60fps (NFR4)

**Given** que el usuario tiene `prefers-reduced-motion`
**When** se activa celebración
**Then** confetti se reemplaza por flash estático, animaciones son instantáneas (NFR17)

## Epic 3: Sesiones, Progreso y Jugador Recurrente

El niño juega con un temporizador visual suave (sol moviéndose), al finalizar la sesión ve un resumen celebratorio con todas las palabras logradas (las nuevas destacadas). Su progreso se guarda automáticamente. Al volver al juego días después, SILABC lo reconoce, muestra su avatar, nombre y progreso acumulado.

### Story 3.1: StorageService y Persistencia LocalStorage

As a **niño**,
I want **que mis palabras y mi avatar se recuerden cuando vuelva a jugar mañana**,
So that **no tenga que empezar de cero cada vez**.

**Acceptance Criteria:**

**Given** que el niño completa una palabra
**When** la palabra se registra en GameContext
**Then** storageService guarda la palabra en LocalStorage automáticamente (FR26)
**And** persiste las últimas 20 palabras completadas (FR27), descartando la más antigua si se excede

**Given** que el niño tiene avatar y nombre
**When** se guarda el perfil del jugador
**Then** storageService persiste avatar, nombre y progreso acumulado (FR28)
**And** los datos se serializan con JSON.stringify

**Given** que LocalStorage no está disponible (navegación privada)
**When** se intenta guardar
**Then** el juego funciona normalmente sin persistencia (sesión única, sin error) (NFR24, NFR22)
**And** se logea `console.warn` solo en desarrollo

**Given** que se verifica privacidad
**When** se revisan los datos almacenados
**Then** todos los datos están exclusivamente en LocalStorage del dispositivo (NFR8)
**And** no se transmite ningún dato fuera del navegador (FR32)

### Story 3.2: Temporizador Visual de Sesión

As a **niño**,
I want **ver un sol que se mueve suavemente por el cielo mientras juego**,
So that **sepa cuánto me queda de juego sin sentir presión**.

**Acceptance Criteria:**

**Given** que una sesión de juego comienza
**When** se renderiza el Timer
**Then** muestra una metáfora visual de sol moviéndose por un arco (no numérico) (FR23, UX-DR10)
**And** la animación es fluida via CSS (UX-DR10)

**Given** que el temporizador está activo
**When** el tiempo avanza
**Then** el sol se desplaza suavemente por el arco
**And** no hay indicadores numéricos de tiempo restante (FR23)

**Given** que el temporizador se agota (FR24)
**When** el sol llega al final del arco
**Then** se activa Celebration con variante session-end (fireworks) (UX-DR9)
**And** se celebra lo logrado, no se penaliza (FR24)
**And** se transiciona automáticamente a SummaryScreen

**Given** que el usuario tiene `prefers-reduced-motion`
**When** se renderiza el Timer
**Then** el sol muestra posición estática sin transición animada (UX-DR10, NFR17)

### Story 3.3: Pantalla de Resumen de Sesión

As a **niño**,
I want **ver todas las palabras que formé con mi avatar aplaudiendo al final**,
So that **me sienta orgulloso de lo que logré**.

**Acceptance Criteria:**

**Given** que la sesión termina (temporizador agotado o cierre manual)
**When** se muestra SummaryScreen (FR25)
**Then** muestra la lista de palabras completadas en la sesión
**And** el avatar celebra con animación (UX-DR11)
**And** hay un botón "jugar de nuevo" prominente (≥48px) (UX-DR11, NFR13)

**Given** que el niño completó una palabra nueva (no repetida)
**When** se muestra en el resumen
**Then** la palabra nueva tiene un star badge diferenciado (FR29, UX-DR11)

**Given** que el niño completó una palabra repetida
**When** se muestra en el resumen
**Then** la palabra aparece sin badge especial pero cuenta en el total

**Given** que el niño toca "jugar de nuevo"
**When** se reinicia la sesión
**Then** se navega a WorldSelectScreen o directamente a GameplayScreen con nuevo dado
**And** el progreso acumulado se mantiene (FR28)

**Given** que las palabras de la sesión se muestran
**When** se verifica el almacenamiento
**Then** storageService ha persistido las palabras y progreso actualizado (FR26, FR27)

### Story 3.4: Reconocimiento de Jugador Recurrente y WelcomeScreen

As a **niño**,
I want **que cuando vuelva a abrir el juego me reconozca y me muestre mi progreso**,
So that **sienta que el juego me recuerda y vea cuánto he avanzado**.

**Acceptance Criteria:**

**Given** que hay datos de jugador en LocalStorage (FR4)
**When** la app se carga
**Then** se muestra WelcomeScreen con el avatar del niño, su nombre y progreso acumulado (FR4)
**And** el avatar saluda con animación de bienvenida (UX-DR8)
**And** se muestra "¡Llevas X palabras!" (o equivalente visual)

**Given** que NO hay datos en LocalStorage
**When** la app se carga
**Then** se navega directamente a AvatarSelectScreen (FR5) — flujo de jugador nuevo

**Given** que el jugador recurrente está en WelcomeScreen
**When** toca para continuar
**Then** se navega a WorldSelectScreen con su perfil cargado (avatar, nombre, progreso)
**And** la transición usa AnimatePresence (UX-DR16)

**Given** que el LocalStorage fue borrado externamente
**When** la app intenta cargar perfil y no encuentra datos
**Then** trata al usuario como jugador nuevo sin mensaje de error (FR21, NFR24)
**And** muestra AvatarSelectScreen normalmente
