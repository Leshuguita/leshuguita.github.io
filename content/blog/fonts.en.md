+++
title = "Type"
description = "How hard can designing a pixel typeface be?"
date = 2025-06-02
draft = true
+++

As a holiday project, I started making a small game. When building a system to display dialogue to the player, I became curious if I could make a typeface of my own for it. Surely it wouldn't be too hard to make a decent-liiking pixelated font for it.

I quickly found a nice website, [BitFontMaker2](https://www.pentacom.jp/pentacom/bitfontmaker2/), that gives you a grid of pixels to draw out your characters, and then download a `.ttf` font file build from them, plus a bit of metadata. In an afternoon I had a custom typeface not just in my dialogue boxes, but also on the whole interface.

{% img_figure(url="/blog/fonts/initial_en.png") %}
My new font, in the pause menu.
{% end %}

Then I continued on with my game. As I added more and more text, I found some character combinations that didn't look too nice.

{% img_figure(url="/blog/fonts/ex_1.png") %}
"o" and "t" are a bit too far apart
{% end %}

{% img_figure(url="/blog/fonts/ex_2.png") %}
The same goes for "fo"
{% end %}

{% img_figure(url="/blog/fonts/ex_3.png") %}
And even more so for "Ta"
{% end %}

Modern computer typefaces can adjust the spacing between specific pairs of characters. For example, a lot of fonts reduce the space between a "A" followed by a "V" so that their parallel lines are closer together.<br>
In the font that this blog uses, it's fairly obvious if you compare the spacing in "AM" with "AV". This is called a _kerning pair_.

I'm using Godot as the engine for my game, and it supports kerning, along with a few other font features like replacing characters according to surrounding ones, and replacing a few consecutive characters with a signle glyph. (_contextual substitution_ and _ligatures_, respectively)

So I asked myself: How do I do that for my font?

And then, I discovered the mess that are typeface design tools.
