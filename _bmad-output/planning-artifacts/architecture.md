---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-06-structure
  - step-07-validation
  - step-08-complete
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/product-brief-SILABC.md'
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-05-08'
project_name: 'SILABC'
user_name: 'LuisAgent'
date: '2026-05-08'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
32 FRs en 8 áreas funcionales. El core arquitectónico se concentra en 3 sistemas interconectados: (1) Motor de dado silábico — generación de sílabas por dificultad, validación contra diccionario; (2) Sistema de construcción — drag & drop de letras con validación en tiempo real y sílaba obligatoria fija; (3) Sistema de refuerzo — celebraciones animadas, sugerencias visuales, temporizador metafórico. Los FRs de persistencia (FR26-29) y seguridad (FR30-32) son transversales.

**Non-Functional Requirements:**
NFRs de performance son los más restrictivos arquitectónicamente: bundle <500KB gzipped incluido diccionario, FCP <1.5s en 3G, animaciones 60fps constantes. NFRs de seguridad eliminan toda dependencia externa (CSP, sin scripts de terceros). NFRs de accesibilidad requieren diseño UI-first con touch targets grandes y soporte de prefers-reduced-motion.

**Scale & Complexity:**
- Primary domain: Web frontend (SPA estática)
- Complexity level: Medium
- Estimated architectural components: 6-8 módulos (game engine, dictionary service, drag-drop system, animation system, storage layer, UI components, world/theme system)

### Technical Constraints & Dependencies

- Azure Static Web Apps como plataforma de despliegue (tier gratuito/mínimo)
- Sin backend, sin API, sin base de datos — 100% cliente
- Orientación landscape obligatoria (568px-1920px)
- Browsers: Chrome + Safari (primary), Edge (secondary) — últimas 2 versiones
- Diccionario JSON embebido en bundle — no fetched at runtime
- Pointer Events API para drag & drop unificado (touch + mouse)
- Content Security Policy (CSP) para bloquear recursos externos
- prefers-reduced-motion para animaciones no esenciales

### Cross-Cutting Concerns Identified

- **Game state management:** Estado de sesión (sílaba actual, letras colocadas, palabras completadas, temporizador) debe ser coherente entre múltiples componentes
- **Animation system:** Celebraciones, transiciones, dado girando, avatares reaccionando — todo a 60fps con fallback para reduced-motion
- **Storage abstraction:** LocalStorage con degradación graceful a sesión-only sin error
- **Theme/World system:** Mundo Selva en MVP, pero arquitectura debe permitir agregar Granja y Océano sin refactor
- **Dictionary access layer:** Consultas rápidas (<50ms) sílaba→palabras, validación de combinaciones, proximidad a palabras válidas
- **Touch interaction layer:** Drag & drop con Pointer Events, zonas de drop, feedback visual de arrastre, áreas de 48px mínimo

## Starter Template Evaluation

### Primary Technology Domain

Web frontend (SPA estática) basado en React + TypeScript, desplegada en Azure Static Web Apps.

### Starter Options Considered

| Opción | Pros | Contras | Decisión |
|---|---|---|---|
| Vite + react-ts | Ligero, rápido, output estático puro, tree-shaking agresivo, HMR instantáneo | Sin opiniones de arquitectura (requiere decisiones adicionales) | ✅ Seleccionado |
| Next.js | Ecosistema maduro, SSR/SSG | Overhead innecesario para SPA sin backend, bundle más pesado | ❌ Descartado |
| Create React App | Familiar | Deprecado, no mantenido | ❌ Descartado |
| Preact | Más ligero (3KB) | Ecosistema menor, compatibilidad parcial con librerías React | ❌ Descartado |

### Selected Starter: Vite react-ts

**Rationale:** Vite es el estándar actual para SPAs React. Produce output estático puro compatible con Azure Static Web Apps, con tree-shaking agresivo que ayuda a cumplir el constraint de <500KB. No impone opiniones sobre routing ni state management, dejando libertad para las decisiones específicas de SILABC.

**Initialization Command:**

