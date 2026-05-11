# Story 1.2: ScreenManager, Navegación por Estado y Orientación

Status: done

## Story

As a **niño**,
I want **que la app detecte si mi tableta está en vertical y me pida rotarla con una animación amigable**,
so that **siempre vea el juego en la orientación correcta sin confusión**.

## Acceptance Criteria

1. **ScreenManager renderiza screen activa** según estado del contexto, con transiciones AnimatePresence fade+slide (300ms, `--easing-smooth`) (UX-DR16)
2. **OrientationOverlay** aparece en portrait con animación de rotación y avatar SVG amigable, bloqueando interacción (FR7, UX-DR2)
3. **OrientationOverlay desaparece** al rotar a landscape, sin botón de cerrar
4. **`prefers-reduced-motion`** respetado: transiciones instantáneas sin animación (NFR17)
5. **`:focus-visible`** con outline 3px azul en todos los elementos interactivos al navegar con teclado (NFR18)
6. **Screen type** definido como union type: `'avatar-select' | 'name-input' | 'world-select' | 'gameplay' | 'summary' | 'welcome'`
7. **NavigationContext** (o AppContext) con `currentScreen` state y `dispatch` para cambiar screen
8. **Transición directional:** forward = slide-left, back = slide-right (20px translateX)
9. **App.tsx** actualizado como Provider wrapper + ScreenManager
10. **Placeholder screens** para cada tipo con texto identificador (para testing y stories futuras)
11. **HomeButton** visible en esquina superior-derecha en todas las screens excepto la inicial, con `aria-label="Volver al inicio"` (FR8)

## Tasks / Subtasks

