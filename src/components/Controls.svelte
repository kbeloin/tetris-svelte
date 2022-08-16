<script>
  import Timer from "./Timer.svelte";
  import { gameState } from "../stores";
  import icons from "../icons";

  let game;

  gameState.subscribe((currentGame) => {
    game = { ...currentGame };
  });
</script>

<div class="controls-container">
  <button on:click={game.pause}>
    {#if game.paused}
      {@html icons("play")}
    {:else}
      {@html icons("pause")}
    {/if}
  </button>
  <Timer />
  <button on:click={game.mute}>
    {#if game.muted}
      {@html icons("muted")}
    {:else}
      {@html icons("audio")}
    {/if}</button
  >
</div>

<style>
  .controls-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    width: 100%;
    max-width: calc(350px + 1rem);
    margin: auto;
  }

  button {
    --width: 20px;
    --height: 20px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    width: 20px;
    height: 20px;
  }
</style>
