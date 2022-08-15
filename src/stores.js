import { writable } from "svelte/store";
import { newBoard, startingPosition } from "./logic";

// Create a writable store that tracks each tetromino's position
export const tetrominoState = writable({ current: {}, next: {} });

export const positionState = writable({ ...startingPosition });

export const cellsState = writable([...newBoard()]);

export const highScoreState = writable(0);

export const gameState = writable({});
