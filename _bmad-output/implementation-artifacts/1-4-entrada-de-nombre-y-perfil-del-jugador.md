# Story 1.4: Entrada de Nombre y Perfil del Jugador

Status: done

## Story

As a **niño**,
I want **poder escribir mi nombre opcionalmente con un teclado grande y fácil**,
so that **el juego me llame por mi nombre si quiero**.

## Acceptance Criteria

1. **NameInputScreen muestra input de texto grande** con tipografía Nunito ≥32px (`--font-size-xl`) y un botón "Saltar" prominente (FR3)
2. **Todos los botones tienen mínimo 48px** de touch target (NFR13)
3. **Input acepta nombre** y al confirmar, dispatch `SET_NAME` al PlayerContext con el texto ingresado
4. **Botón "Saltar"** navega a WorldSelect sin ingresar nombre (PlayerContext queda con `name: ''`, sin error FR21)
5. **Botón "Continuar" (✓)** confirma el nombre y navega a WorldSelect con transición animada (UX-DR16)
6. **Longitud máxima del nombre:** 12 caracteres (razonable para nombres infantiles, sin validación de formato)
7. **PlayerContext mantiene avatar seleccionado** de Story 1.3 — `name` se agrega sin sobrescribir `avatarId`
8. **Accesibilidad:** input con `aria-label`, botones con `aria-label` descriptivo, focus-visible funcional (NFR18)
9. **`prefers-reduced-motion`** respetado en la transición de navegación (NFR17)
10. **Avatar seleccionado visible** como feedback: mostrar el avatar elegido como acompañante visual en la pantalla
11. **Tests** cubren: renderizado de input y botones, confirmar nombre actualiza PlayerContext, saltar navega sin nombre, validación máxima longitud, keyboard Enter confirma

## Tasks / Subtasks

- [x] Task 1: Reemplazar NameInputScreen placeholder (AC: #1, #2, #3, #4, #5, #6, #7, #8, #10)
  - [x] Reemplazar contenido de `src/screens/NameInputScreen/NameInputScreen.tsx`
  - [x] Actualizar `src/screens/NameInputScreen/NameInputScreen.module.css`
  - [x] Mostrar avatar seleccionado usando `usePlayer()` state — importar avatar SVG según `avatarId`
  - [x] Input de texto: `type="text"`, `maxLength={12}`, `placeholder="Tu nombre..."`, `aria-label="Escribe tu nombre"`
  - [x] Tipografía del input: `--font-size-xl` (2rem/32px), font-family Nunito
  - [x] Botón "Continuar" (✓): visible solo si hay texto en el input, `aria-label="Confirmar nombre"`, touch target ≥48px
  - [x] Botón "Saltar →": siempre visible, `aria-label="Saltar sin nombre"`, touch target ≥48px
  - [x] Al confirmar: `playerDispatch({ type: 'SET_NAME', payload: name })` + `navDispatch({ type: 'NAVIGATE_TO', payload: 'world-select' })`
  - [x] Al saltar: `navDispatch({ type: 'NAVIGATE_TO', payload: 'world-select' })` (sin dispatch SET_NAME, name ya es '' por defecto)
  - [x] Keyboard Enter en input: equivale a confirmar (si hay texto) o saltar (si vacío)
  - [x] Layout: centrado vertical, input arriba, botones debajo, avatar a un lado o arriba

- [x] Task 2: Tests de NameInputScreen (AC: #11)
  - [x] Crear `src/screens/NameInputScreen/NameInputScreen.test.tsx`
  - [x] Test: renderiza input con aria-label y placeholder
  - [x] Test: renderiza botón "Saltar" siempre
  - [x] Test: botón "Continuar" aparece solo con texto en input
  - [x] Test: escribir nombre y confirmar actualiza PlayerContext
  - [x] Test: saltar navega sin error y sin nombre
  - [x] Test: input respeta maxLength 12
  - [x] Test: Enter en input con texto confirma
  - [x] Test: Enter en input vacío salta
  - [x] Test: muestra avatar seleccionado del contexto

## Dev Notes

### Architecture Compliance — OBLIGATORIO

- **Context pattern:** `usePlayer()` y `useNavigation()` — hooks existentes, no crear nuevos
- **Componente interno (orden):** 1) Imports 2) Types 3) Component function 4) Hooks al inicio 5) Derived state 6) Event handlers 7) Render
- **No `React.FC`** — funciones normales con tipo de retorno implícito
- **Named exports SIEMPRE** — `export { NameInputScreen }`
- **No `any`** — tipos explícitos
- **CSS Modules** — NO inline styles excepto Framer Motion dinámicos
- **Tests co-locados** con componentes

