import type { Photo } from "./types";

export type MediaBlock =
  | { kind: "single"; photo: Photo }
  | { kind: "pair"; photos: [Photo, Photo] };

/**
 * Photo tour rhythm: every run of three photos becomes one full-width frame
 * followed by a half-width pair. A trailing two becomes a pair, a trailing one
 * a single frame. Portrait shots are cropped into the same 3:2 frames.
 */
export function buildMediaBlocks(photos: Photo[]): MediaBlock[] {
  const blocks: MediaBlock[] = [];
  for (let i = 0; i < photos.length; i += 3) {
    const run = photos.slice(i, i + 3);
    if (run.length === 2) {
      blocks.push({ kind: "pair", photos: [run[0], run[1]] });
      continue;
    }
    blocks.push({ kind: "single", photo: run[0] });
    if (run.length === 3) blocks.push({ kind: "pair", photos: [run[1], run[2]] });
  }
  return blocks;
}

/** Photos in tour order (room by room), which is also the lightbox order. */
export function orderPhotosByRoom(
  photos: Photo[],
  rooms: { photoIds: string[] }[],
): Photo[] {
  const byId = new Map(photos.map((p) => [p.id, p]));
  const seen = new Set<string>();
  const ordered: Photo[] = [];
  for (const room of rooms) {
    for (const id of room.photoIds) {
      const photo = byId.get(id);
      if (photo && !seen.has(id)) {
        seen.add(id);
        ordered.push(photo);
      }
    }
  }
  for (const photo of photos) if (!seen.has(photo.id)) ordered.push(photo);
  return ordered;
}
