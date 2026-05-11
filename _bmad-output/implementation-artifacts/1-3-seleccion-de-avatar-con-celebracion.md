# Story 1.3: Selección de Avatar con Celebración

Status: done

## Story

As a **niño**,
I want **ver animales simpáticos y tocar el que más me guste para que salte de alegría**,
so that **me sienta bienvenido y elija mi compañero de juego**.

## Acceptance Criteria

1. **AvatarSelectScreen muestra 3 avatares animales** (Mono, Loro, Rana) como SVGs inline, cada uno con tamaño mínimo 48px y responsive (120px en selección) (FR1, NFR13, UX-DR8)
2. **Touch feedback al tocar avatar:** scale(1.08) en 100ms, release scale(1.0) en 200ms con easing-bounce (UX-DR15)
3. **Celebración al seleccionar:** el avatar ejecuta animación de saltar/bailar (1500ms) con Framer Motion (FR2, UX-DR8)
4. **Auto-avance tras celebración:** después de la animación de celebración, se navega automáticamente a NameInputScreen con transición animada (UX-DR16)
5. **PlayerContext creado** con `usePlayer()` hook — contiene: `avatarId`, `name` (string vacío), `wordsCompleted` (array vacío), `totalWordsCount` (0) (FR5)
6. **PlayerContext se actualiza** con el avatar seleccionado al confirmar la selección
7. **Accesibilidad:** cada avatar tiene `role="button"`, `aria-label` descriptivo (e.g. "Seleccionar mono"), la información no depende solo del color (formas distintas por animal) (NFR15, UX-DR14)
8. **`prefers-reduced-motion`** respetado: celebración sin animación (scale instantáneo, auto-avance inmediato) (NFR17)
9. **App.tsx actualizado** con `PlayerProvider` wrapping NavigationProvider (o dentro, según data flow)
10. **Tests** cubren: renderizado de 3 avatares, selección dispara celebración, PlayerContext se actualiza, navegación post-celebración, reduced-motion

## Tasks / Subtasks

