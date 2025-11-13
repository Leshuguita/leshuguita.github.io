---
title: Recursos académicos
template: learning.html
page_template: 404.html
---
En internet hay muchos recursos disponibles para aprender de casi todo lo que se te ocurra.
En particular, muchos de los recursos usados por universidades son de acceso público y gratuito.

Así, ésta página tiene como objetivo recopilar recursos de calidad sobre tantos temas como pueda,
con la esperanza de que le sirvan a alguien para aprender cosas nuevas.

Como es relativamente común saber algo de inglés, incluí recursos en ese idioma también.

---

{% collapsable_start() %}
# Matemática
{% end %}

## Universidad de Chile

Los apuntes usados en los cursos matemáticos del Plan Común de Ingeniería están
disponibles de forma pública en el [sitio de Docencia del Departamento de Ingeniería Matemática](https://plancomun.dim.uchile.cl/).
En general se ven los contenidos de forma bien teórica y abstracta.

Para algunos cursos, también existen grabaciones de las clases en YouTube.

Muchos de los apuntes incluyen guías de ejercicios, y también hay evaluaciones de años anteriores,
junto con sus pautas. A continuación los enlaces a cada uno de los ramos,
agrupados por tema y mas o menos en orden de nivel, junto con una breve descripción:

### Álgebra
1. [**Introducción al Álgebra**](https://plancomun.dim.uchile.cl/primero/ma1101/) \
	Introduce conceptos básicos de álgebra: Lógica proposicional, teoría de conjuntos,
	funciones y relaciones, estructuras algebraicas, números complejos y polinomios.
	{% lecture_videos() %}
	- [Otoño 2021 -- Prof. Sebastián Donoso](https://www.youtube.com/playlist?list=PLJKqJLRumYDpMLWikzt1mEhO7_PFS5Rpl)
	{% end %}

2. [**Álgebra Lineal**](https://plancomun.dim.uchile.cl/primero/ma1102/) \
	Continua del curso de Introducción al Álgebra, introduciendo matrices, vectores,
	espacios vectoriales y transformaciones lineales. Éstos dos cursos incluyen
	básicamente toda el álgebra que se ve en ingeniería.

### Cálculo
1. [**Introducción al Cálculo**](https://plancomun.dim.uchile.cl/primero/ma1001/) \
	Estudia en los números reales: funciones, sucesiones, límites y un acercamiento a
	derivadas, a partir de su definición como límite.
	{% lecture_videos() %}
	- [Otoño 2020 -- Prof. Jorge San Martín](https://www.dim.uchile.cl/~jorge/videosIC20.html)
	{% end %}

2. [**Cálculo Diferencial e Integral**](https://plancomun.dim.uchile.cl/primero/ma1002/) \
  Se ve continuidad de funciones, se profundiza sobre derivadas y las reglas que simplifican
  su cálculo, y se ve integración (propia e impropia).
	{% lecture_videos() %}
  - [Primavera 2021 -- Prof. Raúl Gormaz](https://www.youtube.com/playlist?list=PLfE_y9rZv2d3Yc5S2_teDvaZCcQIQN-WF)
	{% end %}

3. [**Cálculo en Varias Variables**](https://plancomun.dim.uchile.cl/segundo/ma2001/) \
  Como en nombre lo dice, se extienden los conceptos de cálculo a funciones de más de
  una variable, es decir funciones de forma $f: \mathbb{R}^n \to \mathbb{R}^n$. Además de los dos
  cursos anteriores de cálculo, asume completos los dos cursos de álgebra.
	{% lecture_videos() %}
  - [Primavera 2021 -- Prof. Javier Ramirez](https://www.youtube.com/playlist?list=PLpEdiqZh5K3ADR0ZZ97g1f3O7_75msoBe)
	{% end %}

4. [**Ecuaciones Diferenciales Ordinarias**](https://plancomun.dim.uchile.cl/segundo/ma2601/) \
	El nombre lo dice todo. Asume completos los cursos de álgebra, además de los primeros
	dos de cálculo. Está pensado para hacerse junto con Cálculo en Varias Variables, y usa
	algunas cosas vistas ahí.

5. [**Cálculo Avanzado y Aplicaciones**](https://plancomun.dim.uchile.cl/segundo/ma2002/) \
	Se ve cálculo vectorial (sobre campos), cálculo en los complejos, fourier, y ecuaciones
	diferenciales parciales. Asume completos todos los cursos anteriores, de
	cálculo y álgebra.
	{% lecture_videos() %}
	- [Primavera 2021 -- Prof. Raúl Gormaz](https://www.youtube.com/playlist?list=PLfE_y9rZv2d2Zolqxd-jHr57YJYFeAsZ2)
- [Otoño 2022 -- Prof. Gonzalo Flores](https://www.youtube.com/playlist?list=PLC0boWBmSdvY1HRwLkljIEfIFEvXpCukP)
	{% end %}

## Universidad de Nueva York

### [**Teoría de procesamiento de señales**](https://brianmcfee.net/dstbook-site/content/intro.html) (en inglés)
Un libro sobre procesamiento de señales digitales (discretas en el tiempo). Se ve desde la parte matemática,
pero también tiene ejemplos en Python.
Asume conocimientos básicos de álgebra y geometría, aunque incluye lo necesario en los apéndices,
además de otros links a material útil.

## Internet

### [3Blue1Brown](https://www.3blue1brown.com/) (en inglés)
Un muy buen canal de YouTube dedicado a la enseñanza de matemática, pone mucho énfasis en acercarse
a los temas de forma amigable, de forma que se entiendan bien los conceptos, sin quedarse
pegado en cálculos.
La mayoría (si no todos) sus videos tienen también subtítulos en español.

{{ collapsable_end() }}

---

{% collapsable_start() %}
# Computación
{% end %}

## Universidad de Chile

- [**Introducción a la Programación**](https://github.com/bpoblete/CC1002) \
  Un curso básico de programación en Python. Empieza de cero, enseñando
  de a poco el lenguaje en sí, junto con conceptos básicos sobre programación y
  algoritmos. \
  El _link_ contiene todo lo que se usa en el curso, incluyendo videos de clases
  y apuntes de cada una.

- [**Matemáticas Discretas para la Computación**](https://github.com/ahevia/CC3101_2021) \
  Se estudian las bases matemáticas usadas en computación: Lógica proposicional, demostraciones
  lógico/matemáticas, inducción, funciones, combinatoria, recurrencias y teoría de grafos.
  El _link_ incluye videos de las clases, y las diapositivas usadas.

- [**Algoritmos y Estructuras de Datos**](https://github.com/ivansipiran/AED-Apuntes) \
  Otro curso en Python, pero éste asume conocimiento del lenguaje.
  Se ven algoritmos y estructuras de datos que solucionan
  problemas comunes, y se dan herramientas para su análisis y optimización.

- [**Teoría de la Computación**](https://users.dcc.uchile.cl/~gnavarro/apunte.html) \
	(el link de descarga es lo último en la página!) \
	Asume conocidos los temas de Matemáticas Discretas, y se ven temas de lenguajes
	y computabilidad: autómatas finitos, de pila, gramáticas libres de contexto,
	máquinas de Turing y problemas de clase P y NP.

## Internet

### [_Ray Tracing in One Weekend_](https://raytracing.github.io/) (en inglés)
Una serie de libros sobre _ray tracing_, que va construyendo un _renderer_ desde
cero. Muy fáciles de seguir usando cualquier lenguaje de programación.

{{ collapsable_end() }}

---
