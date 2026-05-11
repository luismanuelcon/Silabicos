# Story 1.1: Scaffold del Proyecto y Design System Foundation

Status: done

## Story

As a **desarrollador**,
I want **un proyecto Vite + React + TypeScript inicializado con design tokens, estructura de carpetas, y herramientas de calidad configuradas**,
so that **pueda construir componentes SILABC con la paleta pastel, tipografía y estándares definidos desde el inicio**.

## Acceptance Criteria

1. **Proyecto inicializado** con Vite react-ts template, estructura de carpetas completa creada
2. **Design tokens** en `tokens.css` con paleta completa, tipografía Nunito, spacing, border-radius, sombras, touch targets
3. **CSS reset** en `reset.css` con box-sizing y normalización
4. **ESLint + Prettier** configurados con reglas React/TypeScript
5. **Vitest** configurado con React Testing Library, al menos un test placeholder passing
6. **CSP configurada** en `staticwebapp.config.json`
7. **Breakpoints responsive** como custom properties CSS
8. **Named exports** enforced (no default exports) — regla ESLint
9. **`npm run dev`** inicia sin errores
10. **`npm run build`** produce bundle estático en `/dist`
11. **Framer Motion** instalado como dependencia

## Tasks / Subtasks

- [x] Task 1: Scaffold Vite (AC: #1)
  - [x] Ejecutar `npm create vite@latest . -- --template react-ts` en directorio del proyecto
  - [x] Instalar dependencias: `npm install`
  - [x] Instalar Framer Motion: `npm install framer-motion` (AC: #11)
  - [x] Instalar Nunito font: añadir `@fontsource/nunito` o link en index.html
  - [x] Verificar `npm run dev` funciona (AC: #9)
  - [x] Verificar `npm run build` produce `/dist` (AC: #10)
- [x] Task 2: Crear estructura de carpetas (AC: #1)
  - [x] Crear `src/components/` (vacío, con `.gitkeep`)
  - [x] Crear `src/screens/` (vacío)
  - [x] Crear `src/contexts/` (vacío)
  - [x] Crear `src/services/` (vacío)
  - [x] Crear `src/hooks/` (vacío)
  - [x] Crear `src/data/` (vacío)
  - [x] Crear `src/styles/` (para tokens y reset)
  - [x] Crear `src/types/` (vacío)
  - [x] Crear `src/assets/avatars/` y `src/assets/worlds/` (vacíos)
- [x] Task 3: Design tokens CSS (AC: #2, #7)
  - [x] Crear `src/styles/tokens.css` con todas las variables CSS
  - [x] Paleta: --color-cream, --color-coral, --color-mint, --color-lavender, --color-sun, --color-sky, más colores de mundo Selva
  - [x] Tipografía: Nunito, escalas --font-size-xs a --font-size-display (32px-80px)
  - [x] Spacing: --space-xs (4px) a --space-3xl (64px), base 4px
  - [x] Border radius: --radius-sm (8px), --radius-md (12px), --radius-lg (16px), --radius-xl (24px), --radius-full (9999px)
  - [x] Sombras: --shadow-sm, --shadow-md, --shadow-lg, --shadow-glow, --shadow-drag
  - [x] Touch targets: --touch-min (48px), --touch-game (56px), --touch-letter (64px), --touch-dice (80px)
  - [x] Breakpoints: --bp-mobile (568px), --bp-tablet (768px), --bp-optimal (1024px), --bp-desktop (1440px)
  - [x] Timing: --duration-fast (100ms), --duration-normal (200ms), --duration-slow (300ms), --easing-bounce, --easing-smooth
- [x] Task 4: CSS Reset (AC: #3)
  - [x] Crear `src/styles/reset.css` con box-sizing: border-box, margin/padding reset, font smoothing
  - [x] Importar en main.tsx antes de tokens
- [x] Task 5: ESLint + Prettier (AC: #4, #8)
  - [x] Instalar ESLint con configuración React/TypeScript
  - [x] Instalar Prettier y plugin ESLint
  - [x] Configurar regla no-restricted-exports o equivalente para no default exports (AC: #8)
  - [x] Configurar regla no-explicit-any
  - [x] Crear `.prettierrc` con singleQuote, trailingComma, semi
  - [x] Agregar scripts: `"lint": "eslint src"`, `"format": "prettier --write src"`
- [x] Task 6: Vitest (AC: #5)
  - [x] Instalar vitest, @testing-library/react, @testing-library/jest-dom, jsdom
  - [x] Crear `vitest.config.ts` con environment jsdom
  - [x] Crear test placeholder `src/App.test.tsx` que pase
  - [x] Agregar script: `"test": "vitest run"`, `"test:watch": "vitest"`
- [x] Task 7: CSP + Azure config (AC: #6)
  - [x] Crear `staticwebapp.config.json` en raíz del proyecto
  - [x] Configurar CSP header: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'`
  - [x] Configurar navigationFallback para SPA routing
- [x] Task 8: App.tsx limpio (AC: #1)
  - [x] Limpiar App.tsx del boilerplate de Vite
  - [x] Importar tokens.css y reset.css
  - [x] Placeholder con texto "SILABC" usando design tokens
  - [x] Eliminar archivos Vite innecesarios (App.css, assets/react.svg, etc.)

## Dev Notes

### Architecture Compliance — OBLIGATORIO

**De [architecture.md]:**

- **Starter:** `npm create vite@latest silabc -- --template react-ts` — NO usar Next.js, CRA, ni Preact
- **Styling:** CSS Modules — NO CSS-in-JS, NO Tailwind, NO inline styles (excepto Framer Motion dinámicos)
- **Named exports SIEMPRE** — `export { MyComponent }` NUNCA `export default`
- **No `any`** en TypeScript — usar tipos explícitos o `unknown`
- **No `export default`** — usar siempre named exports
- **Anti-patterns prohibidos:**
  - `export default` → usar named exports
  - `any` en TypeScript → usar tipos explícitos o `unknown`
  - CSS inline para layout/colores → usar CSS Modules + tokens
  - Estado global fuera de Context → no variables de módulo mutables
  - `useEffect` para lógica derivable → computación en render
- **Console logging:** Solo `console.warn` para degradaciones, `console.error` para fallos. Nunca `console.log` en producción
- **Framer Motion:** ~32KB bundle impact — instalar en esta story ya que es dependencia core

### Naming Patterns — OBLIGATORIO

**De [architecture.md] - Implementation Patterns:**

- **Componentes React:** PascalCase → `DiceRoller.tsx`
- **Módulo CSS:** match del componente → `DiceRoller.module.css`
- **Hooks custom:** camelCase con `use` → `useGameState.ts`
- **Services:** camelCase → `dictionaryService.ts`
- **Types:** PascalCase en `types.ts` por módulo → `game.ts`
- **Constantes:** UPPER_SNAKE_CASE → `GAME_CONSTANTS.ts`
- **Assets:** kebab-case → `avatar-monkey.svg`
- **CSS class references:** camelCase via CSS Modules → `styles.diceContainer`
- **Event handlers:** `handle{Event}` → `handleDiceTap`

### Design Token Values — EXACTOS

**De [ux-design-specification.md] - Visual Design Foundation:**

```css
/* Paleta principal */
--color-cream: #FFF8F0;        /* Fondo general */
--color-coral: #FF6B6B;        /* Acento primario, dado, sílaba anclada */
--color-mint: #00D2D3;         /* Éxito, validación */
--color-lavender: #A29BFE;     /* Interactivos secundarios */
--color-sun: #FECA57;          /* Destacados, estrellas */
--color-sky: #48DBFB;          /* Información, cielo */

/* Neutrales */
--color-text-primary: #2D3436;
--color-text-secondary: #636E72;
--color-white: #FFFFFF;
--color-surface: #FFEEF0;

/* Mundo Selva */
--color-selva-primary: #00B894;
--color-selva-secondary: #55A630;
--color-selva-accent: #FECA57;
--color-selva-bg-start: #E8F5E9;
--color-selva-bg-end: #C8E6C9;

/* Tipografía */
--font-family: 'Nunito', sans-serif;
--font-size-xs: 0.75rem;     /* 12px — UI mínimo */
--font-size-sm: 1rem;        /* 16px — labels */
--font-size-md: 1.25rem;     /* 20px — body */
--font-size-lg: 1.5rem;      /* 24px — headings */
--font-size-xl: 2rem;        /* 32px — letras */
--font-size-2xl: 2.5rem;     /* 40px — sílabas */
--font-size-3xl: 3rem;       /* 48px — dado */
--font-size-display: 5rem;   /* 80px — título */
--font-weight-regular: 400;
--font-weight-bold: 700;
--font-weight-extrabold: 800;

/* Spacing (base 4px) */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;

/* Border radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;

/* Sombras */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.16);
--shadow-glow: 0 0 20px rgba(255, 107, 107, 0.4);
--shadow-drag: 0 8px 24px rgba(0, 0, 0, 0.2);

/* Touch targets */
--touch-min: 48px;
--touch-game: 56px;
--touch-letter: 64px;
--touch-dice: 80px;

/* Breakpoints (para referencia — usar en media queries directamente) */
--bp-mobile: 568px;
--bp-tablet: 768px;
--bp-optimal: 1024px;
--bp-desktop: 1440px;

/* Timing */
--duration-fast: 100ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-dice: 800ms;
--easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

### CSP Configuration — EXACTA

**De [architecture.md] - Security & Privacy:**

```json
{
  "globalHeaders": {
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'"
  },
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/*.{css,js,svg,png,jpg,ico,json}"]
  }
}
```

### Project Structure — EXACTA

**De [architecture.md] - Project Structure:**

```
src/
  components/        # Componentes React reutilizables (por carpeta)
  screens/           # Screens del juego (uno por estado de navegación)
  contexts/          # React Contexts + reducers
  services/          # Lógica de negocio pura (sin React)
  hooks/             # Custom hooks compartidos
  data/              # Datos estáticos (dictionary.json)
  styles/            # CSS global, tokens, reset
    tokens.css
    reset.css
  types/             # Types compartidos
  assets/            # SVGs, imágenes
    avatars/
    worlds/
  App.tsx
  main.tsx
```

**NO crear carpetas fuera de esta estructura.** NO crear `__tests__/` separado — tests co-locados con componentes.

### Security Requirements — CRÍTICO

- **NFR8:** App no transmite datos a servidor
- **NFR9:** No scripts de terceros (analytics, ads, tracking)
- **NFR11:** No enlaces externos
- **NFR12:** CSP bloquea recursos externos
- **FR31:** Sin enlaces externos, publicidad, formularios
- **FR32:** Sin comunicación de red durante gameplay

### Performance Budget

- **NFR3:** Total bundle <500KB gzipped (Framer Motion ~32KB ya cuenta)
- **NFR7:** Lighthouse ≥90 (verificar con página vacía tras scaffold)

### Project Structure Notes

- Estructura alineada 100% con [architecture.md] — no hay variaciones
- No crear archivos `.test.tsx` en esta story excepto el placeholder App.test.tsx
- Las carpetas vacías usan `.gitkeep` para commit

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/planning-artifacts/architecture.md#Security & Privacy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Visual Design Foundation]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design System Foundation]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Design & Accessibility]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Completion Notes List

- Used Vite 6.4.2 (create-vite@6) instead of latest — Node 20.17.0 incompatible with Vite 8+
- jsdom pinned to v24 — jsdom 27 has ESM/CJS issue with @csstools/css-calc on Node 20.17
- @fontsource/nunito used instead of Google Fonts CDN link (self-hosted, CSP compliant)
- eslint-visitor-keys EBADENGINE warning is cosmetic only — ESLint works correctly
- ESLint flat config (eslint.config.js) with prettier plugin, no-restricted-exports, no-explicit-any
- CSS imports in main.tsx: @fontsource/nunito weights → tokens.css → reset.css
- Framer Motion 12.38.0 installed as production dependency

### File List

**Archivos a CREAR (todos nuevos — greenfield):**

- `package.json` (generado por Vite + deps añadidas)
- `tsconfig.json` (generado por Vite)
- `tsconfig.node.json` (generado por Vite)
- `vite.config.ts` (generado por Vite)
- `vitest.config.ts` (nuevo)
- `.eslintrc.cjs` o `eslint.config.js` (nuevo)
- `.prettierrc` (nuevo)
- `.gitignore` (generado por Vite)
- `index.html` (generado por Vite, modificar para Nunito font)
- `staticwebapp.config.json` (nuevo)
- `src/main.tsx` (generado, modificar para imports CSS)
- `src/App.tsx` (generado, limpiar boilerplate)
- `src/App.test.tsx` (nuevo — test placeholder)
- `src/styles/tokens.css` (nuevo)
- `src/styles/reset.css` (nuevo)
- `src/components/.gitkeep` (nuevo)
- `src/screens/.gitkeep` (nuevo)
- `src/contexts/.gitkeep` (nuevo)
- `src/services/.gitkeep` (nuevo)
- `src/hooks/.gitkeep` (nuevo)
- `src/data/.gitkeep` (nuevo)
- `src/types/.gitkeep` (nuevo)
- `src/assets/avatars/.gitkeep` (nuevo)
- `src/assets/worlds/.gitkeep` (nuevo)

**Archivos a ELIMINAR (boilerplate Vite):**

- `src/App.css`
- `src/index.css`
- `src/assets/react.svg`
- `public/vite.svg`
