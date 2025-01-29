use crate::boids::Boids;
use glam::Vec2;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

pub enum Toys {
    Boids(Boids),
}
impl Toys {
    pub fn random(canvas: &HtmlCanvasElement) -> Self {
        Toys::Boids(Boids::new(canvas))
    }
}
impl Toy for Toys {
    fn id(&self) -> &str {
        match self {
            Self::Boids(b) => b.id(),
        }
    }
    fn update(&mut self, ctx: &CanvasRenderingContext2d, delta: f32) {
        match self {
            Self::Boids(b) => b.update(ctx, delta),
        }
    }
    fn on_mouse_move(&mut self, new_pos: Vec2) {
        match self {
            Self::Boids(b) => b.on_mouse_move(new_pos),
        }
    }
}

pub trait Toy {
    fn id(&self) -> &str;
    fn update(&mut self, ctx: &CanvasRenderingContext2d, delta: f32);
    fn on_mouse_move(&mut self, new_pos: Vec2);
}
