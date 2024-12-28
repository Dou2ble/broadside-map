// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Mathematics

export function toTileX(lon: number, tileZoom: number): number {
  return ((lon + 180) / 360) * Math.pow(2, tileZoom);
}

export function toTileY(lat: number, tileZoom: number) {
  return (
    (1 -
      Math.log(
        Math.tan(lat * (Math.PI / 180)) + 1 / Math.cos(lat * (Math.PI / 180))
      ) /
        Math.PI) *
    Math.pow(2, tileZoom - 1)
  );
}

export function toTileZoom(zoom: number): number {
  return Math.floor(zoom);
}

export function toLon(tileX: number, tileZoom: number): number {
  return (tileX / Math.pow(2, tileZoom)) * 360 - 180;
}

export function toLat(tileY: number, tileZoom: number): number {
  return (
    Math.atan(
      Math.sinh(Math.PI - (tileY / Math.pow(2, tileZoom)) * 2 * Math.PI)
    ) *
    (180 / Math.PI)
  );
}