```bash
npm create vite@latest silabc -- --template react-ts
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript con configuración estricta
- ESModules nativos
- Node.js ≥ 20.19

**Build Tooling:**
- Vite como dev server y bundler
- Rolldown para producción (tree-shaking, code-splitting, minificación)
- Output: archivos estáticos en `/dist`

**Development Experience:**
- HMR instantáneo via ESModules nativos
- TypeScript checking integrado
- Preview server para verificar builds de producción

**Decisions NOT Made by Starter (to be decided in architecture):**
- Styling solution (CSS Modules, Tailwind, vanilla CSS)
- State management (React Context, Zustand, signals)
- Routing (si necesario — SILABC puede ser single-view)
- Testing framework (Vitest es la opción natural con Vite)
- Linting/Formatting (ESLint + Prettier)
- Animation approach (CSS animations, Framer Motion, GSAP)
- Drag & drop implementation

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- State management approach
- Styling solution
- Dictionary data structure
- Animation framework

**Important Decisions (Shape Architecture):**
- Navigation pattern
- Testing framework
- Linting/Formatting

**Deferred Decisions (Post-MVP):**
- PWA/Service Worker configuration (Phase 3)
- Internationalization framework (Phase 3)
- Sound/audio engine (Phase 2)

### Frontend Architecture

**State Management: React Context + useReducer**
- Rationale: Zero dependencias adicionales. La SPA tiene ~5 estados globales (game session, player profile, dictionary cache, UI state, timer). React Context con useReducer es suficiente para esta escala sin el overhead de librerías externas.
- Estructura de contextos:
  - `GameContext` — estado de sesión: sílaba actual, letras colocadas, palabras completadas, temporizador
  - `PlayerContext` — perfil persistido: avatar, nombre, progreso acumulado, últimas 20 palabras
  - `DictionaryContext` — diccionario parseado (Map/Set), cargado una vez al inicio
- Affects: Todos los componentes de juego

**Styling: CSS Modules**
- Rationale: Zero runtime CSS, scoping automático por componente, soporte nativo de Vite sin configuración adicional. Mantiene el bundle al mínimo.
- Convenciones:
  - Un archivo `.module.css` por componente
  - Variables CSS globales para design tokens (paleta pastel, tipografía, spacing)
  - Archivos CSS globales para reset y tokens en `src/styles/`
- Affects: Todos los componentes UI

**Navigation: State-based (sin router)**
- Rationale: SILABC es un juego infantil sin URLs compartibles ni deep linking. Las "pantallas" (avatar selection → name → world → gameplay → summary) son estados del juego, no páginas web.
- Implementación: Componente `ScreenManager` que renderiza la screen activa basado en estado del `GameContext`.
- Screens: `AvatarSelect` | `NameInput` | `WorldSelect` | `Gameplay` | `Summary` | `Welcome` (returning player)
- Affects: Estructura de componentes, GameContext

**Testing: Vitest**
- Rationale: Integración nativa con Vite, API compatible con Jest, ejecución rápida.
- Estrategia: Unit tests para dictionary service, game logic, y storage layer. Component tests con React Testing Library para interacciones clave.
- Affects: CI/CD, development workflow

**Linting/Formatting: ESLint + Prettier**
- Rationale: Estándar de la industria. Configuración con reglas de React y TypeScript.
- Affects: Development workflow, CI/CD

### Animation Architecture

**Framework: Framer Motion**
- Rationale: API declarativa que simplifica la implementación de animaciones complejas sin experiencia previa en animación web. `variants`, `AnimatePresence` y spring physics permiten crear celebraciones ricas con poco código. ~32KB de bundle impact manejable dentro del budget de 500KB.
- Uso previsto:
  - Dado silábico: rotación 3D con spring physics al lanzar
  - Celebraciones: secuencias de scale + opacity + confetti con `variants`
  - Avatar reactions: gestos predefinidos (saltar, bailar, aplaudir) con `animate`
  - Transiciones entre screens: `AnimatePresence` con fade/slide
  - Drag & drop feedback: `motion.div` con `drag` constraint y snap-back
- `prefers-reduced-motion`: Detectar con `useReducedMotion()` hook de Framer Motion; reemplazar animaciones con transiciones instantáneas
- Affects: Todos los componentes visuales, UX emocional

### Data Architecture

**Dictionary Data Structure:**

```typescript
// Diccionario embebido como JSON estático en bundle
interface DictionaryEntry {
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageHint?: string; // referencia a asset de sugerencia visual
}

interface SyllableData {
  syllable: string;
  words: DictionaryEntry[];
}

