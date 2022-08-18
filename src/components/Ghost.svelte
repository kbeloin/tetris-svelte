<script>
  import { positionState, tetrominoState } from "../stores";
  import { startingPosition } from "../logic";

  export let checkCollision;
  export let tetromino;

  let ghostPosition = {
    ...startingPosition,
  };

  let ghostBlock = { ...tetromino };

  positionState.subscribe(({ x }) => {
    ghostPosition = {
      ...ghostPosition,
      x,
    };
  });

  $: {
    if (!checkCollision(ghostBlock, ghostPosition, { dy: 1, dx: 0 })) {
      ghostPosition = {
        ...ghostPosition,
        y: ghostPosition.y + 1,
      };
    }
  }
</script>

{#each ghostBlock.blocks as block}
  <div
    class="cell ghost"
    style="
      --x: {ghostPosition.x + block.x + 1};
      --y: {ghostPosition.y + block.y + 1 <= 0
      ? -1
      : ghostPosition.y + block.y + 1};
      --color: none;
      --border-color: {ghostPosition.y + block.y + 1 <= 0
      ? 'transparent'
      : 'black'};
    "
  />
{/each}
