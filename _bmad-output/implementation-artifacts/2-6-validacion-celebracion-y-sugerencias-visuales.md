# Story 2.6: Validación, Celebración y Sugerencias Visuales

Status: done

## Story

As a **niño**,
I want **que cuando formo una palabra correcta mi avatar salte y lance confeti, y que si estoy cerca me ayude con una pista**,
so that **siempre me sienta motivado y nunca me frustre**.

## Acceptance Criteria

1. **Validación automática** — al cambiar combinación en WordBuilder, se llama `isValidWord()` (FR18)
2. **Palabra válida** → Celebration: confetti + avatar dance (FR19, UX-DR9)
3. **Palabra registrada** en GameContext como completada (COMPLETE_WORD)
4. **Sin mensajes de error** jamás (FR21)
5. **Proximidad** → `getClosestMatch()` muestra VisualHint con opacity fade 300ms (FR20, UX-DR12)
6. **VisualHint** es imagen/ícono, nunca texto (UX-DR12)
7. **Tras celebración** → RESET_ROUND, dado disponible para relanzar
8. **Animaciones 60fps** (NFR4)
9. **prefers-reduced-motion** → confetti se reemplaza por flash estático (NFR17)
10. **Tests** cubren: validación detecta palabra, celebración aparece, COMPLETE_WORD se despacha, hint se muestra, reduced-motion

## Tasks / Subtasks

- [x] Task 1: Crear useWordValidation hook
- [x] Task 2: Crear Celebration component
- [x] Task 3: Crear VisualHint component
- [x] Task 4: Integrar en GameplayScreen
- [x] Task 5: Tests
- [x] Task 6: Verificar build y bundle size

## Dev Notes

### Architecture
- Hook: `src/hooks/useWordValidation.ts` — lee gameState + dictionary, retorna { isValid, closestMatch, currentWord }
- Celebration: `src/components/Celebration/Celebration.tsx` — confetti particles CSS + emoji burst
- VisualHint: `src/components/VisualHint/VisualHint.tsx` — icon/emoji hint basado en imageHint de DictionaryEntry

### Flow
```
WordBuilder data-word changes
  → useWordValidation detects
    → isValid? → dispatch COMPLETE_WORD → show Celebration → after 2s → RESET_ROUND
    → closestMatch? → show VisualHint
    → neither? → no feedback (FR21)
```

## Dev Agent Record
### Agent Model Used
### Completion Notes List
### File List
