+++
title = "Tipo"
description = "¿Qué tan dificil puede ser diseñar un tipo de letra en pixeles?"
date = 2025-06-02
draft = true
+++

Como proyecto de vacaciones, me propuse hacer un juego chiquitito. Al construir el sistema para mostrar diálogos, decidí averiguar cómo hacer un tipo de letra (también llamados "tipografías" o "fuentes") propio, pues como el juego es en _pixel art_, hacer un tipo de letra que se vea decente no sonaba tan complicado.

Rápidamente encontré un sitio web, [BitFontMaker2](https://www.pentacom.jp/pentacom/bitfontmaker2/), que permite dibujar distintos caracteres en un lienzo de pixeles, y descargar un archivo `.ttf` construido a partir de éstos. En una tarde tenía el tipo de letra listo, no solo en los cuadros de diálogo, si no también en toda la interfaz.

{% img_figure(url="/blog/fonts/initial.png") %}
Mi tipo de letra, en el menú de pausa del juego.
{% end %}

Luego, pasaron unos dias en que seguí trabajando en el juego. Al añadir más texto, fui encontrando combinaciones de caracteres que no se veian tan bonitas.

{% img_figure(url="/blog/fonts/ex_1.png") %}
Hay un mucho espacio\
entre "o" y "t"
{% end %}

{% img_figure(url="/blog/fonts/ex_2.png") %}
Entre "f" y "o" igual
{% end %}

{% img_figure(url="/blog/fonts/ex_3.png") %}
Y es muy obvio entre "T" y "a"
{% end %}

Los tipos de letra que usan los computadores en la actualidad permiten, entre otras cosas, ajustar el espacio entre pares de letras específicos. Por ejemplo, muchos dipos de letra reducen el espacio entre una "A" seguida de una "V" de forma que las lineas paralelas coincidan, y se reduzca el espacio vacío entre ellas. En el tipo de letra de este blog, se puede ver comparando la distancia entre "AM" con "AV". A esto se le llama "Acoplamiento", o en inglés, _"Kerning"_

Por otro lado, el motor que estoy usando para el juego, Godot, soporta acoplamiento, además de otras capacidades de formatos modernos como reemplazar carácteres segun los que lo rodean, o reemplazar varios seguidos por uno solo ("reemplazo contextual" y "ligaduras", respectivamente)

Entonces me dije a mi mismo: "Mismo... como hago eso?"

Y ahí descubrí el desastre que es los programas de diseño de tipografías.

## Buscando _Software_

Investigando un poco en internet, encontré varias opciones. La mayoría son pagadas:

- [Glyphs](https://glyphsapp.com):\
  Nominalmente 299 €, me cobran {{ over(t="CLP",b="$") }}357.245 (~359 €)\
  Solo para Mac.
- [Glyphs Mini](https://glyphsapp.com):\
  Nominalmente 49 €, me cobran {{ over(t="CLP",b="$") }}59.728 (~60 €)\
  Solo para Mac.\
  Versión limitada de Glyphs.
- [FontLab](https://www.fontlab.com/font-editor/fontlab/):\
  Nominalmente {{ over(t="USD",b="$") }}499 + impuestos, me cobran {{ over(t="CLP",b="$") }}596.204 (~{{ over(t="USD",b="$") }}629)
- [FontLab Studio](https://www.fontlab.com/font-editor/fontlab-studio-5/):\
  Nominalmente {{ over(t="USD",b="$") }}649 + impuestos, me cobran {{ over(t="CLP",b="$") }}775.424 (~{{ over(t="USD",b="$") }}818)\
  Mac y Windows.\
  Por lo que entendí, una version antigua de FontLab.
- [TypeTool](https://www.fontlab.com/font-editor/typetool/):\
  Nominalmente {{ over(t="USD",b="$") }}49 + impuestos, me cobran {{ over(t="CLP",b="$") }}58.548 (~{{ over(t="USD",b="$") }}61)\
  Mac y Windows.\
  Una version simplificada de FontLab Studio.
- [RoboFont](https://robofont.com/):\
  400 € o {{ over(t="USD",b="$") }}490, solo cobran en euros o dólares.\
  Solo Mac.

Me voy a quejar de la forma en que Glyph muestra sus precios: En la página de descarga para Glyph Mini muestra "€49", mientras que en la página de compra para europa cobra 49,99 €.

En pesos chilenos se incluye el <abbr title="Impuesto al Valor Agregado">IVA</abbr> de 19%, aunque la conversion a pesos que usan no es muy conveniente.


Otros programas son gratis:
- [Birdfont](https://birdfont.org/) ([fuente](https://github.com/johanmattssonm/birdfont)):\
  Windows, Linux, Mac y BSD.
- [FontForge](https://fontforge.org/en-US/) ([fuente](https://github.com/fontforge/fontforge)):\
  Windows, Mac y Linux.

{% tangent(title="Formatos de Monedas") %}
Al escribir éste artículo, tuve que buscar una forma de diferenciar entre CLP y USD (ya que ambos usan el mismo símbolo, $). El estandar internacional ISO es "xxx CLP" y "xxx USD", pero no me gusta. Creo que es muy fome no usar simbolo para ninguno. Además, por consistencia, tendría que usar "xxx EUR", siendo que el simbolo de euros € no es para nada ambiguo.

Algo que me parecía razonable era hacer la cosa que Wikipedia dice explícitamente que no es recomendable, usar tanto texto como el simbolo, tipo "CLP$xxx" o "CL$xxx". Sin embargo, tiene razon que no es del todo legible.

Pensé también en usar emojis, tipo ":chile:$xxx" pero es un poco molesto estar escribiendo emojis a cada rato, y no se ve particularmente bien.

Al final, decidí que un punto medio decente era poner el código ISO sobre el símbolo, cuando el símbolo es ambiguo. No es particularmente elegante, pero me parece suficientemente decente. Al seleccionar y copiar/pegar el texto, queda como "CLP$xxx", que es decente igualmente. 

También descubrí que no todos los paises escriben igual los euros: España, Alemania y Francia, entre otros, usan "xxx €", mientras que Irlanda e Inglaterra usan "€xxx". Asumo que esto es conocimiento popular para la gente de Europa, pero yo no lo sabía. 
{% end %}

Ok, quizas fue una exageración decir que es un desastre. Pero los precios son un poco ridículos para proyectos personales.

No tengo ningun computador de Apple, lo que inmediatamente descarta todas las opciones que solo soportan eso. Además, como mi objetivo es hacer un tipo de letra para un juego que estoy haciendo en mi tiempo libre, y que probablemente termine siendo gratis, no tiene mucho sentido elegir una opcion pagada: O son muy caras, o son muy limitadas.

Por lo tanto, tengo dos opciones: Birdfont y FontForge. Despues de probar ambas, ninguna me convenció del todo:
- Birdfont es un programa más moderno, pero su interfaz es confusa, y no funciona bien del todo (Por ejemplo, no todos los cambios se pueden deshacer con <kbd>CTRL</kbd>+<kbd>Z</kbd>. En particular, los de la sección de métricas).
- FontForge es más completo, y si bien su interfaz es mas bien anticuada, con muchos menús y ventanas, no es tan difícil de navegar. Sin embargo, tiende a caerse de la nada al guardar el proyecto, a veces dejando el archivo completamente vacío, perdiendo todo lo que se habia hecho anteriormente.

Decidí usar FontForge, pues la parte que necesito (la de _kerning_) parece funcionar mejor. Solo tengo que recordar hacer copias de seguridad bien seguido.

## FontForge
