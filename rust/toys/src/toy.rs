use std::collections::HashSet;

use crate::{boids::Boids, life::Life, utils::MouseButton};
use glam::Vec2;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

type ToyInitFn = Box<dyn Fn(&HtmlCanvasElement) -> Toys>;
pub enum Toys {
    Boids(Boids),
    Life(Life),
}
impl Toys {
    pub fn random() -> ToyInitFn {
        let options: Vec<ToyInitFn> = vec![
            Box::new(|c: &HtmlCanvasElement| Toys::Boids(Boids::new(c))),
            Box::new(|c: &HtmlCanvasElement| Toys::Life(Life::new(c))),
        ];
        fastrand::choice(options).unwrap()
    }
}
impl Toy for Toys {
    fn name(&self, lang: &str) -> &str {
        match self {
            Self::Boids(b) => b.name(lang),
            Self::Life(l) => l.name(lang),
        }
    }
    fn url(&self, lang: &str) -> &str {
        match self {
            Self::Boids(b) => b.url(lang),
            Self::Life(l) => l.url(lang),
        }
    }
    fn text(&self, lang: &str) -> String {
        match self {
            Self::Boids(b) => b.text(lang),
            Self::Life(l) => l.text(lang),
        }
    }
    fn update(&mut self, ctx: &CanvasRenderingContext2d, delta: f32) {
        match self {
            Self::Boids(b) => b.update(ctx, delta),
            Self::Life(l) => l.update(ctx, delta),
        }
    }

    fn on_mouse_move(&mut self, new_pos: Vec2, pressed: HashSet<MouseButton>) {
        match self {
            Self::Boids(b) => b.on_mouse_move(new_pos, pressed),
            Self::Life(l) => l.on_mouse_move(new_pos, pressed),
        }
    }

    fn on_mouse_click(&mut self, pos: Vec2, button: MouseButton) {
        match self {
            Self::Boids(b) => b.on_mouse_click(pos, button),
            Self::Life(l) => l.on_mouse_click(pos, button),
        }
    }
}

pub trait Toy {
    /// Namo for the toy, in some lang
    fn name(&self, lang: &str) -> &str;
    /// url for more info about this, if there's any
    fn url(&self, lang: &str) -> &str;
    /// Some text to show on the lower left corner, in some language
    fn text(&self, lang: &str) -> String;
    /// Method to run every frame
    /// Should update, and draw to the canvas by using the ctx
    /// `delta` is the time between frames, in seconds
    fn update(&mut self, ctx: &CanvasRenderingContext2d, delta: f32);
    /// What to do if the mouse moves
    /// each toy is responsible of keeping track of the mouse position if needed
    fn on_mouse_move(&mut self, new_pos: Vec2, pressed: HashSet<MouseButton>);
    /// What to do if the mouse is clicked
    fn on_mouse_click(&mut self, pos: Vec2, button: MouseButton);
}
