use std::collections::HashSet;

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

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum MouseButton {
    Left,
    Middle,
    Right,
    Other(u8),
}
impl MouseButton {
    pub fn from_buttons(buttons: u8) -> HashSet<Self> {
        // buttons is a bitmap, where 1 is left, 2 is right and 4 is middle
        let mut out = HashSet::new();
        if buttons & 1 != 0 {
            out.insert(Self::Left);
        }
        if buttons & 2 != 0 {
            out.insert(Self::Right);
        }
        if buttons & 4 != 0 {
            out.insert(Self::Middle);
        }
        out
    }
}
impl From<u8> for MouseButton {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::Left,
            1 => Self::Middle,
            2 => Self::Right,
            o => Self::Other(o),
        }
    }
}
