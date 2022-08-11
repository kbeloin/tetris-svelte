<!--  -->
<script>
  import { tetrominoState, positionState } from "../stores";

  let tetromino;
  let position;
  let bag;

  const tetrominos = {
    // T: {
    //   key: "T",
    //   color: "purple",

    //   blocks: [
    //     { x: -1, y: 0 },
    //     { x: 0, y: 0 },
    //     { x: 1, y: 0 },
    //     { x: 0, y: 1 },
    //   ],
    // },
    // L: {
    //   key: "L",
    //   color: "red",
    //   blocks: [
    //     { x: -1, y: 0 },
    //     { x: 0, y: 0 },
    //     { x: 1, y: 0 },
    //     { x: 1, y: -1 },
    //   ],
    // },
    // J: {
    //   key: "J",
    //   color: "blue",
    //   blocks: [
    //     { x: -1, y: -1 },
    //     { x: -1, y: 0 },
    //     { x: 0, y: 0 },
    //     { x: 1, y: 0 },
    //   ],
    // },
    // // TODO: Fix O rotation
    // O: {
    //   key: "O",
    //   color: "yellow",
    //   blocks: [
    //     { x: 0, y: -1 },
    //     { x: 0, y: 0 },
    //     { x: 1, y: -1 },
    //     { x: 1, y: 0 },
    //   ],
    // },
    I: {
      key: "I",
      color: "lightblue",
      blocks: [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
    },
    // S: {
    //   key: "S",
    //   color: "green",
    //   blocks: [
    //     { x: -1, y: 0 },
    //     { x: 0, y: 0 },
    //     { x: 0, y: -1 },
    //     { x: 1, y: -1 },
    //   ],
    // },
    // Z: {
    //   key: "Z",
    //   color: "pink",
    //   blocks: [
    //     { x: -1, y: -1 },
    //     { x: 0, y: -1 },
    //     { x: 0, y: 0 },
    //     { x: 1, y: 0 },
    //   ],
    // },
  };

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
      --y: {position.y + block.y + 1};
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
