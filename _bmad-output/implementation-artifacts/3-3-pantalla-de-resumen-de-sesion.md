# Story 3.3: Pantalla de Resumen de Sesión

Status: done

## Story

As a **niño**,
I want **ver todas las palabras que formé con mi avatar aplaudiendo al final**,
so that **me sienta orgulloso de lo que logré**.

## Acceptance Criteria

1. **Lista de palabras** completadas en la sesión (FR25)
2. **Avatar celebra** con animación (UX-DR11)
3. **Botón "jugar de nuevo"** prominente ≥48px (UX-DR11, NFR13)
4. **Palabra nueva** (no repetida histórica) tiene star badge ⭐ (FR29)
5. **Palabra repetida** aparece sin badge, cuenta en total
6. **"Jugar de nuevo"** → navega a WorldSelectScreen, progreso acumulado se mantiene (FR28)
7. **Persistencia** — storageService ya persiste palabras y progreso (FR26, FR27) — verificar integración

## Tasks / Subtasks

- [x] Task 1: Reemplazar SummaryScreen placeholder con implementación real
- [x] Task 2: Tests
- [x] Task 3: Verificar build y bundle size

## Dev Notes

### Architecture
- `gameState.completedWords` tiene las palabras de la sesión actual
- `playerState.wordsCompleted` tiene las últimas 20 acumuladas (incluye sesión actual)
- Palabras nuevas = las que no estaban en `playerState.wordsCompleted` ANTES de la sesión
- Para detectar nuevas: comparar contra `playerState.wordsCompleted` excluyendo las de `gameState.completedWords` que se acaban de agregar → simplificación: marcar como nueva si es primera aparición en completedWords

## Dev Agent Record
### Agent Model Used
### Completion Notes List
### File List
