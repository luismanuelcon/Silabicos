# Story 3.2: Temporizador Visual de Sesión

Status: done

## Story

As a **niño**,
I want **ver un sol que se mueve suavemente por el cielo mientras juego**,
so that **sepa cuánto me queda de juego sin sentir presión**.

## Acceptance Criteria

1. **Sol visual** moviéndose por un arco — metáfora no numérica (FR23, UX-DR10)
2. **Animación fluida** via CSS (UX-DR10)
3. **Sin indicadores numéricos** de tiempo (FR23)
4. **Al agotarse** → Celebration variante session-end (fireworks) (FR24, UX-DR9)
5. **Celebra lo logrado**, no penaliza (FR24)
6. **Transición automática** a SummaryScreen
7. **prefers-reduced-motion** → sol posición estática sin transición (NFR17)

## Tasks / Subtasks

- [x] Task 1: Crear SessionTimer component (sol + arco CSS)
- [x] Task 2: Agregar variante session-end a Celebration
- [x] Task 3: Integrar en GameplayScreen (timer + session-end flow)
- [x] Task 4: Tests
- [x] Task 5: Verificar build y bundle size

## Dev Notes

### Architecture
- `src/components/SessionTimer/SessionTimer.tsx` — CSS arc + sun emoji, requestAnimationFrame for smooth progress
- Session duration: ~3 minutes (180s) — configurable
- Celebration gets `variant` prop: 'word-complete' | 'session-end'
- Session-end celebration uses fireworks emojis, shows word count
- After session-end celebration → dispatch END_SESSION → navigate('summary')

## Dev Agent Record
### Agent Model Used
### Completion Notes List
### File List
