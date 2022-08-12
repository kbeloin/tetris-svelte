<script>
  import Tetromino from "../components/Tetromino.svelte";
  import Preview from "../components/Preview.svelte";
  import { tetrominoState, positionState } from "../stores";
  import { levels, speed, points } from "../logic";
  const START_LEVEL = 4;
  const START_LINES = 49;
  const START_SCORE = 0;

  let lines = START_LINES;
  let score = START_SCORE;
  let game = {
    started: false,
    paused: false,
    over: false,
  };
  let currentSpeed = speed[START_LEVEL];
  let level = START_LEVEL;
  let width = 10;
  let height = 20;
  let size = 20;
  let cells = Array(height)
    .fill()
    .map((_, i) =>
      Array(width)
        .fill()
        .map((_, j) => ({
          x: j,
          y: i,
          occupied: false,
        }))
    );
  let occupiedCells;
  let tetromino;
  let position;

  function checkCollision(tetromino, position, { dx, dy }) {
    if (tetromino === null) return false;
    const { blocks } = tetromino;
    const { x, y } = position;
    const occupiedCells = cells.flatMap((row) =>
      row.filter((cell) => cell.occupied)
    );

    // Get furthest left and right blocks
    const left = Math.min(...blocks.map((block) => block.x + x));
    const right = Math.max(...blocks.map((block) => block.x + x));
    // Get furthest top and bottom blocks
    const top = Math.min(...blocks.map((block) => block.y + y));
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

  function fastDrop() {
    while (!checkCollision(tetromino, position, { dy: 1, dx: 0 })) {
      positionState.update((position) => ({
        ...position,
        y: position.y + 1,
      }));
      score += 1;
    }

    updateBlock();
  }

  function handleKeydown(event) {
    if (event.key === "ArrowUp") {
      fastDrop();
    }
    if (event.key === "ArrowLeft") {
      const collides = checkCollision(tetromino, position, { dx: -1, dy: 0 });
      !collides &&
        positionState.update((position) => ({
          ...position,
          x: position.x - 1,
        }));
    } else if (event.key === "ArrowRight") {
      const collides = checkCollision(tetromino, position, { dx: 1, dy: 0 });
      !collides &&
        positionState.update((position) => ({
          ...position,
          x: position.x + 1,
        }));
    } else if (event.key === "ArrowDown") {
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

  function handleRotate({ rx, ry }) {
    // Unsure how to handle rotation when tetromino does not rotate on a point whose center is on the grid(row, column)
    if (tetromino.key === "O") return;
    const newBlocks = tetromino.blocks.map((block, i) => {
      return {
        ...block,
        x: block.y * rx,
        y: block.x * ry,
      };
    });
    const collision = checkCollision(
      { blocks: newBlocks, color: tetromino.color },
      position,
      { dx: 0, dy: 0 }
    );
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

  function cssVariables(node, variables) {
    setCssVariables(node, variables);
    return {
      update(variables) {
        setCssVariables(node, variables);
      },
    };
  }

  function setCssVariables(node, variables) {
    for (const name in variables) {
      node.style.setProperty(`--${name}`, variables[name]);
    }
  }

  function clearLines() {
    // Get all lines where every cell is occupied
    const fullRows = cells.reduce((rows, row, i) => {
      if (row.every((cell) => cell.occupied)) {
        rows.push(i);
      }
      return rows;
    }, []);
    if (fullRows.length > 0) {
      cells = cells.map((row, i) => {
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
      //   look for every row above (y < i) and move down
      fullRows.forEach((fullRow) => {
        const newCells = [
          ...cells
            .filter((_, i) => i <= fullRow)
            .map((aboveRow, j) =>
              aboveRow.map((cell) => ({
                ...cell,
                occupied:
                  cell.y > 0 ? cells[cell.y - 1][cell.x].occupied : false,
                color: cell.y > 0 ? cells[cell.y - 1][cell.x].color : "",
              }))
            ),
          ...cells.filter((_, i) => i > fullRow),
        ];
        cells = newCells;
      });
      lines += fullRows.length;
      //   increment score by number of lines cleared
      score += points(level, fullRows.length);
    }
  }

  function lockPlacement() {
    const { blocks } = tetromino;
    const { x, y } = position;

    if (y === 0) {
      game = {
        ...game,
        over: true,
        started: false,
      };

      tetrominoState.set({
        current: null,
        next: $tetrominoState.next,
      });
      return;
    } else {
      blocks.forEach((block) => {
        cells[block.y + y][block.x + x].occupied = true;
        cells[block.y + y][block.x + x].color = tetromino.color;
      });

      tetrominoState.set({
        current: null,
        next: $tetrominoState.next,
      });
    }
  }
  function cleanup() {
    lines = START_LINES;
    score = START_SCORE;
    level = START_LEVEL;
  }

  function updateBlock() {
    const collides = checkCollision(tetromino, position, { dy: 1, dx: 0 });
    !collides
      ? positionState.update((position) => ({
          ...position,
          y: position.y + 1,
        }))
      : lockPlacement();
  }

  function gameTime() {
    if (game.started && !game.paused) {
      const s = currentSpeed * 10;
      setTimeout(() => {
        requestAnimationFrame(updateBlock);
        requestAnimationFrame(clearLines);
        requestAnimationFrame(gameTime);
      }, s);
    }
    return {
      destroy() {
        clearTimeout();
      },
    };
  }

  function move(event) {
    requestAnimationFrame(() => handleKeydown(event));
  }

  function pause() {
    game = {
      ...game,
      paused: !game.paused,
    };
    !game.paused && gameTime();
  }

  function start(event) {
    cells = Array(height)
      .fill()
      .map((_, i) =>
        Array(width)
          .fill()
          .map((_, j) => ({
            x: j,
            y: i,
            occupied: false,
          }))
      );
    game = {
      ...game,
      started: true,
      over: false,
    };
    cleanup();
  }

  tetrominoState.subscribe((state) => {
    console.log(state);
    let { current, next } = state;

    tetromino = current;
  });

  positionState.subscribe((newPosition) => {
    position = newPosition;
  });

  $: {
    occupiedCells = cells.flatMap((row) => row.filter((cell) => cell.occupied));
    level = levels(level, lines);
    currentSpeed = speed(level);
  }
</script>

<svelte:window on:keydown={move} />

<div class="game-container">
  {#if game.started}
    <div class="stats-container">
      <div class="lines">{lines}</div>
      <div class="level">{level}</div>
      <div class="score">{score}</div>
      <button on:click={pause}>{game.paused ? "Resume" : "Pause"}</button>
    </div>
    <div class="board-container">
      <div
        class="board"
        use:gameTime
        use:cssVariables={{ width, height, size }}
      >
        <Tetromino />
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
      <Preview />
    </div>
  {:else if game.over}
    <div class="game-over">
      <h1>Game Over</h1>
      <button on:click={start}>Restart</button>
    </div>
  {:else}
    <div class="game-start">
      <h1>Tetris</h1>
      <button on:click={start}>Start</button>
    </div>
  {/if}
</div>

<style>
  .board-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100vw;
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
    border: 1px solid black;
    position: relative;
    grid-template-columns: repeat(calc(var(--width)), calc(var(--size) * 1px));
    grid-template-rows: repeat(calc(var(--height)), calc(var(--size) * 1px));
  }

  :global(.cell) {
    grid-column-start: var(--x);
    grid-row-start: var(--y);
    background-color: var(--color);
    opacity: 0.8;
    outline: 0.5px solid black;
  }

  :global(*, :root) {
    box-sizing: border-box;
    margin: 0;
  }
</style>
