<!--  -->
<script>
  import { tetrominoState, positionState } from "../stores";
  import { tetrominos } from "../logic";

  let tetromino;
  let position;

  function randomTetromino() {
    const tetrominoTypes = Object.keys(tetrominos);
    const randomIndex = Math.floor(Math.random() * tetrominoTypes.length);
    const randomTetrominoType = tetrominoTypes[randomIndex];
    const randomTetromino = tetrominos[randomTetrominoType];
    return randomTetromino;
  }

  tetromino = { ...randomTetromino() };

  tetrominoState.set(tetromino);

  positionState.subscribe((newPosition) => {
    position = newPosition;
  });

  tetrominoState.subscribe((newTetromino) => {
    if (newTetromino) {
      tetromino = newTetromino;
    } else {
      positionState.set({ x: 4, y: 0 });
      tetromino = { ...randomTetromino() };
      tetrominoState.set(tetromino);
    }
  });

  $: {
  }
</script>

{#each tetromino.blocks as block}
  <div
    class="cell"
    style="
      --x: {position.x + block.x + 1};
      --y: {position.y + block.y + 1 <= 0 ? -1 : position.y + block.y + 1};
      --color: {tetromino.color};
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
