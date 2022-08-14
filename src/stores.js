import { writable } from "svelte/store";

// Create a writable store that tracks each tetromino's position
export const tetrominoState = writable({ current: {}, next: {} });

export const positionState = writable({
  x: 4,
  y: 1,
});

export const cellsState = writable([]);

export const highScoreState = writable(0);
