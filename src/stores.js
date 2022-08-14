import { writable } from "svelte/store";

const width = 10;
const height = 20;
const size = 20;

// Create a writable store that tracks each tetromino's position
export const tetrominoState = writable({ current: {}, next: {} });

export const positionState = writable({
  x: 4,
  y: 1,
});

export const cellsState = writable(
  Array(height)
    .fill()
    .map((_, i) =>
      Array(width)
        .fill()
        .map((_, j) => ({
          x: j,
          y: i,
          occupied: false,
        }))
    )
);

export const highScoreState = writable(0);
