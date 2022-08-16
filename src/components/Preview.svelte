<script>
  import { tetrominoState } from "../stores";

  let preview;
  let blockWidth;

  tetrominoState.subscribe((state) => {
    let { next } = state;
    preview = next;
    let min = Math.min(...preview.blocks.map((block) => block.x));
    let max = Math.max(...preview.blocks.map((block) => block.x));
    blockWidth = max - min + 1;
  });
</script>

<div class="preview-container" style="--size: {20};">
  <div class="preview" style="--grid-width: {blockWidth}">
    {#each preview.blocks as block}
      <div
        class="cell"
        style="
        --x: {preview.key === 'O' ? 1 + block.x : 2 + block.x};
        --y: {block.y + 2};
        --color: {preview.color};
        --key: {preview.key};
      "
      />
    {/each}
  </div>
</div>

<style>
  .preview-container {
    display: grid;
    place-content: center;
    place-items: center;
    width: calc(5 * var(--size) * 1px);
    height: calc(5 * var(--size) * 1px);
  }
  .preview {
    --board-width: calc(var(--grid-width) * var(--size) * 1px);
    --board-height: var(--board-width);
    width: var(--board-width);
    height: var(--board-height);
    min-width: var(--board-width);
    min-height: var(--board-height);
    margin: auto;
    display: grid;
    position: relative;
    grid-template-columns: repeat(4, calc(var(--size) * 1px));
    grid-template-rows: repeat(3, calc(var(--size) * 1px));
  }
</style>
