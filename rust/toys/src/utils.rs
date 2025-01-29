use web_sys::{window, CanvasRenderingContext2d};

pub fn get_css(ctx: &CanvasRenderingContext2d, prop: &str) -> Option<String> {
    let element = ctx.canvas().unwrap();
    window()
        .unwrap()
        .get_computed_style(&element)
        .unwrap()
        .unwrap()
        .get_property_value(prop)
        .ok()
}
