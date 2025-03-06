+++
title = "Haciendo una Fuente Pixelada"
description = "¿Qué tan difícil puede ser diseñar un tipo de letra en pixeles?"
date = 2025-06-02
+++

Como proyecto de vacaciones, me propuse hacer un juego chiquitito. Al construir el sistema para mostrar diálogos, decidí averiguar cómo hacer un tipo de letra (también llamados "tipografías" o "fuentes") propio, pues como el juego es en _pixel art_, hacer un tipo de letra que se vea decente no sonaba tan complicado.

Rápidamente encontré un sitio web, [BitFontMaker2](https://www.pentacom.jp/pentacom/bitfontmaker2/), que permite dibujar distintos caracteres en un lienzo de pixeles, y descargar un archivo `.ttf` construido a partir de éstos. En una tarde tenía el tipo de letra listo, no solo en los cuadros de diálogo, si no también en toda la interfaz.

{% img_figure(url="/blog/fonts/initial.png") %}
Mi tipo de letra, en el menú de pausa del juego.
{% end %}

Luego, pasaron unos días en que seguí trabajando en el juego. Al añadir más texto, fui encontrando combinaciones de caracteres que no se veían tan bonitas.

{% img_figure(url="/blog/fonts/ex_1.png") %}
Hay mucho espacio\
entre "o" y "t".
{% end %}

{% img_figure(url="/blog/fonts/ex_2.png") %}
Entre "f" y "o" igual.
{% end %}

{% img_figure(url="/blog/fonts/ex_3.png") %}
Y es muy obvio\
entre "T" y "a".
{% end %}

{% img_figure(url="/blog/fonts/ex_4.png") %}
Entre "s" y "t" es\
parecido al primer caso.
{% end %}


Los tipos de letra que usan los computadores en la actualidad permiten, entre otras cosas, ajustar el espacio entre pares de letras específicos. Por ejemplo, muchos tipos de letra reducen el espacio entre una "A" seguida de una "V" de forma que las lineas paralelas coincidan, y se reduzca el espacio vacío entre ellas. En el tipo de letra de este blog, se puede ver comparando la distancia entre "AM" con "AV". A esto se le llama "Acoplamiento", o en inglés, _"Kerning"_

Por otro lado, el motor que estoy usando para el juego, Godot, soporta acoplamiento, además de otras capacidades de formatos modernos como reemplazar caracteres según los que lo rodean, o reemplazar varios seguidos por uno solo ("reemplazo contextual" y "ligaduras", respectivamente)

Entonces me dije a mi mismo: "Mismo... como hago eso?"

Y ahí descubrí el desastre que es los programas de diseño de tipografías.

## Buscando _Software_

Investigando un poco en internet, encontré varias opciones. La mayoría son pagadas:

- [Glyphs](https://glyphsapp.com):\
  Nominalmente 299 €, me cobran {{ coin(c="CL",s="$") }}357.245 (~359 €)\
  Solo para Mac.
- [Glyphs Mini](https://glyphsapp.com):\
  Nominalmente 49 €, me cobran {{ coin(c="CL",s="$") }}59.728 (~60 €)\
  Solo para Mac.\
  Versión limitada de Glyphs.
- [FontLab](https://www.fontlab.com/font-editor/fontlab/):\
  Nominalmente {{ coin(c="US",s="$") }}499 + impuestos, me cobran {{ coin(c="CL",s="$") }}596.204 (~{{ coin(c="US",s="$") }}629)
- [FontLab Studio](https://www.fontlab.com/font-editor/fontlab-studio-5/):\
  Nominalmente {{ coin(c="US",s="$") }}649 + impuestos, me cobran {{ coin(c="CL",s="$") }}775.424 (~{{ coin(c="US",s="$") }}818)\
  Mac y Windows.\
  Por lo que entendí, una version antigua de FontLab.
- [TypeTool](https://www.fontlab.com/font-editor/typetool/):\
  Nominalmente {{ coin(c="US",s="$") }}49 + impuestos, me cobran {{ coin(c="CL",s="$") }}58.548 (~{{ coin(c="US",s="$") }}61)\
  Mac y Windows.\
  Una version simplificada de FontLab Studio.
- [RoboFont](https://robofont.com/):\
  400 € o {{ coin(c="US",s="$") }}490, solo cobran en euros o dólares.\
  Solo Mac.

Me voy a quejar de la forma en que Glyph muestra sus precios: En la página de descarga para Glyph Mini muestra "€49", mientras que en la página de compra para Europa cobra 49,99 €.

En pesos chilenos se incluye el <abbr title="Impuesto al Valor Agregado">IVA</abbr> de 19%, aunque la conversion a pesos que usan no es muy conveniente.


Otros programas son gratis:
- [Birdfont](https://birdfont.org/) ([fuente](https://github.com/johanmattssonm/birdfont)):\
  Windows, Linux, Mac y BSD.
- [FontForge](https://fontforge.org/en-US/) ([fuente](https://github.com/fontforge/fontforge)):\
  Windows, Mac y Linux.

{% tangent(title="Formatos de Monedas") %}
Al escribir éste artículo, tuve que buscar una forma de diferenciar entre CLP y USD (ya que ambos usan el mismo símbolo, $). El estándar internacional <abbr title='Organización Internacional de Normalización&#010;("ISO" del griego "isos", "igual")'>ISO</abbr> es "xxx CLP" y "xxx USD", pero no me gusta. Creo que es muy fome no usar símbolo para ninguno. Además, por consistencia, tendría que usar "xxx EUR", siendo que el símbolo de euros € no es para nada ambiguo.

Algo que me pareció razonable fue usar tanto texto como el símbolo, tipo "CLP$xxx" o "CL$xxx". Sin embargo, Wikipedia dice explícitamente que no es recomendable.

Pensé también en usar emojis, tipo ":chile:$xxx" pero es un poco molesto estar escribiendo emojis a cada rato, y no se ve particularmente bien.

También se me ocurrió poner código ISO sobre el símbolo, cuando el símbolo es ambiguo: "{{ over(t="CLP",b="$") }}xxx". Al seleccionar y copiar/pegar el texto, queda como "CLP$xxx", que es decente igualmente. Esta opción se ve razonable, pero deja poco espacio con la linea superior, a veces tocando las letras.

Al final, después de ver al primera opción siendo usada en varios artículos, noticias y documentos, decidí usar una variante: Poner el texto en un color con menos contraste, y en mayúsculas chicas: "{{ coin(c="CL",s="$") }}xxx". Creo que es más legible que simplemente "CL$xxx".

También descubrí que no todos los países escriben igual los euros: España, Alemania y Francia, entre otros, usan "xxx €", mientras que Irlanda e Inglaterra usan "€xxx". Asumo que esto es conocimiento popular para la gente de Europa, pero yo no lo sabía. 
{% end %}

Ok, quizás fue una exageración decir que es un desastre. Pero los precios son un poco ridículos para proyectos personales.

No tengo ningún computador de Apple, lo que inmediatamente descarta todas las opciones que solo soportan eso. Además, como mi objetivo es hacer un tipo de letra para un juego que estoy haciendo en mi tiempo libre, y que probablemente termine siendo gratis, no tiene mucho sentido elegir una opción pagada: O son muy caras, o son muy limitadas.

Por lo tanto, tengo dos opciones: Birdfont y FontForge. Después de probar ambas, ninguna me convenció del todo:
- Birdfont es un programa más moderno, pero su interfaz es confusa, y no funciona bien del todo (Por ejemplo, no todos los cambios se pueden deshacer con <kbd>CTRL</kbd>+<kbd>Z</kbd>. En particular, los de la sección de métricas).
- FontForge es más completo, y si bien su interfaz es mas bien anticuada, con muchos menús y ventanas, no es tan difícil de navegar. Sin embargo, tiende a caerse de la nada al guardar el proyecto, a veces dejando el archivo completamente vacío, perdiendo todo lo que se había hecho anteriormente.

Decidí usar FontForge, pues la parte que necesito (la de _kerning_) parece funcionar mejor. Solo tengo que recordar hacer copias de seguridad bien seguido.

## FontForge

Este pedacito va a parecer tutorial. FontForge tiene [su propio tutorial](https://fontforge.org/docs/tutorial.html), bastante completo, del que saqué la mayoría de información, pero aún así tuve que descubrir un par de cositas yo solo, asi que voy a dejar aquí como lo hice, por si a alguien le sirve.

Al abrir la fuente que ya tenía, FontForge muestra todos los caracteres que tiene (y otros vacíos). Al hacer doble click, se abre un editor que permite modificar la forma de cada carácter. Como ya tengo mis caracteres mas o menos listos, no use mucho ésta ventana.

{% img_figure(url="/blog/fonts/ff_main.png") %}
La ventana principal de FontForge.
{% end %}

{% img_figure(url="/blog/fonts/ff_edit.png") %}
La ventana de edición de glifo.
{% end %}

Para cambiar el acoplamiento entre pares, se hace desde el menú superior: `Elemento` > `Atributos Fuente...` > `Lookups` y en la pestaña GPOS. Aquí, se añade un nuevo Lookup, con tipo "Pair Position" y con la característica `kern`. Esto último es importante, pues es lo que le dice a quien dibuje el texto que tu fuente soporta _kerning_.

{% img_figure(url="/blog/fonts/ff_kern.png") %}
Un nuevo _Lookup_ de acoplado.
{% end %}

Dentro de este nuevo Lookup, se añade una Subtabla. Decidí usar _kerning classes_ (en vez de pares individuales), pues permite ajustar el acoplamiento de varios pares similares a la vez. Por ejemplo, el acoplamiento entre "T" y "o" va a ser igual al de "T" y "a", y por lo tanto "o" y "a" van en la misma clase.

{% img_figure(url="/blog/fonts/ff_kern_m.png") %}
La ventana de Subtabla de _kerning_.\
Arriba van las clases, abajo cuanto se junta/separa cada par de clases. A la derecha hay una vista previa, y la cajita para editar el acoplado del par de clases actual.
{% end %}

Esto es suficiente para que la mayoría de pares se vean bien. Sin embargo, hay un par de letras que complican un poco la cosa: "t" y "f". Ambas tienen un pixel hacia la izquierda, que hace que queden a 2 pixeles de distancia en la base, con todas las letras minúsculas. \
Para arreglar esto, decidí usar otra cosa mágica que hacen las fuentes: Reemplazos contextuales. Primero, reduzco el espacio en casi todos los pares terminados en "f" o "t". Luego, si el palito a la izquierda queda tocando la letra, reemplazo la "t" o "f" por una variante sin palito.

Para ello, primero cree las alternativas: En el menú superior de la ventana principal, en `Codificación` > `Add Encoding Slots...` cree 2 _slots_ nuevos. Éstos aparecen al final de todos. Para ponerles nombre, se hace `Click Derecho` > `Atributos Carácter` y se cambia el _Glyph Name_. Les puse "t_alt" y "f_alt". Luego, copié y pegue los polígonos de la letra respectiva (desde y hasta la ventana de edición de glifo), y les saqué el pixel de la izquierda.

Después, cree dos Lookups en la pestaña GSUB: uno que define cual es el glifo alternativo, y otro que dice cuando usar esa alternativa.

El primero es de tipo "Single Substitution", y su Subtabla simplemente contiene pares letra - alternativa.

El segundo es de tipo "Contextual Chaining Substitution", con la característica `calt` (¡Igual de importante que `kern`!), y su subtabla tiene tres clases: una para "t", una para "f", y una para los caracteres para los que se debe usar la alternativa. Arriba van las reglas, en este caso en la forma `clase_anterior | clase_a_reemplazar @\<subtabla_de_reemplazos> |`. Abajo van las clases mencionadas anteriormente.

{% img_figure(url="/blog/fonts/ff_sub.png") %}
La ventana de Subtabla de Reemplazo Contextual.
{% end %}

Para probar como se ve algún texto arbitrario, se puede usar la ventana de Métricas: `Métrica` > `Abrir ventana de métricas`. Aquí es donde a mi a veces se me cae, así que desarrollé la costumbre de guardar y copiar el proyecto antes de abrir la ventana. Sospecho que la razón de caerse tiene que ver con que uso Wayland, pero no estoy seguro.

Yyy... eso es todo. Probablemente hayan pares de letras que se me pasaron, y que no quedaron bien, pero eso lo descubriré y lo arreglaré mas adelante, cuando me de cuenta de cuales son.

La verdad, fuera de que se cae seguido al abrir la ventana de métricas, FontForge es bastante razonable. Se siente viejo, si, pero para mi eso no es un problema. Yo también me siento viejo a veces. No se si sobreviviría hacer una fuente de cero (no sabría, por ejemplo, añadir puntos nuevos en curvas existentes), pero para modificar algo que ya tienes, no da muchos problemas.

## Resultado

Aquí están los ejemplos que di al principio, con los cambios hechos a la fuente:

{% img_figure(url="/blog/fonts/fix_1.png") %}
Con "o" y "t", la "t"\
mantiene su palito.
{% end %}

{% img_figure(url="/blog/fonts/fix_2.png") %}
La "T" tiene harto espacio debajo,\
que la "a" ahora puede llenar.
{% end %}

{% img_figure(url="/blog/fonts/fix_3.png") %}
Entre "f" y "o" no se nota tanto\
la diferencia, pero igual creo que\
se ve bastante mejor.
{% end %}

{% img_figure(url="/blog/fonts/fix_4.png") %}
Con "s" y "t", la "t"\
pierde su palito.
{% end %}

Y las pestañas del menú de pausa:

{% img_figure(url="/blog/fonts/final.png") %}
Los únicos cambios son la "st" de "Estado" y la "it" de "Bitácora", creo.
{% end %}

Estoy bastante satisfecho con cómo quedó, y no fue tan doloroso de hacer.
