# Story 2.5: WordBuilder — Zona de Construcción y Sílaba Anclada

Status: done

## Story

As a **niño**,
I want **soltar letras en casillas al lado de mi sílaba para ir armando una palabra**,
so that **vea cómo se forma la palabra paso a paso**.

## Acceptance Criteria

1. **WordBuilder** muestra sílaba anclada con estilo diferenciado (color-coral, fixed indicator ⚓) (UX-DR6, FR17)
2. **Slots visuales vacíos** antes y después de la sílaba (UX-DR6)
3. **Letras pueden posicionarse** antes o después de la sílaba (FR14)
4. **Letra hace snap** a posición en 150ms con easing-bounce (UX-DR15, UX-DR6)
5. **Sílaba del dado permanece fija** e inamovible (FR17)
6. **Tocar letra colocada** la remueve de la zona y vuelve al panel (FR15)
7. **Sílaba obligatoria NO puede removerse** (FR17)
8. **Al cambiar combinación**, se expone `data-word` para validación automática (FR18)
9. **Validación ocurre en <50ms** (NFR6) — delegada a dictionaryService
10. **Tests** cubren: prompt sin sílaba, sílaba anclada, slots, colocación, remoción, inmutabilidad sílaba, data-word

## Tasks / Subtasks

- [x] Task 1: Crear WordBuilder component (`src/components/WordBuilder/WordBuilder.tsx` + `.module.css`)
- [x] Task 2: Integrar en GameplayScreen (reemplazar placeholder buildArea)
- [x] Task 3: Conectar AlphabetPanel → GameContext ADD_LETTER via handleLetterDragEnd
- [x] Task 4: Tests (`src/components/WordBuilder/WordBuilder.test.tsx`)
- [x] Task 5: Limpiar CSS no usado en GameplayScreen.module.css

## Dev Notes

### Archivos NUEVOS
- `src/components/WordBuilder/WordBuilder.tsx`
- `src/components/WordBuilder/WordBuilder.module.css`
- `src/components/WordBuilder/WordBuilder.test.tsx`

### Archivos MODIFICADOS
- `src/screens/GameplayScreen/GameplayScreen.tsx` — WordBuilder reemplaza placeholder, AlphabetPanel wired con handleLetterDragEnd
- `src/screens/GameplayScreen/GameplayScreen.module.css` — removidos .buildArea, .placeholderIcon, .placeholderText

### Resultados
- 95 tests passing (6 nuevos)
- tsc clean
- Build: 349KB JS (111KB gzip)

## Dev Agent Record

### Agent Model Used
Claude Opus 4

### Completion Notes List
- WordBuilder expone palabra actual via data-word attribute para que Story 2.6 pueda leer y validar
- Letras se colocan después de la sílaba por defecto via handleLetterDragEnd en GameplayScreen
- MAX_LETTERS_BEFORE = 3, MAX_LETTERS_AFTER = 4 (exportados para reutilización)

### File List
- src/components/WordBuilder/WordBuilder.tsx
- src/components/WordBuilder/WordBuilder.module.css
- src/components/WordBuilder/WordBuilder.test.tsx
- src/screens/GameplayScreen/GameplayScreen.tsx (modified)
- src/screens/GameplayScreen/GameplayScreen.module.css (modified)
