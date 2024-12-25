use dioxus::prelude::*;
use dioxus_elements::{
    geometry::{euclid::Vector2D, ElementPoint},
    input_data::MouseButton,
};

const FAVICON: Asset = asset!("/assets/favicon.ico");
const TAILWIND_CSS: Asset = asset!("/assets/tailwind.css");
const TILE_SIZE: f64 = 256.0;

const ZOOM_SPEED: f64 = 0.005;
const DRAG_SPEED: f64 = 0.01;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    rsx! {
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "stylesheet", href: TAILWIND_CSS }
        Map {}
    }
}

fn mouseMove(event: Event<MouseData>) {}

#[component]
pub fn Map() -> Element {
    let mut zoom = use_signal(|| 0 as f64);
    // let mut oldX = use_signal(|| 0 as f64);
    // let mut oldY = use_signal(|| 0 as f64);
    // let mut x = use_signal(|| 0 as f64);
    // let mut y = use_signal(|| 0 as f64);
    let mut oldMousePos = use_signal(|| Vector2D::new(0.0, 0.0));
    let mut mapPos = use_signal(|| Vector2D::new(0.0, 0.0));

    let mut tileCount = use_signal(|| (0 as u32, 0 as u32));
    let totalTileCount = use_memo(move || tileCount.read().0 * tileCount.read().1);
    let mut is_dragging = use_signal(|| false);

    rsx! {
        div {
            class: "overflow-hidden",
            onwheel: move |event| {
                let new_zoom = (zoom() - event.delta().strip_units().to_f64().y * ZOOM_SPEED).clamp(0.0, 19.0);
                dbg!(new_zoom);
                zoom.set(new_zoom);
            },
            onresize: move |event| {
                let count = (event.get_content_box_size().unwrap()/TILE_SIZE).ceil();
                tileCount.set((count.width as u32, count.height as u32));
                dbg!(tileCount.read());
            },

            onmousemove: move |event| {
                let mousePos = event.screen_coordinates().to_vector();

                if is_dragging() {
                    let mouse_delta = mousePos-oldMousePos();
                    mapPos.set(mapPos() + mouse_delta * DRAG_SPEED);
                    dbg!(mapPos.read());
                };

                oldMousePos.set(mousePos);
            },


            // Toggle dragging
            onmousedown: move |event| {
                match  event.trigger_button()  {
                    Some(MouseButton::Primary) => {
                        is_dragging.set(true);
                    },
                    _ => {}
                }
            },
            onmouseup: move |event| {
                match  event.trigger_button()  {
                    Some(MouseButton::Primary) => {
                        is_dragging.set( false);
                    },
                    _ => {}
                }
            },


            class: "h-lvh",

            // tiles
            div {
                class: "grid grid-cols-[repeat(var(--cols),1fr)]",
                style: format!("--cols: {}", tileCount.read().0),
                // "cols": tileCount.read().0,


                for y in 0..tileCount.read().1 {
                    for x in 0..tileCount.read().0 {
                        img {
                            class: "drag-none",
                            src: format!("https://a.tile.openstreetmap.org/{}/{}/{}.png", zoom() as u8, x + mapPos.read().x as u32, y + mapPos.read().y as u32),
                        }
                    }
                }

            }
        }
    }
}
