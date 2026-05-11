# Story 2.3: Dado Silábico con Animación de Lanzamiento

Status: done

## Story

As a **niño**,
I want **tocar un dado grande y ver cómo gira hasta mostrar una sílaba**,
so that **descubra qué sílaba usaré para formar mi palabra**.

## Acceptance Criteria

1. **DiceRoller** componente reemplaza placeholder del dado en GameplayScreen
2. **Tamaño:** 80-100px en viewport ≥1024px, 64px en mobile (UX-DR4)
3. **Feedback táctil:** scale(0.95) al presionar (UX-DR4)
4. **Animación de giro:** rotateX/Y con spring physics, ~800ms (FR10, UX-DR4)
5. **Al terminar la animación**, muestra sílaba CV generada por `getRandomSyllable(world)` (FR11)
6. **La sílaba se despacha** a GameContext via `SET_SYLLABLE` (FR12)
7. **Dado deshabilitado** mientras hay sílaba activa (no se puede relanzar hasta RESET_ROUND)
8. **prefers-reduced-motion:** sílaba aparece instantáneamente sin giro (NFR17)
9. **Animación 60fps** (NFR4) — usar Framer Motion + CSS transform
10. **Tests** cubren: render, click dispara animación, sílaba aparece, dado deshabilitado con sílaba activa, reduced motion

## Tasks / Subtasks

- [x] Task 1: Crear DiceRoller component
- [x] Task 2: Integrar en GameplayScreen (reemplazar placeholder)
- [x] Task 3: Estilos responsive
- [x] Task 4: Tests

## Dev Notes

### DiceRoller Component Spec

```typescript
// Props: none — usa useGame() y useDictionary() directamente
// Internals:
// - isRolling state local (boolean) para animación
// - Al click: isRolling=true → animación 800ms → getRandomSyllable(selectedWorld) → dispatch SET_SYLLABLE → isRolling=false
// - Disabled cuando gameState.currentSyllable !== null

// Framer Motion variants:
const diceVariants = {
  idle: { rotateX: 0, rotateY: 0, scale: 1 },
  rolling: {
    rotateX: [0, 360, 720],
    rotateY: [0, 180, 360],
    scale: [1, 0.9, 1],
    transition: { duration: 0.8, ease: 'easeInOut' }
  },
  reveal: { rotateX: 0, rotateY: 0, scale: [1.2, 1] }
};
```

### Integration with GameplayScreen

Reemplazar `diceArea` placeholder div con `<DiceRoller />` component.

### Tokens CSS existentes

```css
--touch-dice: 80px;
--duration-dice: 800ms;
--easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Architecture

- Component en `src/components/DiceRoller/DiceRoller.tsx` + `.module.css`
- Usa `useGame()` para dispatch SET_SYLLABLE y leer currentSyllable
- Usa `useDictionary()` para getRandomSyllable(selectedWorld)
- Named export, no default export

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