// Runtime: parseado a estructuras optimizadas al inicio
interface DictionaryService {
  // Lookup O(1): sílaba → palabras válidas
  getWordsForSyllable(syllable: string): DictionaryEntry[];
  // Validación O(1): ¿es palabra válida?
  isValidWord(word: string): boolean;
  // Proximidad: ¿qué tan cerca está de una palabra?
  getClosestMatch(partial: string, syllable: string): DictionaryEntry | null;
  // Random syllable por dificultad/mundo
  getRandomSyllable(world: 'selva' | 'granja' | 'oceano'): string;
}
```

- JSON source en `src/data/dictionary.json`
- Parseado a `Map<string, DictionaryEntry[]>` + `Set<string>` al montar la app
- Validación de palabra: O(1) con Set lookup
- Proximidad: prefix matching iterativo contra el Set filtrado por sílaba obligatoria
- Tamaño estimado: <50KB para MVP (50-100 palabras con metadata)

**Persistencia: Storage Abstraction Layer**

```typescript
interface StorageService {
  savePlayerProfile(profile: PlayerProfile): void;
  loadPlayerProfile(): PlayerProfile | null;
  saveCompletedWord(word: string): void;
  getCompletedWords(): string[];
  clearAll(): void;
}
```

- Implementación primaria: LocalStorage
- Fallback: In-memory (sesión única, sin error)
- Detección al inicio: `try { localStorage.setItem('test', '1'); } catch { fallback }`
- Datos persistidos: avatar, nombre, últimas 20 palabras, progreso por mundo
- Serialización: JSON.stringify/parse

### Security & Privacy

- **CSP Header:** `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'` — configurado en `staticwebapp.config.json`
- **Sin scripts de terceros:** No analytics, no ads, no tracking
- **Sin transmisión de datos:** Verificable por ausencia de `fetch`/`XMLHttpRequest` en el código de gameplay
- **Diccionario curado:** Revisión manual pre-release, lista de exclusión explícita

### Infrastructure & Deployment

**Azure Static Web Apps:**
- Tier: Free (suficiente para MVP)
- Build: GitHub Actions (Vite build → deploy `/dist`)
- CDN incluido en el tier
- Custom domain: configurable post-MVP
- `staticwebapp.config.json` para CSP headers y routing fallback (SPA)

**CI/CD Pipeline:**
- GitHub Actions: lint → type-check → test → build → deploy
- Branch strategy: `main` (production), `dev` (staging)

### Decision Impact Analysis

**Implementation Sequence:**
1. Vite + React + TypeScript scaffold
2. CSS Modules + design tokens (paleta pastel, tipografía)
3. Dictionary service + JSON data
4. Storage abstraction layer
5. Game state (Context + useReducer)
6. Screen manager + navigation
7. Core gameplay components (dado, zona de construcción, alfabeto)
8. Framer Motion animations
9. Timer + session flow
10. Polish + testing

**Cross-Component Dependencies:**
- DictionaryService → GameContext (validación en tiempo real)
- StorageService → PlayerContext (persistencia)
- Framer Motion → todos los componentes visuales (animaciones)
- CSS Modules tokens → todos los componentes (diseño visual)
- GameContext → ScreenManager (navegación por estado)

## Implementation Patterns & Consistency Rules

### Naming Patterns

**File Naming:**
- Componentes React: PascalCase → `DiceRoller.tsx`, `AvatarSelect.tsx`
- Módulo CSS: match del componente → `DiceRoller.module.css`
- Hooks custom: camelCase con prefijo `use` → `useGameState.ts`
- Services: camelCase → `dictionaryService.ts`, `storageService.ts`
- Types/Interfaces: PascalCase en archivo dedicado → `types.ts` por módulo
- Constantes: UPPER_SNAKE_CASE → `GAME_CONSTANTS.ts`
- Assets: kebab-case → `avatar-monkey.svg`, `world-selva-bg.png`

**Code Naming:**
- Componentes: PascalCase → `GameScreen`, `LetterTile`
- Props interfaces: `{ComponentName}Props` → `DiceRollerProps`
- Context: `{Name}Context` + `use{Name}` hook → `GameContext`, `useGame`
- Reducer actions: `UPPER_SNAKE_CASE` → `SET_SYLLABLE`, `ADD_LETTER`, `COMPLETE_WORD`
- CSS class references: camelCase (via CSS Modules) → `styles.diceContainer`
- Event handlers: `handle{Event}` → `handleDiceTap`, `handleLetterDrop`

### Structure Patterns

**Project Organization (by feature):**

