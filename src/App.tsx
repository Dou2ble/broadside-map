import {
  createSignal,
  type Component,
  createMemo,
  createEffect,
} from "solid-js";
import { createWindowSize } from "@solid-primitives/resize-observer";
import _ from "lodash";
import { Repeat } from "@solid-primitives/range";
import { toLon, toLat, toTileX, toTileY, toTileZoom } from "./slippy";

const MIN_TILE_SIZE = 128;
const MAX_TILE_SIZE = 2 * MIN_TILE_SIZE; // this is not configurable
const ZOOM_SPEED = 0.0005;
const MAIN_BUTTON = 0; // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button

const App: Component = () => {
  let windowSize = createWindowSize();

  let [lon, setLon] = createSignal(18.08833242765503);
  let [lat, setLat] = createSignal(59.312313777625604);
  let [zoom, setZoom] = createSignal(15);

  let isDragging = false;
  let oldMouseX = 0;
  let oldMouseY = 0;

  let tileZoom = createMemo(() => toTileZoom(zoom()));
  let tileX = createMemo(() => toTileX(lon(), tileZoom()));
  let tileY = createMemo(() => toTileY(lat(), tileZoom()));

  let tileCountX = createMemo(
    () => Math.ceil(windowSize.width / MIN_TILE_SIZE) + 1
  );
  let tileCountY = createMemo(
    () => Math.ceil(windowSize.height / MIN_TILE_SIZE) + 1
  );

  let tileSize = createMemo(
    () => MIN_TILE_SIZE + MIN_TILE_SIZE * (zoom() - tileZoom())
  );

  let offsetX = createMemo(() => tileSize() * (Math.floor(tileX()) - tileX()));
  let offsetY = createMemo(() => tileSize() * (Math.floor(tileY()) - tileY()));

  function clientToTileX(clientX: number): number {
    return (clientX - offsetX()) / tileSize();
  }

  function clientToTileY(clientY: number): number {
    return (clientY - offsetY()) / tileSize();
  }

  return (
    <div
      class="grid relative overflow-hidden h-lvh select-none bg-ocean"
      onWheel={(event) => {
        setZoom(zoom() - event.deltaY * ZOOM_SPEED);
      }}
      onmousedown={(event) => {
        if (event.button == MAIN_BUTTON) {
          isDragging = true;
        }
      }}
      onmouseup={(event) => {
        if (event.button == MAIN_BUTTON) {
          isDragging = false;
        }
      }}
      onmouseleave={() => (isDragging = false)}
      onmousemove={(event) => {
        if (isDragging) {
          setLon(
            lon() -
              toLon(clientToTileX(event.clientX), zoom()) +
              toLon(clientToTileX(oldMouseX), zoom())
          );
          setLat(
            lat() -
              toLat(clientToTileY(event.clientY), zoom()) +
              toLat(clientToTileY(oldMouseY), zoom())
          );
        }
        oldMouseX = event.clientX;
        oldMouseY = event.clientY;
      }}
    >
      {/* The current zoom level */}
      {Array.from({ length: tileCountY() }).map((_, y) =>
        Array.from({ length: tileCountX() }).map((_, x) => (
          <div
            class="bg-cover absolute top-0 left-0"
            style={`
              left: ${offsetX() + x * tileSize()}px;
              top: ${offsetY() + y * tileSize()}px;
              width: ${tileSize()}px;
              height: ${tileSize()}px;
              background-image: url('https://a.tile.openstreetmap.org/${tileZoom()}/${Math.floor(
              tileX() + x
            )}/${Math.floor(tileY() + y)}.png');
                `}
          ></div>
        ))
      )}
    </div>
  );
};

export default App;
