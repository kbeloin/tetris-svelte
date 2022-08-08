<script>
  import Tetromino from "../components/Tetromino.svelte";
  import { tetrominoState, positionState } from "../stores";

  let time = 0;
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
  let tetromino;
  let position;

  function checkCollision(tetromino, position, { dx, dy }) {
    if (tetromino === null) return false;
    const { blocks } = tetromino;
    const { x, y } = position;

    const adjacentCells = cells.filter(
      (row, i) =>
        row.filter((cell, j) => cell.x === x + j && cell.y === y + i).length > 0
    );
    // Get furthest left and right blocks
    const left = Math.min(...blocks.map((block) => block.x + x));
    const right = Math.max(...blocks.map((block) => block.x + x));
    // Get furthest top and bottom blocks
    const bottom = Math.max(...blocks.map((block) => block.y + y));

    const outOfBounds =
      left + dx < 0 || right + dx > width - 1 || bottom + dy > height - 1;
    console.log(outOfBounds);

    return outOfBounds;
  }

  function handleKeydown(event) {
    if (event.key === "ArrowLeft") {
      const collides = checkCollision(tetromino, position, { dx: -1 });
      !collides &&
        positionState.update((position) => ({
          ...position,
          x: position.x - 1,
        }));
    } else if (event.key === "ArrowRight") {
      const collides = checkCollision(tetromino, position, { dx: 1 });
      !collides &&
        positionState.update((position) => ({
          ...position,
          x: position.x + 1,
        }));
    } else if (event.key === "ArrowDown") {
      const collides = checkCollision(tetromino, position, { dy: 1 });
      !collides &&
        positionState.update((position) => ({
          ...position,
          y: position.y + 1,
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

  function lockPlacement() {
    const { blocks } = tetromino;
    const { x, y } = position;
    blocks.forEach((block) => {
      cells[block.y + y][block.x + x].occupied = true;
    });
    tetrominoState.set(null);
  }

  function gameTime(node) {
    setInterval(() => {
      time++;
      const collides = checkCollision(tetromino, position, { dy: 1 });
      !collides
        ? positionState.update((position) => ({
            ...position,
            y: position.y + 1,
          }))
        : lockPlacement();
    }, 1000);
  }

  tetrominoState.subscribe((newTetromino) => {
    tetromino = newTetromino;
  });

  positionState.subscribe((newPosition) => {
    position = newPosition;
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="timer">
  <p>
    {time}
  </p>
</div>

<div class="board" use:gameTime use:cssVariables={{ width, height, size }}>
  <Tetromino />
</div>

<style>
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

  .timer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
</style>
