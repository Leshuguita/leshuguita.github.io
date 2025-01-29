mod boids;
mod toy;
mod utils;

use std::sync::Mutex;

use glam::Vec2;
use toy::{Toy, Toys};
use wasm_bindgen::prelude::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

static TOY: Mutex<Option<Toys>> = Mutex::new(None);

#[wasm_bindgen]
/// initialize a random toy
pub fn init_random_toy(canvas_id: &str) {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();

    fastrand::seed(web_time::UNIX_EPOCH.elapsed().unwrap().as_secs());

    let canvas = canvas(canvas_id);

    let mut t = TOY.lock().unwrap();
    *t = Some(Toys::random(&canvas));
}

#[wasm_bindgen]
/// tell the toy to update itself to its next frame
pub fn update_toy(canvas_id: &str, delta: f32) {
    let canvas = canvas(canvas_id);
    let context = ctx(&canvas);

    context.clear_rect(0.0, 0.0, canvas.width() as f64, canvas.height() as f64);

    let mut t = TOY.lock().unwrap();
    t.as_mut().unwrap().update(&context, delta);
}

#[wasm_bindgen]
pub fn toy_id() -> String {
    TOY.lock().unwrap().as_ref().unwrap().id().to_string()
}

#[wasm_bindgen]
/// tell the toy that the mouse moved, with its new position relative to the canvas
pub fn toy_mouse_move(new_x: f32, new_y: f32) {
    TOY.lock()
        .unwrap()
        .as_mut()
        .unwrap()
        .on_mouse_move(Vec2::new(new_x, new_y));
}

fn ctx(canvas: &HtmlCanvasElement) -> CanvasRenderingContext2d {
    canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap()
}

fn canvas(id: &str) -> HtmlCanvasElement {
    let document = web_sys::window().unwrap().document().unwrap();
    let canvas = document.get_element_by_id(id).unwrap();
    let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();
    canvas
}
