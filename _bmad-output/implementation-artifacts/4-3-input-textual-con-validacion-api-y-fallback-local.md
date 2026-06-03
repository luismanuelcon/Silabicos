# Story 4.3: Validacion de Palabras Durante el Armado

Status: done

## Story

As a **nino**,
I want **recibir validacion mientras armo una palabra con la silaba y las letras disponibles**,
so that **sepa cuando voy bien sin salir del flujo natural del juego**.

## Acceptance Criteria

1. Con silaba activa, el sistema valida la palabra mientras el nino la arma en WordBuilder.
2. La palabra construida debe contener la silaba obligatoria para ser evaluada.
3. La validacion usa el diccionario embebido local sin depender de red.
4. Al detectar una palabra correcta, se dispara la misma celebracion y guardado del flujo principal.
5. El cambio mantiene flujo sin bloqueos y sin errores punitivos.
6. No existe una ventana o modo adicional de escritura manual fuera del armado normal.

## Tasks / Subtasks

- [x] Task 1: Mantener validacion integrada al armado de palabra
  - [x] Confirmar que la validacion se ejecuta desde el flujo existente de `WordBuilder`
  - [x] Mantener la regla de silaba obligatoria en la palabra evaluada
  - [x] Preservar celebracion y guardado al completar una palabra valida

- [x] Task 2: Eliminar UI redundante de escritura manual
  - [x] Retirar la ventana "Escribe una palabra con ..." de Gameplay
  - [x] Limpiar estado y estilos asociados a esa UI
  - [x] Mantener solo el flujo principal de armado con letras y silaba

- [x] Task 3: Consolidar validacion local como unica fuente activa
  - [x] Eliminar servicio remoto no utilizado
  - [x] Restaurar CSP sin permisos de red adicionales
  - [x] Verificar que no queden referencias colgantes a validacion remota

- [x] Task 4: Validacion y regresion
  - [x] Ejecutar pruebas focalizadas de GameplayScreen, dictionaryService, WorldSelectScreen y DiceRoller
  - [x] Confirmar que el gameplay permanece estable tras la limpieza

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Completion Notes List

- Se consolido la validacion en el flujo natural de armado de palabra.
- Se elimino la ventana redundante de escritura manual detectada en pruebas de uso.
- Se removio la logica remota sobrante y se restauro la CSP local-only.
- Se mantiene la regla pedagogica: la palabra debe contener la silaba activa.
- Flujo de celebracion y guardado reutiliza la logica existente para consistencia de UX.

### File List

- src/screens/GameplayScreen/GameplayScreen.tsx
- src/screens/GameplayScreen/GameplayScreen.module.css
- src/services/dictionaryService.ts
- staticwebapp.config.json

## References

- Source: _bmad-output/planning-artifacts/epics.md (Epic 4, Story 4.3)
- Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-06-03.md