```
src/
  components/        # Componentes React reutilizables
    DiceRoller/
      DiceRoller.tsx
      DiceRoller.module.css
      DiceRoller.test.tsx
    LetterTile/
    Avatar/
  screens/           # Screens del juego (uno por estado de navegación)
    AvatarSelectScreen/
    GameplayScreen/
    SummaryScreen/
  contexts/          # React Contexts + reducers
    GameContext.tsx
    PlayerContext.tsx
  services/          # Lógica de negocio pura (sin React)
    dictionaryService.ts
    storageService.ts
  hooks/             # Custom hooks compartidos
    useReducedMotion.ts
  data/              # Datos estáticos
    dictionary.json
  styles/            # CSS global, tokens, reset
    tokens.css
    reset.css
  types/             # Types compartidos
    game.ts
    dictionary.ts
  assets/            # SVGs, imágenes
    avatars/
    worlds/
  App.tsx
  main.tsx
```

**Co-located tests:** `*.test.tsx` junto al componente, no en carpeta separada.

### State Management Patterns

**Context structure:**
- Cada contexto expone un custom hook: `useGame()`, `usePlayer()`
- Nunca usar `useContext()` directamente — siempre el hook wrapper
- Reducers usan switch con tipos discriminados (union types)
- State updates siempre inmutables (spread operator)

**Reducer action pattern:**

```typescript
type GameAction =
  | { type: 'SET_SYLLABLE'; payload: string }
  | { type: 'ADD_LETTER'; payload: { letter: string; position: number } }
  | { type: 'REMOVE_LETTER'; payload: number }
  | { type: 'COMPLETE_WORD'; payload: string }
  | { type: 'RESET_ROUND' }
  | { type: 'END_SESSION' };
```

### Component Patterns

**Component structure (orden interno):**
1. Imports
2. Types/interfaces (si son locales al componente)
3. Component function
4. Hooks al inicio del componente
5. Derived state / computations
6. Event handlers
7. Render

**Props pattern:**
- Destructure props en la firma de la función
- Props opcionales con defaults via `= defaultValue`
- No usar `React.FC` — funciones normales con tipo de retorno implícito

### Animation Patterns

**Framer Motion conventions:**
- Variants definidos fuera del componente como constantes
- Nombres de variants: `initial`, `animate`, `exit`, `hover`, `tap`
- Celebraciones: componente `<Celebration />` reutilizable con variants por tipo
- `useReducedMotion()` check en cada componente animado
- Fallback: `animate={shouldReduce ? {} : variants.animate}`

### Error & Edge Case Patterns

**Sin errores visibles al usuario** (principio core del PRD):
- Dictionary lookup que no encuentra match → guía suave, nunca "error"
- LocalStorage falla → fallback silencioso a in-memory
- Imagen no carga → placeholder SVG inline
- Componente falla → Error boundary con pantalla de "volver al inicio"

**Console logging (solo desarrollo):**
- `console.warn` para degradaciones (LocalStorage no disponible)
- `console.error` para fallos inesperados
- Nunca `console.log` en producción — strip con Vite define

### CSS Patterns

**Design tokens en `tokens.css`:**

```css
:root {
  /* Paleta pastel */
  --color-primary: /* TBD en UX design */;
  --color-secondary: /* TBD */;
  --color-bg: /* TBD */;
  /* Tipografía */
  --font-family: /* TBD */, sans-serif;
  --font-size-xl: 2rem;
  /* Spacing */
  --space-sm: 0.5rem;
  --space-md: 1rem;
  /* Touch targets */
  --touch-min: 48px;
  /* Border radius */
  --radius-lg: 16px;
}
```

- Todo componente usa variables CSS, nunca valores hardcodeados
- Media queries con breakpoints del PRD: 568px, 1024px, 1440px
- `min-height: var(--touch-min)` en todo elemento interactivo

### Enforcement Guidelines

**All AI Agents MUST:**
- Seguir la estructura de carpetas definida — no crear nuevas carpetas raíz en `src/`
- Usar CSS Modules — no CSS-in-JS, no inline styles (excepto dinámicos de Framer Motion)
- Exponer contextos via hooks custom — nunca `useContext()` directo
- Co-locar tests con componentes — no carpeta `__tests__/` separada
- Usar design tokens CSS — nunca valores de color/spacing hardcodeados
- Respetar `prefers-reduced-motion` en toda animación
- No usar `fetch`, `XMLHttpRequest`, ni ningún network call en código de gameplay

