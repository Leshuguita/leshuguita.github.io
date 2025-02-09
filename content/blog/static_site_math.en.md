+++
title = "Math and Static Sites"
date = 2025-01-21
draft = true
[extra]
math = true
+++

First off... why?<br>
Math.<br>
Math is why.<br>
<!-- more -->

Right now I'm using Zola, which while very nice and very fancy, does not support pre-rendered math:

$\frac{a}{b} = c$

Sure, I could use MathJax or KaTeX for rendering equations client-side, but that seems wasteful to me. After all, I'm already using a static site generator, might as well pre-render equations too.

There's other features I'd like, mainly to do with the fact that Markdown is a bit too limiting:
- I'd like captions on equations, images, and maybe code blocks
- Code block highlighting colors based on css, not chosen at generation

```rust
pub fn a(x: u64) -> u64 {
    x * 3
}
```

My ideal solution would be to use typst as the source for each blog page, which has a nice syntax and tons of features. However, turning it into html is not easy. The easiest thing right now seems to be using pandoc, though there's [work being done](https://github.com/typst/typst/issues/5512) in the typst compiler to output html.
