# Story 4.1: Layout Responsive Vertical sin Overlay de Rotacion

Status: done

## Story

As a **nino**,
I want **jugar en celular vertical sin que me pidan rotar el dispositivo**,
so that **pueda usar SILABC de forma natural desde el telefono**.

## Acceptance Criteria

1. En orientacion portrait, el juego no muestra overlay bloqueante de rotacion.
2. GameplayScreen adapta su layout a vertical en mobile sin romper la experiencia actual en landscape.
3. En portrait: dado arriba, zona de construccion al centro, panel de letras abajo.
4. La interfaz mantiene touch targets y accesibilidad minima para ninos.
5. El cambio no degrada flujos existentes en landscape.
6. Pruebas de componentes y estilos validan comportamiento responsive principal.

## Tasks / Subtasks

- [x] Task 1: Eliminar bloqueo por orientacion portrait (AC: 1)
  - [x] Actualizar `src/components/OrientationOverlay/OrientationOverlay.tsx` para no bloquear interaccion en portrait
  - [x] Mantener el componente sin romper arbol de render de App
  - [x] Ajustar o simplificar `src/components/OrientationOverlay/OrientationOverlay.module.css`
  - [x] Actualizar `src/components/OrientationOverlay/OrientationOverlay.test.tsx`

- [x] Task 2: Definir layout portrait en GameplayScreen (AC: 2, 3, 4)
  - [x] Actualizar `src/screens/GameplayScreen/GameplayScreen.module.css` con media queries para portrait mobile
  - [x] Reordenar zonas visuales en portrait: dado arriba, builder centro, alphabet abajo
  - [x] Validar que en landscape se mantenga el layout actual
  - [x] Actualizar `src/screens/GameplayScreen/GameplayScreen.test.tsx`

- [x] Task 3: Ajustar componentes hijos para portrait (AC: 2, 3, 4)
  - [x] Revisar estilos de `src/components/DiceRoller/DiceRoller.module.css` para tamanos y espaciado portrait
  - [x] Revisar estilos de `src/components/WordBuilder/WordBuilder.module.css` para ancho util en mobile
  - [x] Revisar estilos de `src/components/AlphabetPanel/AlphabetPanel.module.css` para panel inferior usable
  - [x] Verificar estados tactiles en mobile (sin regresion visual)

- [x] Task 4: Validacion funcional y regresion (AC: 5, 6)
  - [x] Ejecutar tests de componentes afectados
  - [x] Verificar navegacion completa Welcome -> WorldSelect -> Gameplay en portrait y landscape
  - [x] Verificar que no se reintroduzca mensaje de rotacion en ningun flujo

## Dev Notes

### Contexto de cambio

- Esta historia nace de Correct Course aprobado el 2026-06-03.
- Se reemplaza la estrategia "landscape obligatorio" por "adaptacion responsive real" en mobile portrait.

### Alcance tecnico

- Enfoque principal en CSS Modules y estructura de pantalla.
- Evitar cambios de arquitectura mayores: no se cambia modelo de estado, solo adaptacion de presentacion e interaccion.
- Mantener compatibilidad con `prefers-reduced-motion` y accesibilidad existente.

### Riesgos

- Regresion de layout desktop/tablet landscape.
- Solapamientos visuales entre panel de letras y zona de construccion en pantallas pequenas.
- Degradacion de usabilidad tactil por falta de altura util.

### Mitigaciones

- Mobile-first para reglas portrait, con fallback claro a estilos landscape existentes.
- Pruebas visuales en anchos 320-428 y validacion en 568+.
- Tests de componentes actualizados para asegurar estado estable.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Completion Notes List

- Se elimino el bloqueo de orientacion portrait desactivando el overlay.
- Se adapto GameplayScreen a flujo vertical mobile: dado arriba, construccion al centro, panel abajo.
- Se ajustaron estilos portrait en DiceRoller, WordBuilder y AlphabetPanel.
- Tests ejecutados: OrientationOverlay y GameplayScreen en verde.

### File List

- src/components/OrientationOverlay/OrientationOverlay.tsx
- src/components/OrientationOverlay/OrientationOverlay.test.tsx
- src/screens/GameplayScreen/GameplayScreen.module.css
- src/components/DiceRoller/DiceRoller.module.css
- src/components/WordBuilder/WordBuilder.module.css
- src/components/AlphabetPanel/AlphabetPanel.module.css

## References

- Source: _bmad-output/planning-artifacts/epics.md (Epic 4, Story 4.1)
- Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-06-03.md
- Source: _bmad-output/planning-artifacts/prd.md (FR7, NFR20)