**Anti-Patterns (PROHIBIDOS):**
- `export default` — usar siempre named exports
- `any` en TypeScript — usar tipos explícitos o `unknown`
- CSS inline para layout o colores — usar CSS Modules + tokens
- Estado global fuera de Context — no variables de módulo mutables
- `useEffect` para lógica derivable — usar computación en render

## Project Structure & Boundaries

### Complete Project Directory Structure

```
silabicos/
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── index.html
├── staticwebapp.config.json          # CSP headers, routing fallback
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml # CI/CD: lint → typecheck → test → build → deploy
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                      # Entry point, render App
    ├── App.tsx                       # ScreenManager + Providers
    ├── components/
    │   ├── DiceRoller/
    │   │   ├── DiceRoller.tsx        # Dado silábico con animación 3D
    │   │   ├── DiceRoller.module.css
    │   │   └── DiceRoller.test.tsx
    │   ├── LetterTile/
    │   │   ├── LetterTile.tsx        # Ficha de letra draggable
    │   │   ├── LetterTile.module.css
    │   │   └── LetterTile.test.tsx
    │   ├── WordBuilder/
    │   │   ├── WordBuilder.tsx       # Zona de construcción de palabras
    │   │   ├── WordBuilder.module.css
    │   │   └── WordBuilder.test.tsx
    │   ├── AlphabetPanel/
    │   │   ├── AlphabetPanel.tsx     # Panel de letras disponibles
    │   │   ├── AlphabetPanel.module.css
    │   │   └── AlphabetPanel.test.tsx
    │   ├── Avatar/
    │   │   ├── Avatar.tsx            # Componente avatar con reacciones
    │   │   ├── Avatar.module.css
    │   │   └── Avatar.test.tsx
    │   ├── Timer/
    │   │   ├── Timer.tsx             # Temporizador visual de sesión
    │   │   ├── Timer.module.css
    │   │   └── Timer.test.tsx
    │   ├── Celebration/
    │   │   ├── Celebration.tsx       # Animaciones de celebración reutilizable
    │   │   ├── Celebration.module.css
    │   │   └── Celebration.test.tsx
    │   ├── VisualHint/
    │   │   ├── VisualHint.tsx        # Sugerencia visual de palabra
    │   │   ├── VisualHint.module.css
    │   │   └── VisualHint.test.tsx
    │   └── ScreenManager/
    │       ├── ScreenManager.tsx     # Renderiza screen activa por estado
    │       └── ScreenManager.test.tsx
    ├── screens/
    │   ├── WelcomeScreen/
    │   │   ├── WelcomeScreen.tsx     # Pantalla de bienvenida (returning player)
    │   │   └── WelcomeScreen.module.css
    │   ├── AvatarSelectScreen/
    │   │   ├── AvatarSelectScreen.tsx
    │   │   └── AvatarSelectScreen.module.css
    │   ├── NameInputScreen/
    │   │   ├── NameInputScreen.tsx
    │   │   └── NameInputScreen.module.css
    │   ├── WorldSelectScreen/
    │   │   ├── WorldSelectScreen.tsx # Selección de mundo (Selva/Granja/Océano)
    │   │   └── WorldSelectScreen.module.css
    │   ├── GameplayScreen/
    │   │   ├── GameplayScreen.tsx    # Pantalla principal de juego
    │   │   └── GameplayScreen.module.css
    │   └── SummaryScreen/
    │       ├── SummaryScreen.tsx     # Resumen de sesión
    │       └── SummaryScreen.module.css
    ├── contexts/
    │   ├── GameContext.tsx           # Estado de sesión: sílaba, letras, palabras, timer
    │   ├── PlayerContext.tsx         # Perfil persistido: avatar, nombre, progreso
    │   └── DictionaryContext.tsx     # Diccionario parseado (Map/Set)
    ├── services/
    │   ├── dictionaryService.ts      # Lookup, validación, proximidad
    │   ├── dictionaryService.test.ts
    │   ├── storageService.ts         # LocalStorage abstraction + fallback
    │   ├── storageService.test.ts
    │   ├── gameEngine.ts             # Lógica de juego: rondas, puntuación, dificultad
    │   └── gameEngine.test.ts
    ├── hooks/
    │   ├── useReducedMotion.ts       # Wrapper de prefers-reduced-motion
    │   └── useDragAndDrop.ts         # Pointer Events drag & drop logic
    ├── data/
    │   └── dictionary.json           # Diccionario fuente (sílabas → palabras)
    ├── styles/
    │   ├── tokens.css                # Design tokens: colores, tipografía, spacing
    │   ├── reset.css                 # CSS reset mínimo
    │   └── animations.css            # Keyframes CSS para reduced-motion fallbacks
    ├── types/
    │   ├── game.ts                   # GameState, GameAction, Screen, Round
    │   ├── player.ts                 # PlayerProfile, PlayerProgress
    │   └── dictionary.ts             # DictionaryEntry, SyllableData, DictionaryService
    └── assets/
        ├── avatars/                  # SVGs de avatares animales
        │   ├── avatar-monkey.svg
        │   ├── avatar-parrot.svg
        │   └── avatar-frog.svg
        └── worlds/                   # Backgrounds/iconos de mundos temáticos
            ├── world-selva.svg
            ├── world-granja.svg
            └── world-oceano.svg
```

