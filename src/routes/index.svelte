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

  function handleKeydown(event) {
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
      tetrominoState.update((tetromino) => ({
        ...tetromino,
        blocks: newBlocks,
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
    const newCells = [];
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
    }
  }

  function lockPlacement() {
    const { blocks } = tetromino;
    const { x, y } = position;
    blocks.forEach((block) => {
      cells[block.y + y][block.x + x].occupied = true;
      cells[block.y + y][block.x + x].color = tetromino.color;
    });

    tetrominoState.set(null);
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

  function gameTime(node) {
    setInterval(() => {
      time++;
      requestAnimationFrame(updateBlock);
      requestAnimationFrame(clearLines);
    }, 500);
  }

  function move(event) {
    requestAnimationFrame(() => handleKeydown(event));
  }

  tetrominoState.subscribe((newTetromino) => {
    tetromino = newTetromino;
  });

  positionState.subscribe((newPosition) => {
    position = newPosition;
  });

  $: {
    occupiedCells = cells.flatMap((row) => row.filter((cell) => cell.occupied));
  }
</script>

<svelte:window on:keydown={move} />

<div class="board" use:gameTime use:cssVariables={{ width, height, size }}>
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

<style>
  .board {
    --board-width: calc(var(--width) * var(--size) * 1px);
    --board-height: calc(var(--height) * var(--size) * 1px);
    width: var(--board-width);
    height: var(--board-height);
    min-width: var(--board-width);
    min-height: var(--board-height);
    margin: auto;
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
</style>
