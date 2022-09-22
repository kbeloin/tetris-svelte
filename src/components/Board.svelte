<script>
  import {
    tetrominoState,
    positionState,
    cellsState,
    gameState,
  } from "../stores";
  import { cssVariables } from "../utility";
  import { width, height, size, fx, points, levels, speed } from "../logic";

  import Tetromino from "./Tetromino.svelte";
  import MobileControls from "./MobileControls.svelte";
  import { onDestroy } from "svelte";
  // import Ghost from "./Ghost.svelte";

  let tetromino;
  let position;
  let occupiedCells;
  let game;

  // uses tetromino, position, {dx, dy}
  function checkCollision(tetromino, p, { dx, dy }) {
    if (tetromino === null) return false;
    const { blocks } = tetromino;
    const { x, y } = $positionState;

    // Get furthest left and right blocks
    const left = Math.min(...blocks.map((block) => block.x + x));
    const right = Math.max(...blocks.map((block) => block.x + x));
    // Get furthest top and bottom blocks
    const bottom = Math.max(...blocks.map((block) => block.y + y));

    const adjacentCells = blocks.map((block, i) => {
      return (
        occupiedCells.filter(
          (cell) => cell.x === block.x + x + dx && cell.y === block.y + y + dy
        ).length > 0
      );
    });

    const outOfBounds =
      left + dx < 0 || right + dx > width - 1 || bottom + dy > height - 1;

    const collision = adjacentCells.some((cell) => cell);
    return outOfBounds || collision;
  }
  // uses checkCollision, tetromino, position, score, lockPlacement
  function fastDrop() {
    let score = 0;
    while (!checkCollision(tetromino, position, { dy: 1, dx: 0 })) {
      positionState.update((position) => ({
        ...position,
        y: position.y + 1,
      }));
      score += 1;
    }

    gameState.update((game) => ({
      ...game,
      score: game.score + score,
    }));

    lockPlacement();
  }
  // uses pause, fastDrop, updateBlock, check collision, playAudio, positionState
  function handleKeydown(event) {
    if (event.key === " ") {
      requestAnimationFrame($gameState.pause);
    } else if (!$gameState.paused) {
      if (event.key === "ArrowUp") {
        fastDrop();
      } else if (event.key === "ArrowLeft") {
        $gameState.play(fx, "move");
        const collides = checkCollision(tetromino, position, { dx: -1, dy: 0 });
        !collides &&
          positionState.update((position) => ({
            ...position,
            x: position.x - 1,
          }));
      } else if (event.key === "ArrowRight") {
        $gameState.play(fx, "move");
        const collides = checkCollision(tetromino, position, { dx: 1, dy: 0 });
        !collides &&
          positionState.update((position) => ({
            ...position,
            x: position.x + 1,
          }));
      } else if (event.key === "ArrowDown") {
        $gameState.play(fx, "move");
        const collides = checkCollision(tetromino, position, { dy: 1, dx: 0 });
        !collides &&
          positionState.update((position) => ({
            ...position,
            y: position.y + 1,
          }));
      } else if (event.key === "d") {
        handleRotate({ rx: -1, ry: 1 });
      } else if (event.key === "a") {
        handleRotate({ rx: 1, ry: -1 });
      }
    }
  }
  // uses tetromino, tetromino state, check collision
  function handleRotate({ rx, ry }) {
    $gameState.play(fx, "rotate");
    // Unsure how to handle rotation when tetromino does not rotate on a point whose center is on the grid(row, column)
    if ($tetrominoState.current.key === "O") return;
    const newBlocks = $tetrominoState.current.blocks.map((block, i) => {
      return {
        ...block,
        x: block.y * rx,
        y: block.x * ry,
      };
    });
    const collision = checkCollision({ blocks: newBlocks }, $positionState, {
      dx: 0,
      dy: 0,
    });
    if (!collision) {
      tetrominoState.update(({ current, next }) => ({
        next,
        current: {
          ...current,
          blocks: newBlocks,
        },
      }));
    }
  }

  // uses cells, lines, score, level
  function clearLines() {
    // Get all lines where every cell is occupied
    const fullRows = $cellsState.reduce((rows, row, i) => {
      if (row.every((cell) => cell.occupied)) {
        rows.push(i);
      }
      return rows;
    }, []);
    if (fullRows.length > 0) {
      let newCells = $cellsState.map((row, i) => {
        // clears lines
        if (fullRows.includes(i)) {
          return Array(width)
            .fill()
            .map((_, j) => ({
              x: j,
              y: i,
              occupied: false,
            }));
        } else {
          return row;
        }
      });

      cellsState.update((cells) => newCells);
      //   look for every row above (y < i) and move down
      fullRows.forEach((fullRow) => {
        let newCells = [
          ...$cellsState
            .filter((_, i) => i <= fullRow)
            .map((aboveRow, j) =>
              aboveRow.map((cell) => ({
                ...cell,
                occupied:
                  cell.y > 0 ? $cellsState[cell.y - 1][cell.x].occupied : false,
                color: cell.y > 0 ? $cellsState[cell.y - 1][cell.x].color : "",
              }))
            ),
          ...$cellsState.filter((_, i) => i > fullRow),
        ];
        cellsState.update((cells) => newCells);
      });
      gameState.update((game) => ({
        ...game,
        score: game.score + points(game.level, fullRows.length),
        lines: game.lines + fullRows.length,
        level: levels(game.level, game.lines),
        currentSpeed: speed(game.level),
      }));
      gameState.update((game) => ({
        ...game,

        level: levels(game.level, game.lines),
        currentSpeed: speed(game.level),
      }));

      //   increment score by number of lines cleared
    }
  }
  // Lock placement tetrominoState, positionState, game, cells
  function lockPlacement() {
    const { blocks } = $tetrominoState.current;
    const { x, y } = $positionState;

    if (y === 0) {
      $gameState.play(fx, "gameover");
      gameState.update((game) => ({
        ...game,
        over: true,
      }));

      tetrominoState.set({
        current: null,
        next: $tetrominoState.next,
      });
      return;
    } else {
      blocks.forEach((block) => {
        $cellsState[block.y + y][block.x + x].occupied = true;
        $cellsState[block.y + y][block.x + x].color = tetromino.color;
      });
      $gameState.play(fx, "collision");
      tetrominoState.set({
        current: null,
        next: $tetrominoState.next,
      });
    }
  }

  // uses updateBlock, checkCollision, lockPlacement
  function updateBlock() {
    // check if tetromino collides, update positionState if not. If it does, lock placement.
    const collides = checkCollision($tetrominoState.current, $positionState, {
      dy: 1,
      dx: 0,
    });
    !collides
      ? positionState.update((position) => ({
          ...position,
          y: position.y + 1,
        }))
      : lockPlacement();
  }

  function gameTime() {
    if ($gameState.started && !$gameState.paused && !$gameState.over) {
      setTimeout(() => {
        requestAnimationFrame(updateBlock);
        requestAnimationFrame(clearLines);
        requestAnimationFrame(gameTime);
      }, ($gameState.currentSpeed * 1000) / 60);
    }
    if ($gameState.over) {
      $gameState.track && $gameState.track.pause();
      clearTimeout();
    }
    return {
      destroy() {
        clearTimeout();
      },
    };
  }

  // uses game, track

  cellsState.subscribe((cells) => {
    occupiedCells = cells.flatMap((row) => row.filter((cell) => cell.occupied));
  });

  gameState.update((game) => ({
    ...game,
    gameTime: gameTime,
  }));

  const t = tetrominoState.subscribe((state) => {
    let { current } = state;
    tetromino = current;
  });

  const p = positionState.subscribe((newPosition) => {
    position = newPosition;
  });

  const g = gameState.subscribe((currentGame) => {
    game = currentGame;
  });

  onDestroy(() => {
    t();
    p();
    g();
  });
