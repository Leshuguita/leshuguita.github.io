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
Hay un poquito mucho espacio entre "o" y "t"
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