- [x] Task 1: Crear tipos de jugador (AC: #5)
  - [x] Crear `src/types/player.ts`
  - [x] Definir `AvatarId = 'mono' | 'loro' | 'rana'`
  - [x] Definir `PlayerState`: `{ avatarId: AvatarId | null; name: string; wordsCompleted: string[]; totalWordsCount: number }`
  - [x] Definir `PlayerAction` discriminated union: `SET_AVATAR`, `SET_NAME`, `RESET_PLAYER`

- [x] Task 2: Crear PlayerContext (AC: #5, #6)
  - [x] Crear `src/contexts/PlayerContext.tsx`
  - [x] Implementar `playerReducer` con switch sobre action types
  - [x] `SET_AVATAR`: actualiza `avatarId` con payload `AvatarId`
  - [x] `SET_NAME`: actualiza `name` con payload `string`
  - [x] `RESET_PLAYER`: vuelve a estado inicial
  - [x] Estado inicial: `{ avatarId: null, name: '', wordsCompleted: [], totalWordsCount: 0 }`
  - [x] Exponer via hook `usePlayer()` — NUNCA usar `useContext()` directo
  - [x] Named export: `export { PlayerProvider, usePlayer }`
  - [x] Crear `src/contexts/PlayerContext.test.tsx` con tests del reducer y hook

- [x] Task 3: Crear SVGs de avatares (AC: #1, #7)
  - [x] Crear `src/assets/avatars/avatar-mono.svg` — mono simpático, estilo cartoon infantil, formas redondeadas
  - [x] Crear `src/assets/avatars/avatar-loro.svg` — loro colorido, estilo cartoon infantil
  - [x] Crear `src/assets/avatars/avatar-rana.svg` — rana amigable, estilo cartoon infantil
  - [x] Cada SVG optimizado: viewBox definido, sin IDs conflictivos, colores inline, accesible
  - [x] Verificar que las formas son distinguibles sin color (NFR15)

- [x] Task 4: Crear componente AvatarCard (AC: #1, #2, #3, #7, #8)
  - [x] Crear `src/components/AvatarCard/AvatarCard.tsx`
  - [x] Crear `src/components/AvatarCard/AvatarCard.module.css`
  - [x] Props: `avatarId: AvatarId`, `selected: boolean`, `onSelect: (id: AvatarId) => void`, `celebrating: boolean`
  - [x] Renderizar SVG correspondiente según `avatarId`
  - [x] Framer Motion: `whileTap={{ scale: 1.08 }}` con `transition={{ duration: 0.1 }}`
  - [x] Celebración: variants `celebrating` con keyframes [scale 1→1.2→0.8→1.1→1.0] + [y 0→-30→0→-15→0] durante 1500ms
  - [x] `useReducedMotion()`: si true, celebración instantánea (sin animación, scale directo)
  - [x] `role="button"`, `aria-label="Seleccionar {nombre del animal}"`, `tabIndex={0}`
  - [x] Keyboard: Enter/Space disparan `onSelect`
  - [x] Tamaño: 120px en pantalla de selección, con fondo circular redondeado (--radius-full)
  - [x] CSS: borde suave, sombra `--shadow-sm` idle → `--shadow-md` hover, fondo `--color-surface`
  - [x] Estado selected: borde color `--color-coral`, sombra `--shadow-glow`
  - [x] Crear `src/components/AvatarCard/AvatarCard.test.tsx`

- [x] Task 5: Reemplazar AvatarSelectScreen placeholder (AC: #1, #2, #3, #4, #6, #7)
  - [x] Reemplazar contenido de `src/screens/AvatarSelectScreen/AvatarSelectScreen.tsx`
  - [x] Actualizar `src/screens/AvatarSelectScreen/AvatarSelectScreen.module.css`
  - [x] Mostrar título "¡Elige tu compañero!" con tipografía Nunito `--font-size-2xl` y color `--color-text-primary`
  - [x] Grid de 3 AvatarCards centrada horizontal y verticalmente
  - [x] Layout: `display: flex; gap: var(--space-xl); justify-content: center; align-items: center`
  - [x] Al tocar un avatar: marcar como `selected`, disparar `celebrating: true`
  - [x] Después de celebración (1500ms timeout, o 0ms si reduced-motion): dispatch `SET_AVATAR` al PlayerContext + dispatch `NAVIGATE_TO` 'name-input'
  - [x] Usar `useNavigation()` para navegar y `usePlayer()` para guardar avatar
  - [x] Si ya hay avatar seleccionado en contexto y user vuelve: mostrar el previamente seleccionado como `selected`
  - [x] Crear `src/screens/AvatarSelectScreen/AvatarSelectScreen.test.tsx` reemplazando test existente si lo hubiera

- [x] Task 6: Actualizar App.tsx con PlayerProvider (AC: #9)
  - [x] Importar `PlayerProvider` de `src/contexts/PlayerContext.tsx`
  - [x] Wrapping order: `<PlayerProvider>` envuelve `<NavigationProvider>` (PlayerContext es independiente de navegación, puede estar por fuera)
  - [x] Verificar que ScreenManager sigue funcionando correctamente
  - [x] Actualizar `src/App.test.tsx` si existe

- [x] Task 7: Tests de integración (AC: #10)
  - [x] Test AvatarSelectScreen: renderiza 3 avatares con role="button"
  - [x] Test AvatarSelectScreen: click en avatar dispara celebración visual
  - [x] Test AvatarSelectScreen: PlayerContext se actualiza con avatarId seleccionado
  - [x] Test AvatarSelectScreen: navegación a 'name-input' después de celebración
  - [x] Test AvatarSelectScreen: keyboard Enter/Space selecciona avatar
  - [x] Test AvatarSelectScreen: reduced-motion salta animación y navega inmediatamente
  - [x] Test PlayerContext: dispatch SET_AVATAR actualiza state
  - [x] Test PlayerContext: dispatch SET_NAME actualiza state
  - [x] Test PlayerContext: usePlayer() fuera de provider lanza error

## Dev Notes

### Architecture Compliance — OBLIGATORIO

**De [architecture.md]:**

- **Context pattern:** Cada contexto expone un custom hook (`usePlayer()`). Nunca `useContext()` directo
- **Reducers:** switch con tipos discriminados (union types), state updates inmutables (spread)
- **Componente interno (orden):** 1) Imports 2) Types 3) Component function 4) Hooks al inicio 5) Derived state 6) Event handlers 7) Render
- **No `React.FC`** — funciones normales con tipo de retorno implícito
- **Named exports SIEMPRE** — `export { MyComponent }` NUNCA `export default`
- **No `any`** — tipos explícitos o `unknown`
- **CSS Modules** — NO CSS-in-JS, NO inline styles (excepto Framer Motion dinámicos como `scale`, `y`, `opacity`)
- **Tests co-locados** con componentes, NO carpeta `__tests__/` separada
- **Anti-patterns prohibidos:** `export default`, `any`, CSS inline para layout/colores, estado global fuera de Context, `useEffect` para lógica derivable
- **Props pattern:** Destructure en firma de función, defaults via `= defaultValue`, no React.FC

### Framer Motion Patterns — OBLIGATORIO