### Architectural Boundaries

**Component Boundaries:**
- `screens/` → composición de `components/`, consumen contextos via hooks
- `components/` → componentes puros, reciben datos via props, no acceden a servicios directamente
- `services/` → lógica pura TypeScript sin dependencia de React
- `contexts/` → conectan services con componentes, son el único lugar donde se llama a services
- `hooks/` → lógica reutilizable de UI, no lógica de negocio

**Data Flow (unidireccional):**

```
dictionary.json → DictionaryContext (parsea a Map/Set)
                       ↓
User action → GameContext (dispatch action) → gameEngine (valida) → state update
                       ↓                                               ↓
               ScreenManager (renderiza screen activa)          StorageService (persiste)
                       ↓
               Components (renderizan UI + animaciones)
```

**Service Boundaries:**
- `dictionaryService` — solo lectura, stateless, inicializado una vez
- `storageService` — lectura/escritura LocalStorage, manejo de fallback
- `gameEngine` — lógica pura de reglas: validación, puntuación, selección de sílaba. Sin side effects.

### Requirements to Structure Mapping

**FR01-FR04 (Dado Silábico):**
- `components/DiceRoller/` — UI y animación del dado
- `services/dictionaryService.ts` — `getRandomSyllable()`
- `contexts/GameContext.tsx` — `SET_SYLLABLE` action

**FR05-FR09 (Construcción de Palabras):**
- `components/WordBuilder/` — zona de drop
- `components/LetterTile/` — fichas draggables
- `components/AlphabetPanel/` — panel de letras
- `hooks/useDragAndDrop.ts` — lógica Pointer Events
- `services/gameEngine.ts` — validación en tiempo real

**FR10-FR14 (Validación y Feedback):**
- `services/dictionaryService.ts` — `isValidWord()`, `getClosestMatch()`
- `components/Celebration/` — animaciones de éxito
- `components/VisualHint/` — sugerencias visuales

**FR15-FR19 (Perfil y Progreso):**
- `screens/AvatarSelectScreen/` + `NameInputScreen/`
- `contexts/PlayerContext.tsx` — perfil y progreso
- `services/storageService.ts` — persistencia LocalStorage

**FR20-FR24 (Mundos y Sesión):**
- `screens/WorldSelectScreen/` — selección de mundo
- `components/Timer/` — temporizador visual
- `screens/SummaryScreen/` — resumen de sesión

**FR25-FR32 (Accesibilidad y Responsive):**
- `styles/tokens.css` — touch targets, breakpoints
- `hooks/useReducedMotion.ts` — detección reduced-motion
- Transversal a todos los componentes

### Development Workflow

**Scripts de package.json:**
- `dev` — Vite dev server
- `build` — TypeScript check + Vite build
- `preview` — Preview del build local
- `test` — Vitest run
- `test:watch` — Vitest watch mode
- `lint` — ESLint
- `format` — Prettier
- `typecheck` — tsc --noEmit

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- Vite + React + TypeScript + CSS Modules + Framer Motion — stack completamente compatible, sin conflictos de versión ni overlap funcional.
- Context + useReducer para ~5 estados globales es proporcional a la escala del proyecto.
- State-based navigation coherente con la naturaleza de juego (no web pages).
- Framer Motion + CSS Modules sin conflictos (FM usa inline styles dinámicos, CSS Modules para layout/colores estáticos).

**Pattern Consistency:**
- Named exports, PascalCase componentes, camelCase hooks/services — convenciones React estándar sin excepciones internas.
- Co-located tests alineados con Vitest + Vite (sin configuración extra).
- Design tokens CSS + CSS Modules = zero runtime cost, coherente con NFR3 (bundle <500KB).

