<script>
  import { positionState, tetrominoState } from "../stores";
  import { startingPosition } from "../logic";

  export let checkCollision;
  let ghostBlock;

  let ghostPosition = {
    ...startingPosition,
  };

  tetrominoState.subscribe(({ current }) => {
    if (current) {
      ghostBlock = current;
    }
  });

  positionState.subscribe(({ x, y }) => {
    ghostPosition = {
      x,
      y,
    };
  });

  $: {
    while (!checkCollision(ghostBlock, ghostPosition, { dy: 1, dx: 0 })) {
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
      : 'white'};
    "
  />
{/each}

<style>
  .ghost {
    --size: 20;
    border-radius: 0;
    box-shadow: inset 1px 1px 2.5px 1px var(--border-color),
      1px 1px 2.5px 1px var(--border-color);
    z-index: 3;
  }
</style>
