---
title: "Product Brief: SILABC"
status: "complete"
created: "2026-05-08"
updated: "2026-05-08"
inputs:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/prd-validation-report.md"
---

# Product Brief: SILABC

## Resumen Ejecutivo

SILABC es un juego web educativo gratuito que enseña a niños hispanohablantes de 4 a 6 años a construir palabras a través de dados silábicos animados. El niño lanza un dado, obtiene una sílaba (por ejemplo, "MA"), y debe completar una palabra real en español que la contenga arrastrando letras del alfabeto. El juego celebra cada logro con animaciones de avatares animales — no hay errores, no hay "game over", solo descubrimiento.

Lo que hace a SILABC fundamentalmente diferente: **la sílaba es el objeto central del juego, no la letra.** En español, los niños aprenden a leer por sílabas — no por fonemas individuales como en inglés. La mayoría de las herramientas digitales de lectoescritura ignoran esta realidad lingüística. SILABC la convierte en su mecánica de juego.

El producto opera sin login, sin backend, sin recolección de datos y sin costo significativo de infraestructura (<$5 USD/mes en Azure). Un niño abre el navegador, elige un avatar, y empieza a jugar. Un padre no necesita configurar nada, crear cuenta, ni preocuparse por privacidad. SILABC es zero friction por diseño.

## El Problema

Los niños hispanohablantes en edad preescolar necesitan practicar la construcción de palabras por sílabas — la unidad fundamental de la lectoescritura en español. Las herramientas digitales disponibles presentan una o más de estas fallas:

- **Modelo pedagógico equivocado.** Replican fonética del inglés (letra por letra), ignorando que el español se aprende por sílabas.
- **Fricción excesiva.** Requieren cuentas, suscripciones o configuración parental antes de que el niño pueda jugar.
- **Diseño punitivo.** Sistemas de vidas, penalizaciones y pantallas de "perdiste" que generan frustración en niños de 4 años.
- **Costo de acceso.** Apps de pago o freemium con contenido bloqueado — inaccesibles para muchas familias en Latinoamérica.

El resultado: padres y educadores no encuentran una herramienta digital gratuita, segura y pedagógicamente alineada para que los niños practiquen lectoescritura silábica de forma autónoma.

## La Solución

SILABC transforma la práctica silábica en un juego de dados:

1. **Lanzar el dado.** El niño toca un dado animado que gira y muestra una sílaba (ej. "PA").
2. **Construir la palabra.** Arrastra letras del alfabeto para completar una palabra que contenga esa sílaba ("PAPA", "MAPA", "PATO").
3. **Celebrar.** Su avatar animal salta, baila y celebra. Nunca hay error — si se acerca a una palabra, el juego guía suavemente.
4. **Repetir.** Nuevo dado, nueva sílaba, nueva palabra. El ciclo dura 5-10 minutos, alineado con la capacidad de atención de la edad.

El juego progresa por mundos temáticos con dificultad silábica creciente: Selva (sílabas directas: ma, pa, lo) → Granja (trabadas: bra, cre, pla) → Océano (inversas y mixtas: al, mar, ción). Toda la interfaz es visual — sin texto, sin instrucciones escritas, navegable por un niño que aún no sabe leer.

## Qué Hace Diferente a SILABC

| Diferenciador | Por qué importa |
|---|---|
| **La sílaba es la unidad de juego** | Alineado con cómo realmente se enseña a leer en español — no es una copia de modelos fonéticos del inglés |
| **Refuerzo positivo incondicional** | Sin errores, sin vidas, sin castigos. Los avatares nunca muestran emociones negativas. Reduce frustración y abandono |
| **Zero friction total** | Sin cuenta, sin suscripción, sin configuración parental. El niño toca y juega desde cualquier navegador |
| **Privacidad por diseño** | Sin recolección de datos, sin analytics, sin publicidad, sin enlaces externos. Cumplimiento implícito de COPPA |
| **Gratuito y de bajo costo operativo** | Frontend-only, <$5/mes en Azure. Accesible para cualquier familia con un dispositivo y navegador |

## A Quién Sirve

**Usuarios primarios: Niños de 4-6 años** — Pre-lectores y lectores emergentes que reconocen algunas letras y sílabas. Motricidad fina en desarrollo (requieren áreas de toque grandes). Atención sostenida de 5-10 minutos. Usan tabletas o teléfonos en orientación horizontal.

**Usuarios secundarios: Padres y educadores** — Buscan actividades digitales seguras donde el niño pueda jugar de forma autónoma sin supervisión constante. No quieren crear cuentas, pagar suscripciones, ni preocuparse por qué datos recopila la app.

## Criterios de Éxito

| Criterio | Métrica |
|---|---|
| Un niño de 5 años completa una sesión sin ayuda adulta | Prueba observacional con 3-5 niños |
| ≥ 3 palabras formadas por sesión | Datos en LocalStorage |
| Sesión de 5-10 minutos de duración | Datos en LocalStorage |
| Abandono antes de primera palabra < 30% | Prueba observacional |
| Carga inicial < 3 segundos en 3G | Lighthouse / WebPageTest |
| Costo mensual de infraestructura < $5 USD | Facturación Azure |

## Alcance

**MVP (Phase 1 — Mundo Selva):** Selección de avatar (3-5 animales), nombre opcional, dado silábico con sílabas directas (CV), zona de construcción drag & drop, diccionario embebido curado, validación sin castigo, temporizador visual suave, persistencia local de últimas 20 palabras, responsive horizontal 568px-1920px.

**Excluido del MVP:** Mundos Granja y Océano, sonido y música, logros/coleccionables, dashboard parental, multijugador, multiidioma, backend, analytics.

**Recurso estimado:** 1 desarrollador frontend, 4-6 semanas.

## Visión

Si SILABC valida que el dado silábico genera aprendizaje y engagement en niños reales, el camino es claro:

**Phase 2:** Tres mundos con progresión silábica completa (directas → trabadas → inversas), sonido ambiental con efectos de celebración, y guía por inactividad.

**Phase 3:** Sistema de logros, soporte offline como PWA, expansión a portugués y catalán, modo colaborativo entre hermanos, e integración con estándares curriculares por país.

La oportunidad mayor: convertirse en la herramienta gratuita de referencia para lectoescritura silábica en español — un recurso que cualquier padre o educador en Latinoamérica pueda abrir en un navegador sin barrera alguna.
