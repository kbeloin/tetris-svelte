<!--  -->
<script>
  import { tetrominoState, positionState } from "../stores";
  import { tetrominos } from "../logic";
  import { onDestroy } from "svelte";

  let tetromino;
  let position;
  let nextTetromino;

  function randomTetromino() {
    const tetrominoTypes = Object.keys(tetrominos);
    const randomIndex = Math.floor(Math.random() * tetrominoTypes.length);
    const randomTetrominoType = tetrominoTypes[randomIndex];
    const randomTetromino = tetrominos[randomTetrominoType];
    return randomTetromino;
  }

  tetromino = { ...randomTetromino() };
  nextTetromino = { ...randomTetromino() };

  tetrominoState.set({ current: tetromino, next: nextTetromino });

  const p = positionState.subscribe((newPosition) => {
    position = newPosition;
  });

  const t = tetrominoState.subscribe((state) => {
    let { current, next } = $tetrominoState;
    if (current) {
      tetromino = current;
    } else {
      positionState.set({ x: 4, y: 0 });
      nextTetromino = { ...randomTetromino() };
      tetrominoState.set({
        current: next,
        next: nextTetromino,
      });
    }
  });

  onDestroy(() => {
    p();
    t();
  });
</script>

{#each tetromino.blocks as block}
  <div
    class="cell"
    style="
      --x: {position.x + block.x + 1};
      --y: {position.y + block.y + 1 <= 0 ? -1 : position.y + block.y + 1};
      --color: {position.y + block.y + 1 <= 0
      ? 'transparent'
      : tetromino.color};
      --key: {tetromino.key};
    "
  />
{/each}

<style>
  .cell {
    grid-column-start: var(--x);
    grid-row-start: var(--y);
    background-color: var(--color);
  }
</style>
