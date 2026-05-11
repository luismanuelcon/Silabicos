# Story 3.4: Reconocimiento de Jugador Recurrente y WelcomeScreen

Status: done

## Story

As a **niño**,
I want **que cuando vuelva a abrir el juego me reconozca y me muestre mi progreso**,
so that **sienta que el juego me recuerda y vea cuánto he avanzado**.

## Acceptance Criteria

1. **Perfil en LS** → WelcomeScreen con avatar, nombre y progreso (FR4)
2. **Avatar saluda** con animación de bienvenida (UX-DR8)
3. **"¡Llevas X palabras!"** o equivalente visual
4. **Sin perfil en LS** → AvatarSelectScreen directamente (FR5)
5. **Toca continuar** → WorldSelectScreen con perfil cargado
6. **Transición AnimatePresence** (UX-DR16)
7. **LS borrado** → jugador nuevo sin error (FR21, NFR24)

## Tasks / Subtasks

- [x] Task 1: Implementar WelcomeScreen real
- [x] Task 2: Crear AppInitializer para routing inicial
- [x] Task 3: Tests
- [x] Task 4: Verificar build y bundle size

## Dev Agent Record
### Agent Model Used
### Completion Notes List
### File List
