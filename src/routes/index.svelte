<script>
  import Tetromino from "../components/Tetromino.svelte";
  import Preview from "../components/Preview.svelte";
  import Scores from "../components/Scores.svelte";
  import Header from "../components/Header.svelte";

  import { tetrominoState, positionState } from "../stores";
  import { levels, speed, points, fx, music, mute } from "../logic";
  import { cssVariables } from "../utility";

  let START_LEVEL = 0;
  let START_LINES = 0;
  let START_SCORE = 0;

  let track;
  let muted = true;

  let game = {
    started: false,
    paused: false,
    over: false,
    currentSpeed: speed(START_LEVEL),
    level: START_LEVEL,
    lines: START_LINES,
  };

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

  function playAudio(callback, audio) {
    // controls audio playback
    if (!muted) {
      return callback(audio);
    }
  }

  // uses tetromino, position, {dx, dy}
  function checkCollision(tetromino, p, { dx, dy }) {
    const position = $positionState;
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
    game = {
      ...game,
      score: game.score + score,
    };
    lockPlacement();
  }
  // uses pause, fastDrop, updateBlock, check collision, playAudio, positionState
  function handleKeydown(event) {
    if (event.key === " ") {
      pause();
    } else if (event.key === "ArrowUp") {
      fastDrop();
    }
    if (event.key === "ArrowLeft") {
      playAudio(fx, "move");
      const collides = checkCollision(tetromino, position, { dx: -1, dy: 0 });
      !collides &&
        positionState.update((position) => ({
          ...position,
          x: position.x - 1,
        }));
    } else if (event.key === "ArrowRight") {
      playAudio(fx, "move");
      const collides = checkCollision(tetromino, position, { dx: 1, dy: 0 });
      !collides &&
        positionState.update((position) => ({
          ...position,
          x: position.x + 1,
        }));
    } else if (event.key === "ArrowDown") {
      playAudio(fx, "move");
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
  // uses tetromino, tetromino state, check collision
  function handleRotate({ rx, ry }) {
    playAudio(fx, "rotate");
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
      game = {
        ...game,
        score: game.score + points(game.level, fullRows.length),
        lines: game.lines + fullRows.length,
      };

      lines += fullRows.length;
      //   increment score by number of lines cleared
    }
  }
  // Lock placement tetrominoState, positionState, game, cells
  function lockPlacement() {
    const { blocks } = $tetrominoState.current;
    const { x, y } = $positionState;

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
      playAudio(fx, "collision");
    }
  }
  // uses track, lines, score, level
  function cleanup() {
    if (track) {
      track.pause();
      track = null;
    }

    game = {
      ...game,
      lines: START_LINES,
      score: START_SCORE,
      level: START_LEVEL,
      currentSpeed: speed(START_LEVEL),
    };
  }

  // uses updateBlock, checkCollision, lockPlacement
  function updateBlock() {
    // check if tetromino collides, update positionState if not. If it does, lock placement.
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
      if (track && track.paused) {
        track.play();
      }
      setTimeout(() => {
        requestAnimationFrame(updateBlock);
        requestAnimationFrame(clearLines);
        requestAnimationFrame(gameTime);
      }, game.currentSpeed * 10);
    }
    return {
      destroy() {
        clearTimeout();
      },
    };
  }

  // uses game, track
  function handleMute() {
    mute();
    muted = !muted;
    if (muted) {
      track.pause();
      track = null;
    } else {
      track = playAudio(music, "track1");
      !game.paused && track.play();
    }
  }
  // uses game, track
  function pause() {
    game = {
      ...game,
      paused: !game.paused,
    };
    if (track) {
      track.pause();
    }
    !game.paused && gameTime();
  }
  // uses cells; game; cleanup
  function start() {
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
    track = playAudio(music, "track1");
    track && track.play();
  }

  tetrominoState.subscribe((state) => {
    let { current } = state;
    tetromino = current;
  });

  positionState.subscribe((newPosition) => {
    position = newPosition;
  });

  $: {
    occupiedCells = cells.flatMap((row) => row.filter((cell) => cell.occupied));
    game = {
      ...game,
      level: levels(game.level, game.lines),
      currentSpeed: speed(game.level),
    };
  }
</script>

<svelte:window on:keydown={(event) => handleKeydown(event)} />

<div class="game-container">
  <Header {game} />
  {#if game.started}
    <div class="stats-container">
      <div class="lines">Lines: {game.lines}</div>
      <div class="level">Level: {game.level}</div>
      <Scores score={game.score} />

      <button on:click={pause}>{game.paused ? "Resume" : "Pause"}</button>
      <button on:click={handleMute}>{muted ? "Unmute" : "Mute"}</button>
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

  :global(*, :root, ::after, ::before) {
    box-sizing: border-box;
    margin: 0;
  }

  :global(button) {
    background-color: #fff;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    min-width: 150px;
    border: 1px solid #000;
  }

  :global(button:hover) {
    background-color: #f5f5f5;
  }

  :global(label) {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  :global(input) {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    min-width: 200px;
    width: 200px;
  }
</style>