**Structure Alignment:**
- Cada decisión arquitectónica tiene ubicación explícita en el árbol de proyecto.
- Boundaries claros: services puros → contexts conectores → components presentacionales.

### Requirements Coverage Validation ✅

| FR Range | Área | Soporte Arquitectónico | Status |
|---|---|---|---|
| FR1-FR5 | Onboarding | AvatarSelectScreen, NameInputScreen, PlayerContext, storageService | ✅ |
| FR6-FR8 | Navegación | WorldSelectScreen, ScreenManager, GameContext | ✅ |
| FR9-FR12 | Dado Silábico | DiceRoller, dictionaryService, GameContext | ✅ |
| FR13-FR17 | Construcción | WordBuilder, LetterTile, AlphabetPanel, useDragAndDrop | ✅ |
| FR18-FR22 | Validación | dictionaryService, Celebration, VisualHint, gameEngine | ✅ |
| FR23-FR25 | Sesión | Timer, SummaryScreen, GameContext | ✅ |
| FR26-FR29 | Persistencia | storageService, PlayerContext | ✅ |
| FR30-FR32 | Seguridad | dictionary.json curado, CSP, zero network calls | ✅ |

**Non-Functional Requirements Coverage:**

| NFR | Soporte | Mecanismo |
|---|---|---|
| NFR1-3 (Performance) | ✅ | Vite tree-shaking, CSS Modules zero-runtime, bundle estático |
| NFR4-6 (Runtime) | ✅ | Framer Motion 60fps, Pointer Events <16ms, Map/Set O(1) lookup |
| NFR7 (Lighthouse) | ✅ | Static build, no third-party scripts, CSP |
| NFR8-12 (Security) | ✅ | Zero fetch/XHR, no third-party, CSP, curated dictionary |
| NFR13-18 (A11y) | ✅ | tokens.css (48px touch), useReducedMotion, CSS patterns |
| NFR19-22 (Compat) | ✅ | Vite targets modern browsers, Pointer Events, storage fallback |
| NFR23-25 (Reliability) | ✅ | Static SPA, storageService fallback, embedded dictionary |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- Todas las decisiones críticas documentadas con rationale y scope de impacto.
- Stack tecnológico completo sin ambigüedades.
- Patrones de integración definidos (data flow unidireccional, Context → hooks).

**Structure Completeness:**
- Árbol de directorio completo con todos los archivos y descripciones.
- Boundaries explícitos entre capas (screens → components → contexts → services).
- Mapping FR → estructura verificado al 100%.

**Pattern Completeness:**
- Convenciones de naming cubren archivos, código, CSS, actions, handlers.
- Anti-patterns explícitamente prohibidos con alternativas.
- Enforcement guidelines claros para agentes AI.

### Gap Analysis Results

**Critical Gaps:** Ninguno.

**Minor Gaps (no bloquean implementación):**
1. **FR7 — Indicador de rotación:** No hay componente explícito en la estructura. Solución: incluir lógica en `App.tsx` con CSS media query `orientation: portrait`.
2. **FR8 — Botón "volver al inicio":** Transversal a todas las screens, se implementa como prop/action en `ScreenManager`.
3. **Colores/tipografía en tokens.css:** Marcados como TBD pendientes de UX Design — esperado, no bloqueante.

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Stack mínimo y coherente (zero dependencias innecesarias)
- Data flow unidireccional claro
- Boundaries explícitos que previenen conflictos entre agentes AI
- 100% cobertura FR/NFR verificada
- Patterns concretos con ejemplos (no genéricos)

**Areas for Future Enhancement:**
- UX Design pendiente (colores, tipografía, assets SVG)
- PWA/Service Worker (Phase 3)
- Sound/audio engine (Phase 2)
- Mundos adicionales Granja y Océano (Phase 2-3)

### Implementation Handoff

**AI Agent Guidelines:**
- Seguir todas las decisiones arquitectónicas exactamente como están documentadas
- Usar patrones de implementación de forma consistente en todos los componentes
- Respetar la estructura del proyecto y sus boundaries
- Consultar este documento para toda pregunta arquitectónica

**First Implementation Priority:**
```bash
npm create vite@latest silabicos -- --template react-ts
```
Project initialization usando este comando debe ser la primera story de implementación.
