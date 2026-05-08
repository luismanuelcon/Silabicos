---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/product-brief-SILABC.md'
workflowType: 'architecture'
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
