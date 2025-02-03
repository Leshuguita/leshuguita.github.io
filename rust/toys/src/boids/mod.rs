use std::{
    collections::HashSet,
    f32::consts::PI,
    sync::{Arc, Mutex},
};

use crate::{
    log,
    toy::Toy,
    utils::{get_css, MouseButton},
};
use glam::Vec2;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

#[derive(Debug)]
struct Boid {
    pos: Vec2,
    vel: Vec2,
    accel: Vec2,
    canvas_size: Arc<Vec2>,
}
impl Boid {
    const MAX_SPEED: f32 = 40.0;
    const MAX_SPEED_SQ: f32 = Self::MAX_SPEED * Self::MAX_SPEED;
    const MIN_SPEED: f32 = 30.0;
    const MIN_SPEED_SQ: f32 = Self::MIN_SPEED * Self::MIN_SPEED;
    const SIGHT_FAR: f32 = 25.0;
    const SIGHT_NEAR: f32 = 10.0;
    const SIGHT_OBSTACLES: f32 = 20.0;
    const OBS_AV_STR: f32 = 6.0;
    const SIZE: f32 = 4.0;
    const SIZE_64: f64 = Self::SIZE as f64;

    const SEPARATION: f32 = 20.0;
    const COHESION: f32 = 0.0005;
    const ALIGNMENT: f32 = 0.2;
    fn new(max_x: u32, max_y: u32, canvas_size: Arc<Vec2>) -> Self {
        let vel = Vec2::from_angle(fastrand::f32() * 2.0 * PI)
            * (Self::MIN_SPEED + fastrand::f32() * (Self::MAX_SPEED - Self::MIN_SPEED));
        Self {
            pos: Vec2::new(
                fastrand::f32() * (max_x as f32),
                fastrand::f32() * (max_y as f32),
            ),
            vel,
            accel: Vec2::ZERO,
            canvas_size,
        }
    }
    fn wrapping_diff(&self, other_pos: &Vec2) -> Vec2 {
        // there's probably a better way
        let mut diff = other_pos - self.pos;
        for i in [-1.0, 1.0] {
            let abs = diff.abs();
            let new_diff = other_pos - (self.pos + i * *self.canvas_size);
            if new_diff.x.abs() < abs.x {
                diff.x = new_diff.x;
            }
            if new_diff.y.abs() < abs.y {
                diff.y = new_diff.y;
            }
        }
        diff
    }
    fn update(&mut self, others: &[Arc<Mutex<Boid>>], avoid: &[Vec2], delta: f32) {
        let mut pos_diff_sum = Vec2::ZERO;
        let mut neighbors = 0;

        for other in others {
            let o = other.try_lock();
            // if cannot be borrowed (is self), skip
            if o.is_err() {
                continue;
            }
            let o = o.unwrap();

            let diff = self.wrapping_diff(&o.pos);
            let dist = diff.length();

            if dist <= Self::SIGHT_FAR && self.vel.dot(diff) > -0.5 {
                // boids in far or near
                // => align (match direction, NOT speed)
                if dist > 0.0 {
                    let vel_diff = o.vel - self.vel;
                    let dir = vel_diff.normalize();
                    self.accel += dir * Self::ALIGNMENT;
                }

                // => collect data for cohesion
                pos_diff_sum += diff;
                neighbors += 1;

                if dist <= Self::SIGHT_NEAR {
                    // boids in the "near" radius
                    // => separate
                    let sep_dir = (-diff).project_onto(self.vel.perp()).normalize();

                    let sep_str = 1.0 - dist / Self::SIGHT_NEAR;
                    self.accel += sep_dir * sep_str * Self::SEPARATION;
                } else {
                    // boids in the "far" radius
                }
            }
        }

        // => cohesion
        if neighbors > 0 {
            let avg = pos_diff_sum / neighbors as f32;
            let coh_str = 1.0 - avg.length() / Self::SIGHT_FAR;
            self.accel += avg.normalize() * coh_str * Self::COHESION;
        }

        // avoid obstacles
        for obstacle in avoid {
            let diff = self.wrapping_diff(obstacle);
            let dist = diff.length();
            if dist <= Self::SIGHT_OBSTACLES && self.vel.dot(diff) > -0.5 {
                let dir_away = (-diff).project_onto(self.vel.perp()).normalize();
                let vel_chg = dir_away * Self::MAX_SPEED - self.vel;
                self.accel += vel_chg / dist * Self::OBS_AV_STR;
            }
        }

        // move
        self.vel += self.accel;

        if self.vel.length_squared() > Self::MAX_SPEED_SQ {
            self.vel = self.vel.normalize_or_zero() * Self::MAX_SPEED;
        }
        if self.vel.length_squared() < Self::MIN_SPEED_SQ {
            self.vel = self
                .vel
                .normalize_or(Vec2::from_angle(fastrand::f32() * 2.0 * PI))
                * Self::MIN_SPEED;
        }
        self.pos += self.vel * delta;
        self.accel = Vec2::ZERO;

        // wrap around canvas
        self.pos.x = self.pos.x.rem_euclid(self.canvas_size.x);
        self.pos.y = self.pos.y.rem_euclid(self.canvas_size.y);
    }
    fn draw(&self, ctx: &CanvasRenderingContext2d) {
        let mut offsets = vec![Vec2::ZERO];

        // missing corner cases
        if self.pos.x < Self::SIZE {
            offsets.push(Vec2::new(1.0, 0.0));
        }
        if self.pos.y < Self::SIZE {
            offsets.push(Vec2::new(0.0, 1.0));
        }
        if self.pos.x > self.canvas_size.x - Self::SIZE {
            offsets.push(Vec2::new(-1.0, 0.0));
        }
        if self.pos.y > self.canvas_size.y - Self::SIZE {
            offsets.push(Vec2::new(0.0, -1.0));
        }

        for o in offsets {
            let o = o * *self.canvas_size;
            ctx.begin_path();
            if self.vel == Vec2::ZERO {
                if let Err(e) = ctx.arc(
                    self.pos.x as f64 + o.x as f64,
                    self.pos.y as f64 + o.y as f64,
                    Self::SIZE_64 / 2.0,
                    0.0,
                    2.0 * std::f64::consts::PI,
                ) {
                    println!("Error drawing Boid!: {e:?}");
                }
            } else {
                let dir = self.vel.normalize();
                let tip = self.pos + o + dir * Self::SIZE;
                let right =
                    self.pos + o + dir.rotate(Vec2::from_angle(3.0 * PI / 4.0)) * Self::SIZE;
                let back = self.pos + o - dir * (Self::SIZE / 2.0);
                let left =
                    self.pos + o + dir.rotate(Vec2::from_angle(-3.0 * PI / 4.0)) * Self::SIZE;

                ctx.move_to(tip.x.into(), tip.y.into());
                ctx.line_to(right.x.into(), right.y.into());
                ctx.line_to(back.x.into(), back.y.into());
                ctx.line_to(left.x.into(), left.y.into());
            }

            ctx.fill();
        }
    }
}

