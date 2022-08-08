import { writable } from "svelte/store";

// Create a writable store that tracks each tetromino's position
export const tetrominoState = writable({});

export const positionState = writable({
  x: 4,
  y: 0,
});
