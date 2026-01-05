+++
title = "\"Dibujando\" ecuaciones con Unicode"
description = "Intentos de armar un árbol abstracto para ecuaciones LaTeX, y pasarlo a caracteres Unicode."
date = 2025-08-05
draft = true
[extra]
math = true
code = true
+++

Tengo un bot de Discord que, entre varias otras cosas, permite buscar artículos
de Wikipedia (y otras wikis), y mostrarlos como mensaje en el chat.
Para ello, toma el HTML desde la API de MediaWiki, lo _parsea_,
filtra algunos elementos que no quiero (tablas, imágenes, cosas así),
transforma el árbol de HTML a (una aproximación de) un árbol de Markdown,
y pasa ese árbol de Markdown a texto.
Funciona sorprendentemente bien, pero no siempre es obvio qué hacer con cada
tipo de elemento que hay. Por ejemplo: Discord no tiene como hacer tablas,
pero a veces hay tablas de 1 sola columna, que se pueden pasar sin problemas
a texto plano sin perder información.

Una de esas cosas con las que no es claro que hacer es con las ecuaciones.
Wikipedia usa MathML para dibujarlas, y queda en el HTML el LaTeX original a
partir de las que se renderizan.
Inicialmente simplemente puse ese LaTeX (en un bloque de código, para mantener
su formato, y para que se noten distintas al resto del texto). Sin embargo, no
son particularmente fáciles de leer, en especial porque por alguna razón
Wikipedia usa mas paréntesis de lo necesario (por ejemplo, cosas tipo
`{\frac{a}{b} + {\sqrt{c}}}` en vez de simplemente `\frac{a}{b} + \sqrt{c}`)

# El primer intento

