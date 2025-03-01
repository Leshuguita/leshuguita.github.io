use std::{collections::HashSet, iter::FromIterator, mem::swap};

use glam::Vec2;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

use crate::{
    log,
    toy::Toy,
    utils::{get_css, MouseButton},
};

pub struct Life {
    // Vec<Vec<>> is probably not efficient, ok for now
    new_cells: Vec<Vec<bool>>,
    cells: Vec<Vec<bool>>,
    // queued_toggles
    queued: HashSet<(usize, usize)>,
    width: usize,
    height: usize,
    last_update: f32,
    iter: usize,
    mouse_pos: Option<Vec2>,
}
impl Life {
    const SCALE: f32 = 4.0;
    const UPDATES_PER_SECOND: f32 = 10.0;

    pub fn new(canvas: &HtmlCanvasElement) -> Self {
        let width = (canvas.width() as f32 / Self::SCALE).ceil() as usize;
        let height = (canvas.height() as f32 / Self::SCALE).ceil() as usize;

        let cells = Vec::from_iter((0..width).map(|_| {
            Vec::from_iter((0..height).map(|_| {
                // randomly initialize cells
                fastrand::bool()
            }))
        }));

        log("Initialized life");

        Self {
            new_cells: cells.clone(),
            cells,
            queued: HashSet::new(),
            width,
            height,
            last_update: 0.0,
            iter: 0,
            mouse_pos: None,
        }
    }

    fn get_cell(&self, pos: (usize, usize)) -> bool {
        self.cells[pos.0][pos.1]
    }
    fn set_cell(&mut self, pos: (usize, usize), alive: bool) {
        self.new_cells[pos.0][pos.1] = alive;
    }
    fn get_neighbor_count(&self, pos: (usize, usize)) -> u8 {
        let mut count = 0;
        for x_off in [-1, 0, 1] {
            for y_off in [-1, 0, 1] {
                if x_off == 0 && y_off == 0 {
                    continue;
                }
                let x = pos.0 as i32 + x_off;
                let y = pos.1 as i32 + y_off;
                if x < 0 || y < 0 || x >= self.width as i32 || y >= self.height as i32 {
                    // consider edges as dead
                } else if self.get_cell((x as usize, y as usize)) {
                    count += 1;
                }
            }
        }
        count
    }
    fn toggle_queued(&mut self) {
        for pos in self.queued.drain() {
            if pos.0 < self.width && pos.1 < self.height {
                self.cells[pos.0][pos.1] = !self.cells[pos.0][pos.1];
            }
        }
    }
    fn update_cell(&mut self, pos: (usize, usize)) {
        let neighbors = self.get_neighbor_count(pos);
        let alive = self.get_cell(pos);

        let next_alive = neighbors == 3 || alive && neighbors == 2;

        self.set_cell(pos, next_alive);
    }

    fn get_cells(&self) -> Vec<(usize, usize)> {
        (0..self.width)
            .flat_map(|i| (0..self.height).map(move |j| (i, j)))
            .collect()
    }

    fn draw(&self, ctx: &CanvasRenderingContext2d) {
        let scale: f64 = Self::SCALE.into();

        // clear screen
        ctx.clear_rect(
            0.0,
            0.0,
            self.width as f64 * scale,
            self.height as f64 * scale,
        );

        // paint alive cells
        for pos in self.get_cells() {
            let x = pos.0 as f64 * scale;
            let y = pos.1 as f64 * scale;

            if self.get_cell(pos) {
                ctx.set_global_alpha(1.0);
                ctx.begin_path();
                ctx.rect(x, y, scale, scale);
                ctx.fill();
            } else if self.new_cells[pos.0][pos.1] {
                // smooth out the animation a bit:
                // newly dead cells are still drawn,
                // bun in a fainter color
                ctx.set_global_alpha(0.2);
                ctx.begin_path();
                ctx.rect(x, y, scale, scale);
                ctx.fill();
            }
        }
    }
}
impl Toy for Life {
    fn cursor(&self) -> Option<&str> {
        Some("crosshair")
    }
    fn name(&self, lang: &str) -> &str {
        match lang {
            "es" => "Juego de la Vida",
            _ => "Conway's Game of Life",
        }
    }
    fn url(&self, lang: &str) -> &str {
        match lang {
            "es" => "https://es.wikipedia.org/wiki/Juego_de_la_vida",
            _ => "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
        }
    }
    fn text(&self, lang: &str) -> String {
        match lang {
            "es" => format!("Generación {}", self.iter),
            "en" => format!("Generation {}", self.iter),
            _ => self.iter.to_string(),
        }
    }
    fn update(&mut self, ctx: &CanvasRenderingContext2d, delta: f32) {
        // update color (in case theme is switched!)
        let color = get_css(ctx, "--text").unwrap_or("black".to_string());
        ctx.set_fill_style_str(&color);

        if self.last_update >= 1.0 / Self::UPDATES_PER_SECOND {
            // update all cells
            self.toggle_queued();
            for (x, y) in self.get_cells() {
                self.update_cell((x, y));
            }
            // new state is in new_cells, swap them
            swap(&mut self.cells, &mut self.new_cells);
            self.last_update = 0.0;
            self.iter += 1;
        }

        // redraw
        self.draw(ctx);
        self.last_update += delta;
    }
    fn on_mouse_move(&mut self, new_pos: Vec2, pressed: HashSet<MouseButton>) {
        if let Some(mouse_pos) = self.mouse_pos {
            if !pressed.is_empty() {
                let scaled = mouse_pos / Self::SCALE;
                let scaled_new = mouse_pos / Self::SCALE;

                let points = int_line_between(scaled, scaled_new);
                self.queued.extend(points);
            }
        }
        self.mouse_pos = Some(new_pos);
    }
    fn on_mouse_click(&mut self, pos: Vec2, _button: MouseButton) {
        let clicked_cell = (pos / Self::SCALE).floor();
        self.queued
            .insert((clicked_cell.x as usize, clicked_cell.y as usize));
    }
}

fn int_line_between(from: Vec2, to: Vec2) -> HashSet<(usize, usize)> {
    let diff: Vec2 = to - from;
    let i_from = from.floor();
    let i_to = to.floor();

    let mut out = HashSet::new();

    if diff.x == 0.0 {
        let slope = diff.x / diff.y;

        for y in (i_from.y as usize)..=(i_to.y as usize) {
            let x = i_from.x as usize + (slope * y as f32).floor() as usize;
            out.insert((x, y));
        }
    } else {
        let slope = diff.y / diff.x;

        for x in (i_from.x.floor() as usize)..=(i_to.x.floor() as usize) {
            let y = i_from.y as usize + (slope * x as f32).floor() as usize;
            out.insert((x, y));
        }
    }

    out
}
