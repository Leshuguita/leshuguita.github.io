---
title: Escribiendo un Generador de Sitios Estáticos
date: 2025-1-21
---


{{ icons(c=config, i='note') }}
Primero que nada, ¿Por qué?<br>
Matemática.<br>
Porque quiero matemática.
<!-- more -->

En este momento, estoy usando Zola, que si bien es muy bonito, no soporta renderizar ecuaciones al generar el sitio a partir de markdown:

$\frac{a}{b} = c$

Podría usar MathJax o KaTeX para dibujarlas en el navegador, pero no me hace mucho sentido, si igual estoy generando todo el resto del sitio antes.

Tambien hay otras cositas que me gustaría tener, que tienen que ver mas bien con Markdown:
- en ecuaciones, imágenes y quizas en bloques de código
- Que los colores del código dependan de css, en vez de venir en la página al generarla

```rust
pub fn a(x: u64) -> u64 {
    x * 3
}
```

Lo ideal sería usar typst como fuente del contenido de las páginas de blog, que me gusta su sintaxis y puede hacer de tood lo que quiero, pero pasarlo a HTML no es tan fácil. Lo más razonable pareciera ser usar pandoc, aunque lo ideal sería que se termine de incorporar la salida en HTML al compilador de typst.