pub struct Boids {
    boids: Vec<Arc<Mutex<Boid>>>,
    mouse_pos: Option<Vec2>,
    canvas_size: Arc<Vec2>,
}
impl Boids {
    pub fn new(canvas: &HtmlCanvasElement) -> Self {
        let w = canvas.width();
        let h = canvas.height();

        let canvas_size = Arc::new(Vec2::new(w as f32, h as f32));

        let boid_count = (w * h) / 300;
        let boids: Vec<Arc<Mutex<Boid>>> = (0..boid_count)
            .map(|_| Arc::new(Mutex::new(Boid::new(w, h, canvas_size.clone()))))
            .collect();
        log(&format!("Generated {} Boids: {:?}", boids.len(), &boids));

        Self {
            boids,
            mouse_pos: None,
            canvas_size,
        }
    }
}
impl Toy for Boids {
    fn name(&self, _lang: &str) -> &str {
        "Boids"
    }
    fn url(&self, lang: &str) -> &str {
        match lang {
            "es" => {
                "https://es.wikipedia.org/wiki/Comportamiento_de_enjambre#Modelos_matem%C3%A1ticos"
            }
            _ => "https://en.wikipedia.org/wiki/Boids",
        }
    }
    fn text(&self, _lang: &str) -> String {
        String::new()
    }
    fn update(&mut self, ctx: &CanvasRenderingContext2d, delta: f32) {
        for boid in &self.boids {
            boid.lock().unwrap().update(
                &self.boids,
                &self.mouse_pos.map_or(vec![], |s| vec![s]),
                delta,
            );
        }
        let color = get_css(ctx, "--text").unwrap_or("black".to_string());
        ctx.set_fill_style_str(&color);
        for boid in &self.boids {
            boid.lock().unwrap().draw(ctx);
        }
    }
    fn on_mouse_move(&mut self, new_pos: Vec2, _pressed: HashSet<MouseButton>) {
        if new_pos.x < 0.0
            || new_pos.x > self.canvas_size.x
            || new_pos.y < 0.0
            || new_pos.y > self.canvas_size.y
        {
            self.mouse_pos = None;
        } else {
            self.mouse_pos = Some(new_pos);
        }
    }
    fn on_mouse_click(&mut self, _pos: Vec2, _button: MouseButton) {}
}
