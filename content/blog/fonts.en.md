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

## The Search for Software

Looking around on the internet, I found a few options. Most of them are paid:

- [Glyphs](https://glyphsapp.com):\
  Nominally €299, they charge me {{ over(t="CLP",b="$") }}357,245 (~359 €)\
  Mac Only.
- [Glyphs Mini](https://glyphsapp.com):\
  Nominally €49, they charge me {{ over(t="CLP",b="$") }}59,728 (~60 €)\
  Mac only as well,\
  It's a more limited version of Glyphs.
- [FontLab](https://www.fontlab.com/font-editor/fontlab/):\
  Nominally {{ over(t="USD",b="$") }}499 plus tax, they charge me {{ over(t="CLP",b="$") }}596,204 (~{{ over(t="USD",b="$") }}629)
- [FontLab Studio](https://www.fontlab.com/font-editor/fontlab-studio-5/):\
  Nominally {{ over(t="USD",b="$") }}649 plus tax, they charge me {{ over(t="CLP",b="$") }}775,424 (~{{ over(t="USD",b="$") }}818)\
  Mac and Windows.\
  From what I could gather, and old version of FontLab.
- [TypeTool](https://www.fontlab.com/font-editor/typetool/):\
  Nominally {{ over(t="USD",b="$") }}49 plus tax, they charge me {{ over(t="CLP",b="$") }}58,548 (~{{ over(t="USD",b="$") }}61)\
  Mac and Windows.\
  A simplified version of FontLab Studio.
- [RoboFont](https://robofont.com/):\
  €400 or {{ over(t="USD",b="$") }}490, and only charge in euros or dollars.\
  Only for Mac

I'm going to complain about the way Glyph Mini displays its price: in the download page it shows "€49", but if you go to purchase it, they'll actually charge you €49.99.

In chilean pesos (CLP), a 19% <abbr title="Value-Added Tax">VAT</abbr> is included, and the exchange rate they offer is not very good.

A few other programs are free:

- [Birdfont](https://birdfont.org/) ([source code](https://github.com/johanmattssonm/birdfont)):\
  Windows, Linux, Mac and BSD.
- [FontForge](https://fontforge.org/en-US/) ([source code](https://github.com/fontforge/fontforge)):\
  Windows, Mac and Linux.

{% tangent(title="Price formats") %}
When writing this post, I needed a way to tell CLP and USD apart (both use the same symbol locally, $). The ISO standard is to just use letters, "xxx CLP" and "xxx USD". I don't really like it, it's kinda boring that neither gets to use its symbol. Also, for conistency, I'd have to use "xxx EUR", even when the euro symbol € is not ambiguous at all.

Something that seemed reasonable was to do a mix of both: "CL$xxx" or "CLP$xxx" (though with both 'P' and '$' it feels kinda redundant). While this is fine in english, it's not in spanish. Since this article has versions in both languages, I still needed a different solution.

I also thought of using emojis, like ":chile:$xxx" but it's a bit annoying to write emojis so often, and doesn't look too good.

In the end, I decided to place the ISO code above the symbol, if the symbol is not clear. It's not particularly elegant, but it seems decent enough. When selecting and copying the text, it's copied as "CLP$xxx" which is perfectly fine. I ended up liking how it looks more than "CL$xxx", so I'm using it for english as well.

I also found out that not all countries write euros the same way around: Spain, Germany, France, and others, use "xxx €", while Ireland and England use "€xxx". I'd assume this is common knowledge in Europe, but I had no idea. 
{% end %}

Ok, maybe saying its a _mess_ was a bit of an exaggeration. But the prices _are_ way too high for small personal projects. 

I don't have an Apple computer, so any options that only support MacOS are inmediately discarded. Also, since the whole point of this is to make a font for a small game I'm making in my free time, and that will most likely be free, it doesn't make much sense to go with a paid option: They're either way too expensive, or they're a bit too limited.

Thus, I have two options: Birdfont and FontForge. After trying out both, neither was perfect:
- Birdfont is a more modern program, but it's interface is a bit confusing, and not everything works quite right (For example, not everything can be undone, especially in the metrics part of the program).
- FontForge seems to be able to do a lot more, and even if its interface is a bit old, with lots of menus and windows, it's not that hard to navigate. However, it tends to crash when saving a project, even leaving the file completely empty, losing everyting in the project.