### Existing Code to Use (NO recrear)

**PlayerContext** (`src/contexts/PlayerContext.tsx`):
- `usePlayer()` → `{ state, dispatch }`
- `state.avatarId` — `AvatarId | null` (será mono/loro/rana tras Story 1.3)
- `dispatch({ type: 'SET_NAME', payload: string })` — ya implementado

**NavigationContext** (`src/contexts/NavigationContext.tsx`):
- `useNavigation()` → `{ state, dispatch }`
- `dispatch({ type: 'NAVIGATE_TO', payload: 'world-select' })` — navegar adelante

**Avatar images** (de Story 1.3):
```typescript
import avatarMono from '../../assets/avatars/avatar-mono.svg';
import avatarLoro from '../../assets/avatars/avatar-loro.svg';
import avatarRana from '../../assets/avatars/avatar-rana.svg';

const AVATAR_IMAGES: Record<AvatarId, string> = {
  mono: avatarMono,
  loro: avatarLoro,
  rana: avatarRana,
};
```

### Design Tokens Disponibles

```css
--font-size-xl: 2rem;          /* Input text (32px) */
--font-size-lg: 1.5rem;        /* Botones */
--font-size-md: 1.25rem;       /* Labels */
--font-family: 'Nunito';
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--color-cream: #FFF8F0;        /* Fondo pantalla */
--color-lavender: #A29BFE;     /* Color accent para esta screen */
--color-coral: #FF6B6B;        /* Botón confirmar */
--color-text-primary: #2D3436;
--color-text-secondary: #636E72;
--color-surface: #FFEEF0;
--color-white: #FFFFFF;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--shadow-sm: 0 2px 4px rgba(0,0,0,0.08);
--shadow-md: 0 4px 12px rgba(0,0,0,0.12);
--touch-min: 48px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--duration-normal: 200ms;
```

### Naming Patterns — OBLIGATORIO

- Archivo: `NameInputScreen.tsx` (ya existe como placeholder)
- CSS Module: `NameInputScreen.module.css` (ya existe)
- Event handlers: `handleConfirm`, `handleSkip`, `handleInputChange`, `handleKeyDown`
- CSS classes: camelCase → `styles.inputField`, `styles.skipButton`, `styles.confirmButton`

### Previous Story Intelligence (Story 1.3)

**Learnings:**
- Framer Motion ease type issue: usar `[0.42, 0, 0.58, 1] as const` en lugar de string `'easeInOut'`
- ScreenManager tests necesitan `PlayerProvider` wrapper — ya actualizado
- App.tsx ya tiene `<PlayerProvider>` envolviendo `<NavigationProvider>`
- matchMedia mock ya en `src/test-setup.ts`
- 30 tests passing actualmente — no romper ninguno

**Archivos que se MODIFICAN:**
- `src/screens/NameInputScreen/NameInputScreen.tsx` — reemplazar placeholder
- `src/screens/NameInputScreen/NameInputScreen.module.css` — actualizar estilos

**Archivos NUEVOS:**
- `src/screens/NameInputScreen/NameInputScreen.test.tsx`

### Security Requirements — CRÍTICO

- **NFR8:** No transmitir datos
- **FR21:** Nunca mostrar error al usuario
- **FR32:** Sin comunicación de red
- Input sanitization: `maxLength` previene overflow, no se transmite nada

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#State Management Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 1: Valentina]
- [Source: _bmad-output/planning-artifacts/prd.md#FR3, FR21, NFR8, NFR13, NFR18]
- [Source: _bmad-output/implementation-artifacts/1-3-seleccion-de-avatar-con-celebracion.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Debug Log References

- Unused `vi` import in test file caused tsc error — removed

### Completion Notes List

- Task 1: Replaced NameInputScreen placeholder with full implementation: avatar preview, text input (maxLength 12, Nunito 32px), confirm button (conditional), skip button (always visible), keyboard Enter support, proper a11y labels
- Task 2: Created 12 tests covering all ACs: input rendering, confirm/skip flows, PlayerContext integration, navigation, keyboard Enter, maxLength, whitespace trimming, avatar preview
- Build: 337KB JS (107KB gzip) — within 500KB budget
- All 42 tests passing, zero regressions

### File List

**Modified:**
- src/screens/NameInputScreen/NameInputScreen.tsx (replaced placeholder)
- src/screens/NameInputScreen/NameInputScreen.module.css (updated styles)

**New:**
- src/screens/NameInputScreen/NameInputScreen.test.tsx (12 tests)

