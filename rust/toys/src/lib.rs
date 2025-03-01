mod boids;
mod life;
mod toy;
mod utils;

use std::sync::Mutex;

use glam::Vec2;
use toy::{Toy, Toys};
use utils::MouseButton;
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

    log("Initializing random toy");

    fastrand::seed(web_time::UNIX_EPOCH.elapsed().unwrap().as_secs());

    let canvas = canvas(canvas_id);

    let random_init = Toys::random();
    let toy = random_init(&canvas);

    log(&format!("Toy chosen: {}", toy.name("en")));

    let mut t = TOY.lock().unwrap();
    *t = Some(toy);
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
pub fn toy_name(lang: &str) -> String {
    TOY.lock().unwrap().as_ref().unwrap().name(lang).to_string()
}

#[wasm_bindgen]
pub fn toy_url(lang: &str) -> String {
    TOY.lock().unwrap().as_ref().unwrap().url(lang).to_string()
}

#[wasm_bindgen]
pub fn toy_text(lang: &str) -> String {
    TOY.lock().unwrap().as_ref().unwrap().text(lang)
}

#[wasm_bindgen]
pub fn toy_cursor() -> Option<String> {
    TOY.lock()
        .unwrap()
        .as_ref()
        .unwrap()
        .cursor()
        .map(|s| s.to_string())
}

#[wasm_bindgen]
/// tell the toy that the mouse moved, with its new position relative to the canvas
pub fn toy_mouse_move(new_x: f32, new_y: f32, pressed: u8) {
    TOY.lock()
        .unwrap()
        .as_mut()
        .unwrap()
        .on_mouse_move(Vec2::new(new_x, new_y), MouseButton::from_buttons(pressed));
}

#[wasm_bindgen]
/// tell the toy that a click happened with its new position relative to the canvas and the button
/// 0: left, 1: middle, 2: right
pub fn toy_mouse_click(x: f32, y: f32, button: u8) {
    TOY.lock()
        .unwrap()
        .as_mut()
        .unwrap()
        .on_mouse_click(Vec2::new(x, y), MouseButton::from(button));
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
