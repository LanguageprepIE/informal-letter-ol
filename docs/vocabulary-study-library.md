# Biblioteca de estudio de vocabulario

## Alcance

- 40 grupos en total: el piloto aprobado y 39 grupos nuevos.
- 223 palabras o expresiones de práctica cubren las 221 entradas originales.
- Los dos ítems adicionales desdoblan poner/recoger la mesa y me duele(n).
- Cada grupo contiene entre 4 y 8 ítems, con estudio, lectura y recuperación con pistas en inglés.
- Los enlaces se encuentran dentro de sus secciones; no se añaden botones de actividades a la cabecera.
- El generador de años, sus preguntas, las listas y los modelos originales se conservan.

## Formatos y revisión pedagógica

Se utilizan 2 textos breves, 28 grupos de ejemplos independientes y 10 grupos de fichas de información. Las fichas incluyen números, agendas, asignaturas y tiempo; son datos independientes, no un relato. Los ejemplos de los demás grupos no pretenden formar una historia.

Las pistas conservan el sentido necesario para la respuesta: por ejemplo, entrar/salir se contextualizan como entrar en clase y salir del instituto. Se aclaran upload to Instagram, lunch y las variantes singular/plural del dolor. Se muestran formas masculinas y femeninas de adjetivos en ejemplos distintos. Las traducciones corresponden al contexto completo.

Las alternativas se aceptan solo cuando encajan: mi frigorífico/mi nevera, sacar/hacer fotos, quitar/recoger la mesa; habitación sigue excluida del hueco del piloto porque sus adjetivos son masculinos. La falta de una tilde se señala como recordatorio de escritura. No se aceptan errores de concordancia como me duele los pies o un adjetivo masculino en los ejemplos femeninos.

No hay ejercicios de redacción personal, flashcards, juegos, audios nuevos ni cambios en el plan de seis bloques. No se atribuye este formato al examen oficial: es una decisión de estudio de la plataforma.

## Grupos

| Grupo | Sección | Formato | Ítems |
|---|---|---|---:|
| Rooms 1 / Habitaciones 1 | vocab-3-2 | Texto | 6 |
| Numbers 0–7 / Números 0–7 | vocab-0-1 | Fichas de información | 8 |
| Numbers 8–15 / Números 8–15 | vocab-0-1 | Fichas de información | 8 |
| Numbers 16–23 / Números 16–23 | vocab-0-1 | Fichas de información | 8 |
| Numbers 24–31 / Números 24–31 | vocab-0-1 | Fichas de información | 8 |
| Days of the week / Días de la semana | vocab-0-2 | Fichas de información | 7 |
| Months 1 / Meses 1 | vocab-0-2 | Fichas de información | 6 |
| Months 2 / Meses 2 | vocab-0-2 | Fichas de información | 6 |
| Colours 1 / Colores 1 | vocab-0-3 | Frases independientes | 6 |
| Colours 2 / Colores 2 | vocab-0-3 | Frases independientes | 5 |
| Animals / Animales | vocab-0-4 | Frases independientes | 7 |
| Weather / El tiempo | vocab-0-5 | Fichas de información | 7 |
| Appearance / Aspecto físico | vocab-0-6 | Frases independientes | 5 |
| Features and personality / Rasgos y personalidad | vocab-0-6 | Frases independientes | 5 |
| School places 1 / Lugares del instituto 1 | vocab-1-1 | Frases independientes | 5 |
| School places 2 / Lugares del instituto 2 | vocab-1-1 | Frases independientes | 5 |
| Subjects 1 / Asignaturas 1 | vocab-1-2 | Fichas de información | 5 |
| Subjects 2 / Asignaturas 2 | vocab-1-2 | Fichas de información | 6 |
| People at school / Personas del instituto | vocab-1-3 | Frases independientes | 7 |
| School routine / Rutina escolar | vocab-1-4 | Frases independientes | 6 |
| Likes and dislikes / Gustos y preferencias | vocab-1-5 | Frases independientes | 4 |
| Describing schoolwork / Describir el trabajo escolar | vocab-1-5 | Frases independientes | 5 |
| Family members 1 / Familiares 1 | vocab-2-1 | Frases independientes | 4 |
| Family members 2 / Familiares 2 | vocab-2-1 | Frases independientes | 4 |
| Physical description / Descripción física | vocab-2-2 | Frases independientes | 7 |
| Personality / Personalidad | vocab-2-3 | Frases independientes | 5 |
| Getting on at home / Convivir en casa | vocab-2-4 | Frases independientes | 4 |
| Types of housing / Tipos de vivienda | vocab-3-1 | Frases independientes | 6 |
| Rooms and areas 2 / Habitaciones y zonas 2 | vocab-3-2 | Frases independientes | 6 |
| Furniture / Muebles | vocab-3-3 | Frases independientes | 6 |
| Kitchen appliances / Electrodomésticos de cocina | vocab-3-3 | Frases independientes | 6 |
| Other appliances / Otros aparatos | vocab-3-3 | Frases independientes | 4 |
| Household chores 1 / Tareas domésticas 1 | vocab-3-4 | Frases independientes | 4 |
| Household chores 2 / Tareas domésticas 2 | vocab-3-4 | Frases independientes | 5 |
| Location 1 / Ubicación 1 | vocab-3-5 | Frases independientes | 4 |
| Location 2 / Ubicación 2 | vocab-3-5 | Frases independientes | 4 |
| Free time and technology / Tiempo libre y tecnología | vocab-4 | Frases independientes | 5 |
| Health and sport / Salud y deporte | vocab-5 | Frases independientes | 5 |
| A trip / Un viaje | vocab-6 | Texto | 4 |
| Meals and eating out / Comidas y restaurantes | vocab-7 | Frases independientes | 5 |

## Comprobaciones

`node tests/vocab-study.cjs` comprueba cobertura completa, referencias de origen, un hueco por ítem, ausencia de respuestas visibles en otros huecos, enlaces únicos dentro de cada sección, los tres formatos, corrección de respuestas y alternativas, concordancia singular/plural, conservación de respuestas entre pasos y reinicio. También compara el contenido aprobado del piloto y el HTML original: listas, modelos y herramienta de años se mantienen íntegros.

`node tests/study-plan.cjs`, `node tests/listening-audit.cjs`, comprobación de sintaxis y `git diff --check` verifican los recursos anteriores. La simulación DOM no sustituye la comprobación visual en navegador; la publicación se revisa con actividades representativas de los tres formatos.

El archivo `vocabulary-coverage.json` relaciona cada sección original con sus grupos. Cada ítem de `js/vocab-study-data.js` contiene la referencia exacta a su entrada original.
