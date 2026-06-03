# Sprint Change Proposal - SILABC

Fecha: 2026-06-03
Proyecto: SILABC
Solicitante: LuisAgent
Workflow: bmad-correct-course
Estado: Propuesta aprobada por usuario

## 1. Issue Summary

Se aprueba una correccion de curso post-MVP para mejorar la experiencia de juego y ampliar alcance funcional en cuatro frentes:

1. Eliminar la dependencia de orientacion horizontal y permitir uso completo en celular vertical.
2. Hacer explicitamente visible la silaba ganadora del dado al terminar la animacion.
3. Mejorar la validacion de palabras dentro del flujo natural de armado, sin UI adicional.
4. Habilitar el segundo nivel (mundo Granja) como parte jugable.

Contexto de descubrimiento: mejoras solicitadas tras completar Epic 1-3 en estado done.

Evidencia de conflicto en artefactos actuales:
- PRD y UX especifican landscape obligatorio y overlay de rotacion.
- PRD define no comunicacion de red durante gameplay.
- Flujo actual habilita solo Selva como mundo jugable.

## 2. Impact Analysis

### Epic Impact

- Epics 1, 2 y 3 permanecen completados, sin rollback.
- Se agrega Epic 4 para encapsular mejoras post-MVP sin romper trazabilidad historica.

### Story Impact

Se agregan 4 historias nuevas en backlog:
- 4-1-layout-responsive-vertical-sin-overlay-de-rotacion
- 4-2-dado-con-cara-ganadora-visible-y-destacada
- 4-3-input-textual-con-validacion-api-y-fallback-local
- 4-4-habilitar-mundo-granja-como-segundo-nivel

### Artifact Conflicts

PRD:
- NFR20 y FR7 requieren actualizacion para soporte vertical.
- FR32 se mantiene sin dependencia de red durante gameplay.
- FR6 requiere ampliacion para habilitar Granja.
- Ajuste funcional para reforzar validacion integrada durante el armado de palabra.

Arquitectura:
- Consolidacion de validacion local embebida dentro del flujo principal.
- Extensiones de layout responsive portrait.
- Expansion de diccionario y world data para Granja.

UX:
- Reemplazo de patron OrientationOverlay bloqueante por adaptacion responsive real.
- Definicion visual de estado final del dado y cara ganadora.
- Validacion y feedback integrados al flujo principal de construccion.
- Activacion visual y de navegacion del mundo Granja.

### Technical Impact

- Cambios en componentes clave: OrientationOverlay, Gameplay layout, DiceRoller/DiceCube3D, WordBuilder, WorldSelect.
- Cambios en estado y servicios: GameContext, dictionaryService.
- Cambios en datos: dictionary.json con cobertura adicional de vocabulario.

## 3. Recommended Approach

Enfoque seleccionado: Option 1 - Direct Adjustment.

Rationale:
- No se requiere revertir trabajo entregado.
- Las mejoras son acoplables como nueva iteracion funcional.
- Mantiene continuidad de roadmap y minimiza riesgo de regresion estructural.

Estimacion:
- Esfuerzo: medio.
- Riesgo: medio-bajo.
- Impacto en timeline: 1 sprint incremental (4 historias secuenciales o 2+2 en paralelo).

Riesgos principales y mitigacion:
- Regresiones de UX en landscape: mitigar con pruebas responsive portrait/landscape.
- Calidad lexical infantil: mitigar con curacion manual de vocabulario por mundo.

## 4. Detailed Change Proposals

### 4.1 Stories

Story: 4-1-layout-responsive-vertical-sin-overlay-de-rotacion
Section: Scope

OLD:
- Landscape obligatorio con overlay de rotacion en portrait.

NEW:
- Soporte portrait en mobile con layout adaptativo sin bloqueo.

Rationale:
- Reduce friccion de uso y habilita sesion autonoma en celular.

Story: 4-2-dado-con-cara-ganadora-visible-y-destacada
Section: Scope

OLD:
- El dado anima y revela silaba, sin insistencia visual fuerte de cara final.

NEW:
- El dado termina orientado con cara ganadora arriba y resaltada.

Rationale:
- Refuerza comprension inmediata de la silaba activa para ninos prelectores.

Story: 4-3-input-textual-con-validacion-api-y-fallback-local
Section: Scope

OLD:
- Construccion por drag and drop y validacion local embebida.

NEW:
- Validacion reforzada dentro del flujo de armado de palabra, sin UI adicional ni dependencia de red.

Rationale:
- Mantiene la experiencia simple para el nino y evita friccion visual innecesaria.

Story: 4-4-habilitar-mundo-granja-como-segundo-nivel
Section: Scope

OLD:
- Solo Selva jugable.

NEW:
- Granja habilitada con contenido y tema propios.

Rationale:
- Introduce progresion de dificultad y variedad de experiencia.

### 4.2 PRD Sections to Update

1. FR7: de overlay de rotacion a adaptacion vertical.
2. FR6: de acceso Selva a acceso Selva + Granja.
3. FR32: se preserva el enfoque sin dependencia de red para el gameplay.
4. NFR20: de responsive horizontal a responsive dual (portrait + landscape).
5. Ajuste funcional:
- La validacion debe ocurrir mientras el nino arma la palabra en el flujo principal.

### 4.3 Architecture Sections to Update

1. Consolidar politica local-first para validacion de palabras.
2. Mantener servicio de diccionario embebido como fuente activa de validacion.
3. Layout strategy para portrait mobile.
4. Evolucion de WorldTheme para Granja habilitada.

### 4.4 UX Sections to Update

1. Remover patron OrientationOverlay bloqueante.
2. Especificar layout portrait en GameplayScreen.
3. Definir feedback de cara ganadora del dado.
4. Mantener feedback de validacion dentro del armado normal de palabra.
5. Actualizar WorldSelect con Granja activa.

## 5. Implementation Handoff

Scope classification: Moderate.

Handoff recipients:
- Product Owner / Developer para reorganizacion de backlog y secuencia de historias.
- Developer agent para implementacion tecnica y pruebas de regresion.

Responsabilidades:
1. Product Owner/BA
- Validar redaccion final de FR/NFR ajustados.
- Priorizar secuencia de historias 4-1 a 4-4.

2. Developer
- Implementar historias con test coverage por flujo portrait/landscape.
- Mantener UX sin mensajes punitivos ni friccion extra.

Success criteria:
- Juego usable en portrait mobile sin overlay de rotacion.
- Cara ganadora del dado inequívoca tras cada roll.
- Validacion de palabras integrada al armado, sin UI extra ni dependencia de red.
- Mundo Granja jugable y estable.

## Workflow Completion Summary

- Issue addressed: mejoras post-MVP de UX mobile, feedback de dado, validacion lexical y progresion de mundos.
- Change scope: Moderate.
- Artifacts modified in this workflow execution:
  - _bmad-output/implementation-artifacts/sprint-status.yaml
  - _bmad-output/planning-artifacts/sprint-change-proposal-2026-06-03.md
- Routed to: Product Owner / Developer.

Correct Course workflow complete, LuisAgent.
