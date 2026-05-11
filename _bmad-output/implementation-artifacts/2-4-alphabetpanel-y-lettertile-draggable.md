# Story 2.4: AlphabetPanel y LetterTile Draggable

Status: done

## Story

As a **niño**,
I want **ver todas las letras del abecedario y poder arrastrarlas con mi dedo**,
so that **elija las letras que necesito para formar mi palabra**.

## Acceptance Criteria

1. **AlphabetPanel** muestra alfabeto español completo (A-Z + Ñ) sin restricción (FR16)
2. **Layout:** 2 rows en ≥1024px, 3 rows en <1024px, gap 8px/4px respectivamente (UX-DR7)
3. **LetterTile** tamaño responsive: 48px (568px), 56px (768px), 64px (1024px+) (UX-DR5, NFR13)
4. **Estados visuales:** idle, hover, active, dragging (UX-DR5)
5. **Drag:** scale(1.1) + sombra de drag + rotate(±2deg) (UX-DR15)
6. **La letra sigue el pointer** sin lag, z-index elevado (UX-DR15)
7. **Funciona con touch** (Pointer Events API) y mouse (NFR21)
8. **Animate-back** a posición original en 300ms cuando se suelta fuera de drop zone (UX-DR15)
9. **Panel solo visible** cuando hay sílaba activa
10. **Tests** cubren: render alfabeto completo, letras son interactuables, responsive classes

## Tasks / Subtasks

- [x] Task 1: Crear LetterTile component (`src/components/LetterTile/LetterTile.tsx` + `.module.css`)
- [x] Task 2: Crear AlphabetPanel component (`src/components/AlphabetPanel/AlphabetPanel.tsx` + `.module.css`)
- [x] Task 3: Integrar AlphabetPanel en GameplayScreen (reemplazar placeholder, condicional a sílaba activa)
- [x] Task 4: Tests (`LetterTile.test.tsx`, `AlphabetPanel.test.tsx`, actualizar `GameplayScreen.test.tsx`)

## Dev Notes

- LetterTile: `src/components/LetterTile/LetterTile.tsx` + `.module.css`
- AlphabetPanel: `src/components/AlphabetPanel/AlphabetPanel.tsx` + `.module.css`
- Drag con Pointer Events API (pointerdown/pointermove/pointerup)
- onLetterDrop callback para Story 2.5 integration
- Named exports, no default

## Dev Agent Record
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