**De [architecture.md] y [ux-design-specification.md]:**

- Variants definidos FUERA del componente como constantes
- Nombres de variants: `initial`, `animate`, `exit`, `hover`, `tap`
- `useReducedMotion()` check en cada componente animado
- Fallback: `animate={shouldReduce ? {} : variants.animate}`
- Touch feedback estándar: `whileTap={{ scale: 1.08 }}` con `transition={{ duration: 0.1 }}`
- Release: scale(1.0) en 200ms con `--easing-bounce` = `cubic-bezier(0.34, 1.56, 0.64, 1)`

**Celebración del avatar (secuencia):**
```
Trigger: avatar tocado
1. Scale up → jump (y: -30px) → land → small bounce → settle (1500ms total)
2. Post-celebración: auto-navegar a NameInput (sin segundo tap)
3. Reduced-motion: omitir animación, navegar inmediatamente
```

### Avatar Component Specs — EXACTO

**De [ux-design-specification.md]:**

| Propiedad | Valor |
|---|---|
| Tamaño selección | 120px |
| Tamaño gameplay | 60-80px (no aplica a este story) |
| Variantes MVP | Mono, Loro, Rana |
| Animación idle | Respirar (scale 1.0-1.02) loop 3s |
| Animación celebrating | Saltar + girar + brazos arriba, 1500ms |
| Accesibilidad | `role="button"`, `aria-label` descriptivo |

### PlayerContext State Shape — EXACTO

**De [architecture.md]:**
```typescript
// src/types/player.ts
type AvatarId = 'mono' | 'loro' | 'rana';

interface PlayerState {
  avatarId: AvatarId | null;
  name: string;
  wordsCompleted: string[];
  totalWordsCount: number;
}

type PlayerAction =
  | { type: 'SET_AVATAR'; payload: AvatarId }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'RESET_PLAYER' };
```

**Nota:** La persistencia en LocalStorage se implementa en Epic 3 (storageService). En este story, PlayerContext es solo in-memory.

### SVG Avatar Guidelines

- Estilo: cartoon infantil, formas redondeadas, amigable
- Colores: usar paleta pastel del proyecto donde sea posible
- ViewBox: cuadrado (e.g. `viewBox="0 0 100 100"`) para facilitar sizing con CSS
- Sin IDs conflictivos (usar prefijos si necesario)
- Optimización: eliminar metadata, minimizar paths
- Cada animal debe ser distinguible por forma (NFR15) — no solo color

### Naming Patterns — OBLIGATORIO

- Componentes React: PascalCase → `AvatarCard.tsx`
- Módulo CSS: match del componente → `AvatarCard.module.css`
- Types: PascalCase en archivo dedicado → `player.ts`
- Context: `PlayerContext.tsx`, hook `usePlayer()`
- Assets SVG: kebab-case → `avatar-mono.svg`, `avatar-loro.svg`, `avatar-rana.svg`
- Event handlers: `handle{Event}` → `handleAvatarSelect`
- CSS class references: camelCase via CSS Modules → `styles.avatarGrid`

### Previous Story Intelligence (Story 1.2)

**Learnings from Story 1.2:**
- NavigationContext ya creado: `useNavigation()` disponible con `dispatch({ type: 'NAVIGATE_TO', payload: 'name-input' })`
- ScreenManager renderiza `AvatarSelectScreen` como screen activa inicial (currentScreen: 'avatar-select')
- AnimatePresence con fade+slide ya funciona para transiciones
- `useReducedMotion()` de Framer Motion ya se usa en ScreenManager
- matchMedia mock ya configurado en `src/test-setup.ts` para jsdom
- Placeholder AvatarSelectScreen existe en `src/screens/AvatarSelectScreen/` — reemplazar contenido, NO crear carpeta nueva
- Pattern: named exports, CSS Modules, co-located tests
- Tests existentes: 10 passing con Vitest + RTL + jsdom 24

**Archivos que se MODIFICAN (no crear nuevos en estas rutas):**
- `src/screens/AvatarSelectScreen/AvatarSelectScreen.tsx` — reemplazar placeholder
- `src/screens/AvatarSelectScreen/AvatarSelectScreen.module.css` — actualizar estilos
- `src/App.tsx` — agregar PlayerProvider

**Archivos NUEVOS a crear:**
- `src/types/player.ts`
- `src/contexts/PlayerContext.tsx`
- `src/contexts/PlayerContext.test.tsx`
- `src/components/AvatarCard/AvatarCard.tsx`
- `src/components/AvatarCard/AvatarCard.module.css`
- `src/components/AvatarCard/AvatarCard.test.tsx`
- `src/assets/avatars/avatar-mono.svg`
- `src/assets/avatars/avatar-loro.svg`
- `src/assets/avatars/avatar-rana.svg`
- `src/screens/AvatarSelectScreen/AvatarSelectScreen.test.tsx`