</script>

<svelte:window on:keydown={(event) => handleKeydown(event)} />

<div class="board-container">
  <div class="board-main">
    <div class="board" use:gameTime use:cssVariables={{ width, height, size }}>
      <Tetromino />
      <!-- <Ghost {checkCollision} slot="ghost" /> -->
      <!-- </Tetromino> -->
      {#each occupiedCells as cell}
        <div
          class="cell"
          style="
    --x: {cell.x + 1};
    --y: {cell.y + 1};
    --color: {cell.color};
  "
        />
      {/each}
    </div>
  </div>
  <div class="board-right">
    <slot name="score" />
    <slot name="preview" />
    <slot name="stats" />
    <slot name="controls" />
  </div>
</div>
<MobileControls />

<style>
  .board-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .board {
    --board-width: calc(var(--width) * var(--size) * 1px);
    --board-height: calc(var(--height) * var(--size) * 1px);
    width: var(--board-width);
    height: var(--board-height);
    min-width: var(--board-width);
    min-height: var(--board-height);

    display: grid;
    position: relative;
    grid-template-columns: repeat(calc(var(--width)), calc(var(--size) * 1px));
    grid-template-rows: repeat(calc(var(--height)), calc(var(--size) * 1px));
  }

  .board-main {
    padding: 0.25em;
    border-radius: 2px;
    box-shadow: inset 1px 1px 1px 1px black, 1px 1px 1px 1px black;
    background-color: black;
  }

  @media (max-width: 600px) {
    .board-container {
      transform: scale(0.8);
    }
  }
</style>