- [x] Task 1: Crear types de navegación (AC: #6)
  - [x] Crear `src/types/navigation.ts` con `Screen` union type
  - [x] Definir `NavigationState` interface: `{ currentScreen: Screen; previousScreen: Screen | null; direction: 'forward' | 'back' }`
  - [x] Definir `NavigationAction` discriminated union: `NAVIGATE_TO`, `GO_HOME`
- [x] Task 2: Crear NavigationContext (AC: #7)
  - [x] Crear `src/contexts/NavigationContext.tsx`
  - [x] Implementar `navigationReducer` con switch sobre action types
  - [x] `NAVIGATE_TO`: actualiza `currentScreen`, guarda `previousScreen`, direction = 'forward'
  - [x] `GO_HOME`: navega a 'avatar-select' (new user) o 'welcome' (returning), direction = 'back'
  - [x] Exponer via hook `useNavigation()` — NUNCA usar `useContext()` directo
  - [x] Estado inicial: `{ currentScreen: 'avatar-select', previousScreen: null, direction: 'forward' }`
  - [x] Named export: `export { NavigationProvider, useNavigation }`
- [x] Task 3: Crear ScreenManager (AC: #1, #8)
  - [x] Crear `src/components/ScreenManager/ScreenManager.tsx`
  - [x] Crear `src/components/ScreenManager/ScreenManager.module.css`
  - [x] Usar `useNavigation()` para obtener `currentScreen` y `direction`
  - [x] Renderizar screen activa con `AnimatePresence` mode="wait"
  - [x] Variants: `initial` (opacity 0, x: direction === 'forward' ? 20 : -20), `animate` (opacity 1, x: 0), `exit` (opacity 0, x: direction === 'forward' ? -20 : 20)
  - [x] Duración: 0.3s, easing: `[0.4, 0, 0.2, 1]` (equivale a `--easing-smooth`)
  - [x] `useReducedMotion()` de Framer Motion: si true, duración = 0
  - [x] Key del AnimatePresence = `currentScreen` para trigger de transición
  - [x] Crear `src/components/ScreenManager/ScreenManager.test.tsx`
- [x] Task 4: Crear placeholder screens (AC: #10)
  - [x] Crear carpetas con componente placeholder para cada screen:
    - `src/screens/AvatarSelectScreen/AvatarSelectScreen.tsx` + `.module.css`
    - `src/screens/NameInputScreen/NameInputScreen.tsx` + `.module.css`
    - `src/screens/WorldSelectScreen/WorldSelectScreen.tsx` + `.module.css`
    - `src/screens/GameplayScreen/GameplayScreen.tsx` + `.module.css`
    - `src/screens/SummaryScreen/SummaryScreen.tsx` + `.module.css`
    - `src/screens/WelcomeScreen/WelcomeScreen.tsx` + `.module.css`
  - [x] Cada placeholder: div con nombre de screen como heading, usando tokens CSS
  - [x] Cada placeholder: named export `export { XxxScreen }`
- [x] Task 5: Crear OrientationOverlay (AC: #2, #3)
  - [x] Crear `src/components/OrientationOverlay/OrientationOverlay.tsx`
  - [x] Crear `src/components/OrientationOverlay/OrientationOverlay.module.css`
  - [x] Detección vía CSS media query `@media (orientation: portrait)` — mostrar overlay
  - [x] Implementar hook `useOrientation()` en `src/hooks/useOrientation.ts` con `matchMedia('(orientation: portrait)')`
  - [x] Visual: fondo semi-transparente (`rgba(0,0,0,0.5)`), animalito SVG inline girando una tablet
  - [x] Animación de rotación: CSS keyframe loop continuo (rotate icon 0→90deg loop)
  - [x] Sin botón de cerrar — desaparece automáticamente al detectar landscape
  - [x] `prefers-reduced-motion`: animación estática (icono fijo, texto "Gira tu dispositivo")
  - [x] `aria-live="polite"` con mensaje "Por favor, gira tu dispositivo a horizontal"
  - [x] Crear test: `src/components/OrientationOverlay/OrientationOverlay.test.tsx`
- [x] Task 6: Crear HomeButton (AC: #11)
  - [x] Crear `src/components/HomeButton/HomeButton.tsx`
  - [x] Crear `src/components/HomeButton/HomeButton.module.css`
  - [x] Icono de casita SVG inline, 48x48px
  - [x] Posición: fixed/absolute esquina superior-derecha
  - [x] `aria-label="Volver al inicio"`, `role="button"`
  - [x] `opacity: 0.7` idle, `opacity: 1.0` on hover/focus
  - [x] Touch feedback: `scale(1.05)` on press, spring back
  - [x] Click → `dispatch({ type: 'GO_HOME' })`
  - [x] Oculto en screen inicial (`avatar-select` / `welcome`)
  - [x] `:focus-visible` con outline `3px solid var(--color-sky)`
- [x] Task 7: Configurar focus-visible global (AC: #5)
  - [x] Agregar en `reset.css` regla `:focus-visible` global: `outline: 3px solid var(--color-sky); outline-offset: 2px;`
  - [x] Agregar `:focus:not(:focus-visible) { outline: none; }` para evitar ring en touch
- [x] Task 8: Actualizar App.tsx (AC: #9)
  - [x] Wrap con `NavigationProvider`
  - [x] Renderizar `<ScreenManager />`
  - [x] Renderizar `<OrientationOverlay />`
  - [x] Renderizar `<HomeButton />`
  - [x] Eliminar placeholder "SILABC" actual
  - [x] Eliminar inline styles — usar CSS Module si necesario
- [x] Task 9: Tests de integración (AC: #1, #2, #4, #5)
  - [x] Test ScreenManager: renderiza screen correcta según state
  - [x] Test ScreenManager: cambio de screen dispara transición
  - [x] Test NavigationContext: dispatch NAVIGATE_TO cambia screen
  - [x] Test NavigationContext: dispatch GO_HOME navega a screen inicial
  - [x] Test OrientationOverlay: se renderiza condicionalmente
  - [x] Test HomeButton: dispatch GO_HOME al click
  - [x] Test reduced-motion: transiciones con duración 0

## Dev Notes

### Architecture Compliance — OBLIGATORIO

**De [architecture.md]:**

- **Navegación:** State-based (sin router). Componente `ScreenManager` renderiza screen activa basado en estado del contexto
- **Screens:** `AvatarSelect` | `NameInput` | `WorldSelect` | `Gameplay` | `Summary` | `Welcome` (returning player)
- **Context pattern:** Cada contexto expone un custom hook. Nunca `useContext()` directo
- **Reducers:** switch con tipos discriminados (union types), state updates inmutables (spread)
- **Componente interno (orden):** 1) Imports 2) Types 3) Component function 4) Hooks al inicio 5) Derived state 6) Event handlers 7) Render
- **No `React.FC`** — funciones normales con tipo de retorno implícito
- **Named exports SIEMPRE** — `export { MyComponent }` NUNCA `export default`
- **No `any`** — tipos explícitos o `unknown`
- **CSS Modules** — NO CSS-in-JS, NO inline styles (excepto Framer Motion dinámicos)
- **Tests co-locados** con componentes, NO carpeta `__tests__/` separada
- **Anti-patterns prohibidos:** `export default`, `any`, CSS inline para layout/colores, estado global fuera de Context, `useEffect` para lógica derivable

**Data Flow (unidireccional):**
```
User action → Context (dispatch action) → reducer → state update
                       ↓
               ScreenManager (renderiza screen activa)
                       ↓
               Components (renderizan UI + animaciones)
```

### Framer Motion Patterns — OBLIGATORIO

**De [architecture.md] y [ux-design-specification.md]:**

- Variants definidos FUERA del componente como constantes
- Nombres de variants: `initial`, `animate`, `exit`, `hover`, `tap`
- `useReducedMotion()` check en cada componente animado
- Fallback: `animate={shouldReduce ? {} : variants.animate}`
- AnimatePresence mode="wait" para transiciones entre screens

**Transiciones entre screens:**
```
Tipo: Fade (opacity 0→1) + Slide (translateX 20px→0)
Duración: 300ms
Easing: --easing-smooth = cubic-bezier(0.4, 0, 0.2, 1) = [0.4, 0, 0.2, 1]
Direction: Forward (slide left), Back (slide right)
Regla: Nunca hay un frame vacío
```

### Orientation Overlay — EXACTO

**De [ux-design-specification.md]:**

- Overlay que aparece en portrait pidiendo rotar el dispositivo
- Visual: fondo semi-transparente + animalito SVG girando una tablet con animación loop
- Comportamiento: aparece/desaparece con orientación. Sin botón de cerrar
- Detección: `@media (orientation: portrait)` CSS media query
- Edge case: si no gira → loop de invitación ambiental (animación continua)

### Focus & Accessibility — OBLIGATORIO

**De [ux-design-specification.md] y [prd.md]:**

- `:focus-visible` only — no ring on touch
- Outline: 3px azul (`--color-sky`)
- Touch targets ≥ 48px (NFR13)
- `prefers-reduced-motion` → animaciones instantáneas (NFR17)
- HTML semántico: `role`, `aria-label`, `aria-live`
- Keyboard: Tab entre elementos, Enter/Space para activar, Escape = Home

### HomeButton Specs — EXACTO

**De [ux-design-specification.md]:**

- Icono de casita, 48x48px, esquina superior derecha
- No compite visualmente con acciones primarias: `opacity: 0.7` idle, `1.0` on touch
- Sin confirmación al tocar (niños no entienden "¿estás seguro?")
- `aria-label="Volver al inicio"`

### Naming Patterns — OBLIGATORIO

- Componentes React: PascalCase → `ScreenManager.tsx`
- Módulo CSS: match del componente → `ScreenManager.module.css`
- Hooks custom: camelCase con `use` → `useNavigation.ts`, `useOrientation.ts`
- Types: PascalCase en archivo dedicado → `navigation.ts`
- CSS class references: camelCase via CSS Modules → `styles.overlay`
- Event handlers: `handle{Event}` → `handleNavigate`

### Previous Story Intelligence (Story 1.1)

**Learnings from Story 1.1:**
- Vite 6.4.2 en uso (Node 20.17.0 — no se puede actualizar)
- jsdom pinned a v24 por incompatibilidad ESM con Node 20.17
- @fontsource/nunito self-hosted (CSP compliant)
- Framer Motion 12.38.0 ya instalado como production dependency
- ESLint flat config (eslint.config.js) con prettier, no-restricted-exports, no-explicit-any
- Design tokens ya definidos en `src/styles/tokens.css`
- Reset CSS en `src/styles/reset.css`
- Vitest + RTL configurado con jsdom v24, test-setup.ts con jest-dom

**Archivos establecidos en Story 1.1 (NO modificar estructura):**
- `package.json`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tsconfig.app.json`
- `src/styles/tokens.css`, `src/styles/reset.css`
- `src/test-setup.ts`
- `staticwebapp.config.json`, `.prettierrc`, `eslint.config.js`
- Carpetas con `.gitkeep`: components, screens, contexts, services, hooks, data, types, assets/avatars, assets/worlds

### Project Structure Notes

- ScreenManager va en `src/components/ScreenManager/` (es componente, no screen)
- Cada screen va en `src/screens/{ScreenName}/` con su `.module.css`
- NavigationContext va en `src/contexts/`
- Hook useOrientation va en `src/hooks/`
- Types de navegación van en `src/types/`
- Eliminar `.gitkeep` de carpetas que ya tienen archivos

### Forward Context (Stories 1.3 y 1.4)

- **Story 1.3** (AvatarSelectScreen): reemplazará el placeholder con grid de avatares, usará `useNavigation()` para navegar a NameInput
- **Story 1.4** (NameInputScreen): reemplazará placeholder, usará `useNavigation()` para navegar a WorldSelect
- Los placeholders creados aquí serán reemplazados pero deben tener la estructura correcta (carpeta + component + CSS Module)

### Security Requirements — CRÍTICO

- **NFR8:** App no transmite datos a servidor
- **NFR9:** No scripts de terceros
- **FR31:** Sin enlaces externos
- **FR32:** Sin comunicación de red durante gameplay

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Navigation: State-based]
- [Source: _bmad-output/planning-artifacts/architecture.md#State Management Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Animation Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines]
- [Source: _bmad-output/planning-artifacts/architecture.md#Complete Project Directory Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Patrón de Transiciones]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#OrientationOverlay]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Design & Accessibility]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Patrón de Navegación]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Checklist de Accesibilidad]
- [Source: _bmad-output/planning-artifacts/prd.md#FR7, FR8, NFR13, NFR17, NFR18]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Completion Notes List

- NavigationContext: useReducer con switch discriminado, hook useNavigation(), GO_HOME siempre navega a avatar-select (no hay StorageService aún para detectar returning)
- ScreenManager: AnimatePresence mode="wait", motion.div con initial/animate/exit, useReducedMotion() para duración 0
- OrientationOverlay: useOrientation hook con matchMedia listener, SVG inline de tablet con rotación CSS keyframe, prefers-reduced-motion desactiva animación
- HomeButton: hidden en avatar-select y welcome via Set, SVG casita inline, opacity 0.7→1.0, scale(1.05) on active
- focus-visible global en reset.css con --color-sky, :focus:not(:focus-visible) suprime outline en touch
- matchMedia mock añadido a test-setup.ts para que jsdom soporte window.matchMedia
- 6 placeholder screens creados con CSS Modules individuales y colores únicos por screen
- Build: 327KB JS gzipped 104KB + 10.5KB CSS — dentro del budget de 500KB
- 10 tests pasando: 4 NavigationContext, 2 ScreenManager, 2 OrientationOverlay, 1 HomeButton, 1 App

### File List

**Archivos a CREAR:**

- `src/types/navigation.ts` (nuevo — Screen type, NavigationState, NavigationAction)
- `src/contexts/NavigationContext.tsx` (nuevo — provider, reducer, useNavigation hook)
- `src/components/ScreenManager/ScreenManager.tsx` (nuevo)
- `src/components/ScreenManager/ScreenManager.module.css` (nuevo)
- `src/components/ScreenManager/ScreenManager.test.tsx` (nuevo)
- `src/components/OrientationOverlay/OrientationOverlay.tsx` (nuevo)
- `src/components/OrientationOverlay/OrientationOverlay.module.css` (nuevo)
- `src/components/OrientationOverlay/OrientationOverlay.test.tsx` (nuevo)
- `src/components/HomeButton/HomeButton.tsx` (nuevo)
- `src/components/HomeButton/HomeButton.module.css` (nuevo)
- `src/hooks/useOrientation.ts` (nuevo)
- `src/screens/AvatarSelectScreen/AvatarSelectScreen.tsx` (nuevo — placeholder)
- `src/screens/AvatarSelectScreen/AvatarSelectScreen.module.css` (nuevo)
- `src/screens/NameInputScreen/NameInputScreen.tsx` (nuevo — placeholder)
- `src/screens/NameInputScreen/NameInputScreen.module.css` (nuevo)
- `src/screens/WorldSelectScreen/WorldSelectScreen.tsx` (nuevo — placeholder)
- `src/screens/WorldSelectScreen/WorldSelectScreen.module.css` (nuevo)
- `src/screens/GameplayScreen/GameplayScreen.tsx` (nuevo — placeholder)
- `src/screens/GameplayScreen/GameplayScreen.module.css` (nuevo)
- `src/screens/SummaryScreen/SummaryScreen.tsx` (nuevo — placeholder)
- `src/screens/SummaryScreen/SummaryScreen.module.css` (nuevo)
- `src/screens/WelcomeScreen/WelcomeScreen.tsx` (nuevo — placeholder)
- `src/screens/WelcomeScreen/WelcomeScreen.module.css` (nuevo)

**Archivos a MODIFICAR:**

- `src/App.tsx` (UPDATE — wrap con NavigationProvider, renderizar ScreenManager + OrientationOverlay + HomeButton)
- `src/styles/reset.css` (UPDATE — agregar reglas `:focus-visible`)

**Archivos a ELIMINAR:**

- `src/components/.gitkeep` (ya no necesario)
- `src/screens/.gitkeep` (ya no necesario)
- `src/contexts/.gitkeep` (ya no necesario)
- `src/hooks/.gitkeep` (ya no necesario)
- `src/types/.gitkeep` (ya no necesario)