Como primera solución, hice que al poner la ecuación en el Markdown, primero
pasara por [pandoc](https://pandoc.org/) para transformarla a texto plano. En su mayoría, funciona bien,
pero no me pareció tan buena solución:

Primero, pandoc no se integra tan bien
con Rust, que es el lenguaje en que está escrito el bot: hay una biblioteca en
[crates.io](https://crates.io/crates/pandoc), pero no incluye pandoc en sí, hay que instalarlo aparte.
Dado eso, no me pareció necesario usar la biblioteca y terminé llamando al comando
directamente, usando la biblioteca estándar de Rust.

Segundo, pandoc hace mucho mas que lo que yo necesitaba, un poco demasiado:
Tiene como chorromil formatos distintos que entiende, y que es capaz de
convertir: Markdown, LaTeX, Asciidoc, Org-Mode de Emacs, Typst, formato de
MediaWiki, HTML, PDF, incluso formatos de MS Word y PowerPoint.
Es útil, pero es mucho programa como para instalarlo en el servidor sólo para
pasar de LaTeX a texto plano.

Finalmente, pandoc en general hace bien la pega, como dije, pero hay algunos
casos en que estaba dando error. Al principio pensé que podía ser al usar
`\displaystyle`, pero no: Pasa de `$\displaystyle \int_0^\infty f(x) dx$` a
`∫₀^(∞)f(x)dx` sin problemas. Mi siguiente idea fue que quizas se usan comandos
de algún paquete no soportado, amsmath o algo así. Pero tampoco parece ser el
caso: `$\mathbb{R}$` pasa a `ℝ`, `$\operatorname{sen} \pi$` pasa a `sen π`...
Despues de varios intentos, encontre un comando que no funcionaba: `\frac`. Si,
resulta que pandoc no soporta fracciones.

Con todas estas razones (la última siendo la de mayor peso: como sabrán,
muchas ecuaciones usan fracciones, y me gustaría que se leyesen decente),
y sin encontrar ninguna otra solución por los internets, decidí hacer una yo:
una biblioteca en Rust que tome una ecuación en LaTeX, y la convierta a texto
plano, usando los caracteres Unicode que sean pertinentes.

# Entendiendo $\LaTeX$

Primero hay que entender mas o menos como funciona LaTeX como lenguaje. En el
modo matemática, hay 4 tipos de "unidades" de significado: Comandos, símbolos,
bloques y espacios en blanco. Empecemos por el mas simple:

## Espacios en Blanco

En modo matemática, son (casi) completamente irrelevantes. Para el compilador,
`$\sqrt{a^2+b^2}$` y `$ \sqrt      {   a^   2 +  b    ^ 2   }     $` son
exactamente lo mismo. Los únicos detallitos importantes son con los comandos:
No puede haber un espacio en blanco dentro de un comando. `\varpi` funciona,
`\ var pi` no.

{% figure(caption="Ejemplos de LaTeX, dibujados en éste post por [$\KaTeX$](https://katex.org/)") %}
| LaTeX | Resultado |
|-------|-----------|
| `\sqrt{a^2+b^2}` | $\sqrt{a^2+b^2}$ |
| `\sqrt      {   a^   2 +  b    ^ 2   }     ` | $ \sqrt      {   a^   2 +  b    ^ 2   }     $ |
| `\varpi` | $\varpi$ |
| `\ var pi` | $\ var pi$ |
{% end %}

## Bloques

Los bloques son grupos de cosas que se comportan como una sola _cosa_, rodeados
de llaves: `{contenido del bloque}`. Cuando digo que "se comportan como una
sola _cosa_", básicamente quiero decir que un bloque cuenta como 1 solo argumento
para comandos, independiente de cuántas cosas tenga adentro. Hay un segundo tipo
de bloque, con corchetes en vez de llaves (`[así]`), que se comportan un poco
distinto: sólo se comportan como bloques cuando se pasan como argumento, si no,
los corchetes quedan como símbolos en el resultado final.


{% figure(caption="Bloques con cosas adentro") %}
| LaTeX | Resultado |
|-------|-----------|
| `{a^2 + b^2}` | ${a^2 + b^2}$ |
| `[a^2 + b^2]` | $[a^2 + b^2]$ |
{% end %}

## Comandos

Los comandos se escriben como `\nombre`, donde el nombre puede ser: una palabra,
de caracteres no símbolos, o un solo símbolo. Pueden tomar argumentos opcionales,
u obligatorios. Un comando que toma $n$ argumentos obligatorios, va a "comerse"
las siguientes $n$ _cosas_ que no sean bloques entre corchetes:

{% figure() %}
| LaTeX | Resultado |
|-------|-----------|
| `\frac{a + b}{c + d}` | $\frac{a + b}{c}$ |
| `\frac a b` | $\frac a b$ |
| `\frac[a][b]` | $\frac[a][b]$ |
{% end %}

Notar como en el primer ejemplo, se considera cada bloque como una _cosa_,
en el segundo, cada letra como una _cosa_, y en el tercero, el corchete y la 'a'
como _cosas_.

Los comandos también pueden tomar comandos opcionales, entre corchetes,
antes de los obligatorios

{% figure() %}
| LaTeX | Resultado |
|-------|-----------|
| `\sqrt[b]{a}` | $\sqrt[b]{a}$ |
| `\sqrt{a}[b]` | $\sqrt{a}[b]$ |
| `\sqrt{a}{b}` | $\sqrt{a}{b}$ |
{% end %}

## Símbolos

Todo el resto de caracteres se toman com _símbolos_ individuales, donde cada
uno puede tener alguna lógica para separarse de sus vecinos:

{% figure(caption = "Entre letras no hay espacio, pero entre letras y '+' sí,\
y también después de una coma.") %}
| LaTeX | Resultado |
|-------|-----------|
| `abc` | $abc$ |
| `a+b` | $a+b$ |
| `a,b` | $a,b$ |
{% end %}

Mentí. No todo el resto de caracteres se comporta así. Hay algunas excepciones:
- `\` es prefijo de los comandos, hace que lo que sea que viene después se
	interprete como comando. Para escribir un `\` literal se debe usar el
	comando `\backslash`
- `$` termina el bloque de matemática. Se puede escribir un `$` literal con `\$`
- `_` indica que la _cosa_ que viene después es un subíndice,
  bajo lo que tiene antes
- `^` indica que la _cosa_ que viene después es un superíndice, sobre lo que
	tiene antes

El caso de los sub/superíndices es interesante. Se pueden poner ambos en una
misma base, en cualquier orden:
{% figure() %}
| LaTeX | Resultado |
|-------|-----------|
| `a_b` | $a_b$ |
| `a^b` | $a^b$ |
| `a_b^c` | $a_b^c$ |
| `a^c_b` | $a^c_b$ |
{% end %}

Con todo esto, ahora tenemos una idea de la lógica que sigue el lenguaje,
y podemos diseñar la biblioteca.

# Plantando un árbol (de sintaxis abstracta)

Decidí inicialmente que la biblioteca tenía que hacer algo de tipo
`LaTeX -> AST -> Texto Plano`, por lo que primero toca diseñar el Árbol de
Sintaxis Abstracta (AST).

{% tangent(title = "Curso rápido de Lenguajes de Programación" )%}
TODO: esto

- programamos en texto
- pc no entiende texto
- programa (parser) "parsea" el testo a una representación abstracta
- interprete ejecuta la representación abstracta
- compilador compila (o sea, convierte el AST a un programa equivalente en otro lenguaje, normalmente código de máquina)
- otras cosas trabajan con la representación abstracta sin ejecutar/compilar
  - type checker
  - etc
{% end %}

El análisis del lenguaje que ya hicimos nos lleva a que su estructura es,
en [Forma Normal de Backus-Naur](https://es.wikipedia.org/wiki/Notaci%C3%B3n_de_Backus-Naur) (que podría tener errores, no lo pensé tanto):
```bnf
<nombre> := <letra>+ | <símbolo>
<bloque_corchete> := "[" <ecuación> "]"
<bloque_llave> := "{" <ecuación> "}"
<comando> := "\" <nombre>
<subíndice> := "_" <cosa>
<superíndice> := "^" <cosa>
<cosa> := <comando>
          | <bloque_corchete>
          | <bloque_llave>
          | <subíndice>
          | <superíndice>
          | <símbolo>
          | <letra>
<ecuación> := <cosa>*
```
de donde obtenemos directamente un árbol bastante razonable.

{% tangent(title = "LaTeX como lenguaje") %}
LaTeX de _rial_ es un desastre. No es un lenguaje libre de contexto (lenguaje...
con contexto?), lo que lo hace difícil de manipular. En realidad lo que estoy
considerando es una forma de LaTeX simplificada, con el objetivo de implementar
un subconjunto razonable de ecuaciones LaTeX válidas.

LaTeX permite cambiar el significado sintáctico de símbolos
en el mismo programa, o sea, puedes re-definir qué símbolos son sintácticamente
relevantes, lo que hace imposible el parsear un programa sin ejecutarlo.

Si alguna vez estás diseñando un lenguaje y se te ocurre que eso podría ser
buena idea, no lo es. Para. Deja de hacer lo que sea que estes haciendo, anda a
sentarte un rato y reconsidera tu vida. TeX tenía la ventaja de ser inventado
en ~1980, pero lo que estas haciendo tú no.

Lo que estoy haciendo yo tampoco: no soporto redefiniciones de nada, ni ninguna
cosa rara de esas. Lo siento mucho, usuarios de LaTeX que siempre usan
``\catcode`> = 0`` para empezar sus comandos con `>`.

LaTeX tiene también otros problemas de diseño, además de su sintaxis incierta.
Uno es que su único "tipo de dato" es texto. Todo es texto, y si alguna macro
hace cálculos, igual le puedes pasar otras cosas, así que tiene que encargarse
de validar su entrada.

También esta el hecho de que tiene alcance dinámico. O sea, las macros están
disponibles en cualquier punto después de ser definidas, independientemente del
bloque/entorno en que se hayan definido. O sea, si tienes
`\newcommand\comando{\newcommand\comandoo{hola} \comandoo}`, vas a tener `\comandoo`
definido despues de usar `\comando`. De hecho, como usa `\newcommand`, si usamos
`\comando` mas de una vez obtenemos un error de "comando `\comandoo`
ya esta definido".

Otro problema es que está basado en macros, es decir, cada vez que ve un comando,
lo reemplaza por su definición, y sólo ejecuta el programa cuando quedan únicamente
comandos _primitivos_. La verdad no se si ésto da algún "problema"
_per se_, pero no me gusta, es poco elegante y me da como cosita.
{% end %}

Para implementar el parser, usé la biblioteca [chumsky](https://crates.io/crates/chumsky),
para facilitarme un poco la vida. Es relativamente fácil y rápido usarla para
armar parsers, especialmente de gramáticas simples, como la que describimos aquí.
Además, a los nodos del AST les llamé _Tokens_, así que de ahora en adelante me
referiré a ellos así aquí también.

El resultado del parser es una lista de _Tokens_. Por ejemplo, si le paso
`\frac{a}{b} + f_1(x)`, el parser me va a devolver una lista de forma:
```rust
[
	Comando("frac"),
	Bloque([
		Simbolo("a")
	]),
	Bloque([
		Simbolo("b")
	]),
	Simbolo("+"),
	Simbolo("f"),
	Subindice([
		Simbolo("1")
	]),
	Simbolo("("),
	Simbolo("x"),
	Simbolo(")")
]
```

La parte interesante es la que viene ahora: pasar de _Tokens_ a texto de nuevo.

# _Tokens_ a texto

Una vez tenemos éste "árbol" de _Tokens_, parece relativamente simple pasarlo a texto:
Cada símbolo corresponde a si mismo, y los comandos llaman a alguna función con sus
argumentos.

Efectivamente, es mas o menos así. Lo implementé como un _struct_ llamado `Converter`
(similar a una _clase_ en otros lenguajes), para poder guardar configuración en
el objeto en si, y usarla fácilmente en sus métodos, pero podría haber sido una
sola función también.

Tiene un método que recorre la lista de _Tokens_, y según qué es cada uno, ejecuta
algo que da una cadena, y lo añade a una cadena de salida.

Sin embargo, igual hay que tener un poquito de cuidado con algunas cosas:

## Comandos
Los comandos deben poder recibir argumentos, que dependen del comando que sea.

Para ello, implementé cada comando como un _struct_ con un método que dice
cuántos argumentos opcionales y obligatorios toma, en una tupla $(n, k)$. Por ejemplo:
```rust
struct Frac;
impl Command for Frac {
	...
	fn name(&self) -> &str {
		"frac"
	}
 	fn shape(&self) -> (usize, usize) {
		(2, 0)
	}
}
```
El comando `frac` corresponde al _struct_ `Frac`, y su forma es (2 obligatorios, 0 opcionales).
Con ésto, cada vez que el `Converter` encuentra un comando, obtiene el objeto
correspondiente, y toma los _Tokens_ siguientes como argumentos. Primero recorre hasta
$k$ bloques entre corchetes, y los usa como argumentos opcionales, y después toma
exactamente $n$ _Tokens_, y los usa como argumentos obligatorios.

Ésto tiene algunas diferencias respecto de LaTeX. En particular, cuando le pasas
un bloque entre corchetes a un comando que espera un argumento obligatorio,
LaTeX toma solo el primer corchete como argumento, mientras que yo tomo el
bloque completo. No debería ser algo muy común, y en general como mi salida es de
una sola línea no importa mucho, pero si da problemas quizás
tenga que cambiarlo en el futuro.

{% figure() %}
| LaTeX         | Resultado KaTeX | Resultado mio   |
|---------------|-----------------|-----------------|
| `\frac{a}[b]` | $\frac{a}[b]$   | Conceptualmente $\frac{a}{[b]}$,<br>en realidad "`a/[b]`" |
{% end %}

## Símbolos especiales
En LaTeX, hay algunos símbolos que tienen significado especial:
- "$" indica el inicio/fin de matemática
- "&" es un punto de alineación, y separa elementos dentro de matrices
- entre otros

Para que funcionen bien, simplemente hice que algunos símbolos funcionen por sí
solos como comandos, y no he tenido problemas con eso aún.

## Sub/superíndices
Los sub/superíndices no me parecieron muy complicados de implementar realmente:
Convierto su "argumento" a texto, luego:
- si todos los caracteres tienen una forma en sub/superíndice, los reemplazo
- si no, lo dejo como `_(texto)`

Sin embargo, ésta solución simple de pasar los _Tokens_ directamente a texto
no funcionó tan bien...

# Problemas... y mas árboles como solución

Al pasar de _Token_ a texto, pierdo toda la información respecto a _qué_ son,
lo que acarrea algunos problemas. El mayor de ellos, es el espacio entre caracteres.
Inicialmente simplemente añadí un espacio entre cada token, pero ésto no funciona bien:
Pone espacios entre cosas que no deberían, como letras seguidas.

Decidí que para solucionarlo en vez de hacer `LaTex -> Token -> Texto Plano`, era
razonable introducir una estructura intermedia entre _Token_ y _String_. Los llamé
_Nodos_, por lo que ahora la conversión es `LaTeX -> Token -> Nodo -> Texto Plano`.

Éstos nodos contienen información _semántica_. Por ejemplo, en vez de un solo
tipo de nodo para símbolos, tengo varios distinto, según el tipo de símbolo:
- `Noun` para símbolos normales, como letras
- `Relation` para relaciones, como el signo igual
- `BinOp` para operaciones binarias, como sumas
- `Prefix` para operaciones de prefijo, como integrales
- `Postfix` para cosas que van seguidas a algo, como comas
- `NamedOp` para operadores de texto, como "sin", "cos" o "lim"
- `Left` para delimitadores izquierdos, como "(" o "{"
- `Right` para delimitadores derechos, como ")" o "}"

Ésto me permite poner el espacio entre dos _Nodos_ según qué son esos nodos:
No va espacio entre _Nouns_, pero sí entre un _Noun_ seguido de un _BinOp_.
También permite reglas un poco más complicadas: Va un espacio después de un _BinOp_,
a menos que el _Nodo_ anterior también era un _BinOp_, lo que permite que cosas
como `a+-b` queden como `a + -b`, con el signo negativo pegado a la "b".

Por otro lado, ahora los comandos ya no son funciones `Token -> String`, si
no funciones `Token -> Node`, lo que permite usar el mismo carácter unicode con
distintos propósitos: `convert("|") => Noun("|")` pero `convert("\mid") => Relation("|")`.

Resultó ser una solución bastante elegante, donde es relativamente fácil dar
distintos espaciados entre distintos _Nodos_. También permite que el espaciado no
sea en caracteres, si no en alguna unidad arbitraria (por ejemplo, 1/18 de em, como usa LaTeX),
para espaciados mas precisos, usando los caracteres Unicode apropiados.

También hay nodos recursivos para distintas estructuras, como por ejemplo:
- `Frac(num, denom)` para fracciones
- `Binom(n, k)` para coeficientes binomiales/números combinatorios
- `Sqrt(n, inner)` para raíces n-ésimas

Que saben dibujarse a si mismas, con sus contenidos y sus sub/superíndices. También es
relativamente simple añadir más, si se necesitaran.

# Modo texto

Añadiendo soporte para más comandos, me encontré con `\mbox`, que es bastante usado
(aunque menos que su alternativa de `amsmath`, `\text`) y toma su único argumento
como texto. Es decir, tengo que implementar modo texto.

Para ello, lo primero fue dejar de ignorar espacios al _parsear_, e introducir
un nuevo _token_ `Token::Space` para representarlos. Luego, tuve que hacer que
el método `convert` supiera que modo usar, e ignorara espacios en modo matemática,
y los pasara a `Noun(" ")` en modo texto.
Finalmente, cambié el método `shape` de los comandos para que pudiera decir en qué
modo hay que tomar cada argumento. La verdad, pensé que iba a ser mas difícil,
pero me gustaría pensar que la facilidad con que lo pude solucionar habla
relativamente bien del diseño del programa.

Tener modo texto me dio una idea interesante: Que las letras en modo matemática
sean en letra cursiva, como es en LaTeX. Puede ser medio complicado, ya que
solo algunos caracteres tienen versión cursiva en Unicode, pero es algo a
considerar.

# Acentos

LaTeX incluye varios comandos para acentuar caracteres, o dibujar distintos tipos de flechas sobre y bajo caracteres. Para implementar ésto, usé [caracteres de combinación](https://es.wikipedia.org/wiki/Caracteres_de_combinaci%C3%B3n). Decidí sin embargo priorizar caracteres pre-combinados cuando sea posible (por ejemplo, el carácter 'á' en vez de la secuencia 'a' + 'tilde de combinación'), asumiendo que en general se ven mejor en la mayoría de fuentes (si bien deberían ser visualmente idénticos según el estándar, no es tan así en al práctica.).

{% figure() %}
| LaTeX            | Resultado KaTeX  | Resultado mio |
|------------------|------------------|---------------|
| `\acute{aaa}`    | $\acute{aaa}$    | `aáa`         |
| `\overline{aaa}` | $\overline{aaa}$ | `aaa`         |
{% end %}
