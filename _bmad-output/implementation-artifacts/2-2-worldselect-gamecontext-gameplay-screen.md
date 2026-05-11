# Story 2.2: WorldSelect, GameContext y Estructura del GameplayScreen

Status: done

## Story

As a **niño**,
I want **entrar al mundo Selva y ver un escenario colorido listo para jugar**,
so that **me sienta en una aventura en la selva**.

## Acceptance Criteria

1. **WorldSelectScreen** muestra el mundo Selva como seleccionable con visual temático (FR6)
2. **Mundos Granja y Océano** aparecen bloqueados/coming-soon con lock icon amigable (diseño extensible)
3. **Al seleccionar Selva**, se inicializa GameContext con: currentSyllable null, placedLetters [], completedWords [], round 0, selectedWorld 'selva'
4. **Navegación** a GameplayScreen con transición animada (UX-DR16)
5. **GameContext** expone estado de sesión via `useGame()` hook — Context + useReducer pattern
6. **GameplayScreen** muestra layout con 3 zonas placeholder: zona de dado, zona de construcción, panel de letras (FR8)
7. **El layout escala** sin reorganizarse entre breakpoints (UX-DR13)
8. **Tema Selva** aplicado: gradient verde de fondo (#E8F5E9 → #C8E6C9), colores mundo selva
9. **Botón Home** funciona desde GameplayScreen — regresa al inicio con transición
10. **Avatar del jugador** visible en GameplayScreen (esquina superior)
11. **Tests unitarios y de componente** para GameContext, WorldSelectScreen y GameplayScreen

## Tasks / Subtasks

- [x] Task 1: Crear types de juego (AC: #5)
  - [ ] Crear `src/types/game.ts`
  - [ ] `GameState`: currentSyllable (string | null), placedLetters (PlacedLetter[]), completedWords (string[]), round (number), selectedWorld (WorldId), isSessionActive (boolean)
  - [ ] `PlacedLetter`: letter (string), position (number)
  - [ ] `GameAction`: SET_SYLLABLE, ADD_LETTER, REMOVE_LETTER, COMPLETE_WORD, RESET_ROUND, START_SESSION, END_SESSION
  - [ ] Named export

- [x] Task 2: Crear GameContext (AC: #3, #5)
  - [ ] Crear `src/contexts/GameContext.tsx`
  - [ ] `gameReducer` con todas las acciones
  - [ ] `useGame()` hook — lanza error fuera de provider
  - [ ] `GameProvider` con useReducer
  - [ ] Estado inicial: currentSyllable null, placedLetters [], completedWords [], round 0, selectedWorld 'selva', isSessionActive false
  - [ ] START_SESSION: set isSessionActive true, reset round/syllable/letters
  - [ ] Named export: `export { GameProvider, useGame }`

- [x] Task 3: Crear WorldCard component (AC: #1, #2)
  - [ ] Crear `src/components/WorldCard/WorldCard.tsx` + `.module.css`
  - [ ] Props: worldId (WorldId), locked (boolean), onSelect, label (string)
  - [ ] Estado available: colorido con nombre, gradient de fondo por mundo, hover/tap scale
  - [ ] Estado locked: greyscale + lock icon SVG amigable, cursor default, no interacción
  - [ ] Touch target ≥48px, aria-label descriptivo, role="button"
  - [ ] Keyboard Enter/Space para selección

- [x] Task 4: Implementar WorldSelectScreen (AC: #1, #2, #4, #8)
  - [ ] Reemplazar placeholder en `src/screens/WorldSelectScreen/WorldSelectScreen.tsx`
  - [ ] Grid de 3 WorldCards: Selva (available), Granja (locked), Océano (locked)
  - [ ] Al seleccionar Selva: dispatch START_SESSION, navigate to 'gameplay'
  - [ ] Avatar del jugador visible como contexto
  - [ ] Título visual sin texto largo — iconos/colores comunican

- [x] Task 5: Implementar GameplayScreen estructura (AC: #6, #7, #8, #9, #10)
  - [ ] Reemplazar placeholder en `src/screens/GameplayScreen/GameplayScreen.tsx`
  - [ ] Layout: Header (avatar + home), GameZone (dado placeholder + construcción placeholder), AlphabetPanel placeholder
  - [ ] Fondo con gradient selva (--color-selva-bg-start → --color-selva-bg-end)
  - [ ] Las 3 zonas son placeholders visuales con texto/icono indicativo
  - [ ] Avatar del jugador en esquina superior izquierda
  - [ ] Layout responsive: flexbox/grid que escala sin romper

- [x] Task 6: Integrar GameProvider en App.tsx (AC: #5)
  - [ ] Agregar `<GameProvider>` en App.tsx dentro del árbol de providers

- [x] Task 7: Tests (AC: #11)
  - [ ] `src/contexts/GameContext.test.tsx` — useGame fuera de provider lanza error, START_SESSION, SET_SYLLABLE, COMPLETE_WORD, RESET_ROUND, END_SESSION
  - [ ] `src/screens/WorldSelectScreen/WorldSelectScreen.test.tsx` — muestra 3 mundos, Selva seleccionable, Granja/Océano bloqueados, al seleccionar Selva navega a gameplay
  - [ ] `src/screens/GameplayScreen/GameplayScreen.test.tsx` — muestra zonas placeholder, avatar visible, layout renderiza

## Dev Notes

### Architecture Compliance — OBLIGATORIO

- **Context pattern:** `useGame()` hook, nunca `useContext()` directo
- **Types:** En `src/types/game.ts` — todo named export
- **Components:** En carpeta propia con `.module.css` co-locado
- **No `any`**, no `export default`, tests co-locados
- **Orden interno:** Imports → Types → Component → Hooks → Derived → Handlers → Render

### GameState Interface — DE architecture.md

```typescript
interface PlacedLetter {
  letter: string;
  position: number; // relativo a sílaba
}

interface GameState {
  currentSyllable: string | null;
  placedLetters: PlacedLetter[];
  completedWords: string[];
  round: number;
  selectedWorld: WorldId;
  isSessionActive: boolean;
}

type GameAction =
  | { type: 'START_SESSION'; payload: WorldId }
  | { type: 'SET_SYLLABLE'; payload: string }
  | { type: 'ADD_LETTER'; payload: PlacedLetter }
  | { type: 'REMOVE_LETTER'; payload: number }
  | { type: 'COMPLETE_WORD'; payload: string }
  | { type: 'RESET_ROUND' }
  | { type: 'END_SESSION' };
```

### WorldCard Visual Spec

```
┌─────────────────────┐
│   🌴                │  ← SVG/emoji del mundo
│                     │
│   gradient de fondo │  ← gradient mundo
│                     │
│   [nombre visual]   │  ← texto o icono
└─────────────────────┘

Estado locked:
┌─────────────────────┐
│   🔒 (friendly)    │  ← lock icon suave
│   filter: grayscale │
│   opacity: 0.6      │
└─────────────────────┘
```

- Touch target: ≥48px (full card clickable)
- Card size: ~200×150px mínimo
- Border radius: var(--radius-xl) = 24px
- Shadow: var(--shadow-md) hover → var(--shadow-lg)

### GameplayScreen Layout — DE architecture.md + UX spec

```
┌─────────────────────────────────────────┐
│  [Avatar]                   [Home 🏠]  │  ← Header 15%
│                                         │
│           ┌──────────────┐              │
│  [🎲]     │ Zona Build   │              │  ← GameZone 50%
│  Dado     │ (placeholder) │              │
│           └──────────────┘              │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │   Panel de Letras (placeholder)  │    │  ← AlphabetPanel 35%
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

Fondo: `linear-gradient(135deg, var(--color-selva-bg-start), var(--color-selva-bg-end))`

### Design Tokens Existentes (tokens.css)

```css
--color-selva-primary: #00B894;
--color-selva-secondary: #55A630;
--color-selva-accent: #FECA57;
--color-selva-bg-start: #E8F5E9;
--color-selva-bg-end: #C8E6C9;
```

### Provider Order en App.tsx

```tsx
<DictionaryProvider>
  <PlayerProvider>
    <GameProvider>        {/* NUEVO */}
      <NavigationProvider>
        <ScreenManager />
        <HomeButton />
        <OrientationOverlay />
      </NavigationProvider>
    </GameProvider>
  </PlayerProvider>
</DictionaryProvider>
```

### Previous Story Intelligence

- Framer Motion ease: `[0.42, 0, 0.58, 1] as const` en vez de string
- ScreenManager tests necesitan todos los providers
- App.test.tsx assertion puede cambiar si WorldSelectScreen cambia texto
- 58 tests passing actualmente
- Build: 340KB JS (108KB gzip)
- Tests con renderHook para contextos
- Screens placeholder: `<div className={styles.screen}><h1 className={styles.title}>...</h1></div>`

### Forward Context (Stories 2.3-2.6)

- **Story 2.3:** DiceRoller dentro de GameZone — usa GameContext SET_SYLLABLE
- **Story 2.4:** AlphabetPanel reemplaza placeholder — usa GameContext ADD_LETTER
- **Story 2.5:** WordBuilder reemplaza placeholder — usa GameContext para tracking
- **Story 2.6:** Validación lee completedWords, dispara celebración

### Archivos NUEVOS

- `src/types/game.ts`
- `src/contexts/GameContext.tsx`
- `src/contexts/GameContext.test.tsx`
- `src/components/WorldCard/WorldCard.tsx`
- `src/components/WorldCard/WorldCard.module.css`
- `src/screens/WorldSelectScreen/WorldSelectScreen.test.tsx`
- `src/screens/GameplayScreen/GameplayScreen.test.tsx`

### Archivos MODIFICADOS

- `src/screens/WorldSelectScreen/WorldSelectScreen.tsx` — reemplazar placeholder
- `src/screens/WorldSelectScreen/WorldSelectScreen.module.css` — estilos reales
- `src/screens/GameplayScreen/GameplayScreen.tsx` — reemplazar placeholder
- `src/screens/GameplayScreen/GameplayScreen.module.css` — estilos reales
- `src/App.tsx` — agregar GameProvider

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#GameContext, Data Architecture, File Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#WorldSelect, GameplayScreen layout, World themes]
- [Source: _bmad-output/planning-artifacts/prd.md#FR6, FR8]

## Dev Agent Record

### Agent Model Used



### Debug Log References



### Completion Notes List



### File List

