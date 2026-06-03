# Story 4.4: Habilitar Mundo Granja como Segundo Nivel

Status: done

## Story

As a **nino**,
I want **entrar al mundo Granja como segundo nivel**,
so that **descubra nuevas palabras y variedad de juego**.

## Acceptance Criteria

1. WorldSelect muestra Selva y Granja como mundos habilitados.
2. Oceano permanece bloqueado como contenido futuro.
3. Al seleccionar Granja, se inicia la sesion con world = granja.
4. El dado usa silabas del mundo seleccionado.
5. El vocabulario de Granja existe en diccionario embebido y participa en validacion.
6. Gameplay refleja visualmente el mundo activo en el badge.

## Tasks / Subtasks

- [x] Task 1: Habilitar seleccion de Granja en UI
  - [x] Actualizar `WorldSelectScreen` para `granja` desbloqueado
  - [x] Mantener `oceano` como locked
  - [x] Ajustar pruebas de `WorldSelectScreen`

- [x] Task 2: Hacer dado dependiente del mundo
  - [x] Extender servicio de diccionario con `getSyllablesForWorld`
  - [x] Actualizar `DiceRoller` para usar silabas por mundo seleccionado
  - [x] Mantener fallback seguro de 6 caras

- [x] Task 3: Cargar vocabulario de Granja
  - [x] Agregar entradas `granja` en `src/data/dictionary.json`
  - [x] Cubrir silabas start/end para validacion y construccion

- [x] Task 4: Reflejar mundo activo en Gameplay
  - [x] Badge dinamico con emoji y nombre de mundo segun `selectedWorld`

- [x] Task 5: Validar calidad
  - [x] Ejecutar tests focalizados: dictionaryService, DictionaryContext, WorldSelectScreen, DiceRoller, GameplayScreen
  - [x] Verificar ausencia de errores de tipado en archivos modificados

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Completion Notes List

- Granja quedo habilitado en el selector de mundos.
- El dado ya no usa solo una lista fija; ahora toma silabas del mundo activo.
- Se agrego contenido lexical de Granja al diccionario embebido.
- El badge de Gameplay muestra el mundo activo dinamicamente.
- Suite focalizada de pruebas en verde.

### File List

- src/screens/WorldSelectScreen/WorldSelectScreen.tsx
- src/screens/WorldSelectScreen/WorldSelectScreen.test.tsx
- src/components/DiceRoller/DiceRoller.tsx
- src/screens/GameplayScreen/GameplayScreen.tsx
- src/types/dictionary.ts
- src/services/dictionaryService.ts
- src/services/dictionaryService.test.ts
- src/contexts/DictionaryContext.test.tsx
- src/data/dictionary.json

## References

- Source: _bmad-output/planning-artifacts/epics.md (Epic 4, Story 4.4)
- Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-06-03.md
