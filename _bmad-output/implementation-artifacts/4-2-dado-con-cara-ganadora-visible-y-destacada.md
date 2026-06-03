# Story 4.2: Dado con Cara Ganadora Visible y Destacada

Status: done

## Story

As a **nino**,
I want **ver claramente cual silaba gano en el dado despues del giro**,
so that **sepa que silaba debo usar para formar la palabra**.

## Acceptance Criteria

1. Al terminar la animacion, la cara ganadora del dado queda orientada y visible.
2. La cara/silaba ganadora se destaca visualmente de forma persistente tras el roll.
3. La UI muestra un indicador textual claro de la silaba ganadora.
4. El comportamiento no rompe el flujo actual de validacion y construccion.
5. Se agregan/actualizan pruebas para el nuevo comportamiento.

## Tasks / Subtasks

- [x] Task 1: Resaltar visualmente la cara ganadora en el dado 3D
  - [x] Extender `DiceCube3D` para recibir `winnerFaceIndex`
  - [x] Regenerar textura de cara ganadora con borde y glow
  - [x] Aplicar glow al contenedor del dado cuando hay cara ganadora

- [x] Task 2: Persistir resultado ganador en DiceRoller
  - [x] Guardar `winnerFaceIndex` al resolver el lanzamiento
  - [x] Limpiar estado durante el giro y restaurar al finalizar
  - [x] Pasar `winnerFaceIndex` a `DiceCube3D`

- [x] Task 3: Hacer explicita la silaba ganadora en UI
  - [x] Reemplazar resultado simple por badge `Silaba ganadora: XX`
  - [x] Ajustar estilos de alto contraste para lectura infantil

- [x] Task 4: Validacion
  - [x] Actualizar test de `DiceRoller` para verificar indicador ganador
  - [x] Ejecutar `vitest` focalizado en DiceRoller

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Completion Notes List

- Se incorporo un estado de cara ganadora para hacer explicito el resultado del dado.
- La cara ganadora ahora tiene realce visual en textura y glow de contenedor.
- Se agrego etiqueta textual persistente de silaba ganadora al finalizar el roll.
- Tests de DiceRoller en verde.

### File List

- src/components/DiceCube3D/DiceCube3D.tsx
- src/components/DiceCube3D/DiceCube3D.module.css
- src/components/DiceRoller/DiceRoller.tsx
- src/components/DiceRoller/DiceRoller.module.css
- src/components/DiceRoller/DiceRoller.test.tsx

## References

- Source: _bmad-output/planning-artifacts/epics.md (Epic 4, Story 4.2)
- Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-06-03.md