### Forward Context (Stories 1.4, Epic 2, Epic 3)

- **Story 1.4** (NameInputScreen): usará `usePlayer()` para guardar nombre (`SET_NAME`), usará `useNavigation()` para ir a WorldSelect
- **Epic 2** (Gameplay): usará `usePlayer()` para mostrar avatar seleccionado en gameplay (60-80px)
- **Epic 3** (Persistencia): StorageService guardará/cargará PlayerState de LocalStorage

### Security Requirements — CRÍTICO

- **NFR8:** App no transmite datos a servidor
- **NFR9:** No scripts de terceros
- **FR31:** Sin enlaces externos
- **FR32:** Sin comunicación de red durante gameplay

### Project Structure Notes

- PlayerContext sigue el mismo patrón que NavigationContext (ver `src/contexts/NavigationContext.tsx`)
- AvatarCard es un componente reutilizable (usado en selección y luego en gameplay), va en `src/components/`
- AvatarSelectScreen es la screen, va en `src/screens/`
- Tipos compartidos van en `src/types/`
- Assets SVG van en `src/assets/avatars/` (la carpeta ya existe con .gitkeep)

### Testing Tech Stack (Pinned)

- Vitest 4.1.6
- @testing-library/react 16.3.2
- @testing-library/jest-dom 6.4.2 (pinned — NO actualizar)
- jsdom 24 (pinned — NO actualizar, v27 tiene issue ESM con Node 20.17)
- matchMedia mock ya en `src/test-setup.ts`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3]
- [Source: _bmad-output/planning-artifacts/architecture.md#State Management Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Animation Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Avatar component]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Micro-interacciones táctiles]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 1: Valentina]
- [Source: _bmad-output/planning-artifacts/prd.md#FR1, FR2, FR5, NFR13, NFR15, NFR17]
- [Source: _bmad-output/implementation-artifacts/1-2-screenmanager-navegacion-por-estado-y-orientacion.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Debug Log References

- Framer Motion ease type: `string` not assignable to `Easing` — fixed by using `[0.42, 0, 0.58, 1] as const` tuple
- ScreenManager tests failed: AvatarSelectScreen now requires PlayerProvider — added PlayerProvider wrapper to test
- App.test.tsx text changed from "Avatar Select" to "¡Elige tu compañero!" — updated assertion

### Completion Notes List

- Task 1: Created `src/types/player.ts` with `AvatarId`, `PlayerState`, `PlayerAction` types
- Task 2: Created `src/contexts/PlayerContext.tsx` with `playerReducer`, `usePlayer()` hook, `PlayerProvider` — 5 tests passing
- Task 3: Created 3 SVG avatars (mono, loro, rana) in `src/assets/avatars/` — cartoon style, distinguishable by shape (NFR15)
- Task 4: Created `src/components/AvatarCard/` with Framer Motion celebration animation, touch feedback, keyboard support, a11y — 7 tests
- Task 5: Replaced AvatarSelectScreen placeholder with real avatar grid, celebration flow, auto-navigation — 8 tests
- Task 6: Updated App.tsx with PlayerProvider wrapping NavigationProvider, updated App.test.tsx
- Task 7: Full integration test suite in AvatarSelectScreen.test.tsx covering selection, keyboard, celebration, navigation
- Build: 335KB JS (107KB gzip) — within 500KB budget
- All 30 tests passing, zero regressions

### File List

**New:**
- src/types/player.ts
- src/contexts/PlayerContext.tsx
- src/contexts/PlayerContext.test.tsx
- src/assets/avatars/avatar-mono.svg
- src/assets/avatars/avatar-loro.svg
- src/assets/avatars/avatar-rana.svg
- src/components/AvatarCard/AvatarCard.tsx
- src/components/AvatarCard/AvatarCard.module.css
- src/components/AvatarCard/AvatarCard.test.tsx
- src/screens/AvatarSelectScreen/AvatarSelectScreen.test.tsx

**Modified:**
- src/screens/AvatarSelectScreen/AvatarSelectScreen.tsx (replaced placeholder)
- src/screens/AvatarSelectScreen/AvatarSelectScreen.module.css (updated layout)
- src/App.tsx (added PlayerProvider)
- src/App.test.tsx (updated assertion text)
- src/components/ScreenManager/ScreenManager.test.tsx (added PlayerProvider wrapper)

**Deleted:**
- src/assets/avatars/.gitkeep

