<script>
  import { gameState } from "../stores";
  export let START_LEVEL;

  let game;

  gameState.subscribe((currentGame) => {
    game = { ...currentGame };
  });

  gameState.update((game) => ({
    ...game,
    level: START_LEVEL,
  }));
</script>

<div>
  <label for="level">Level: {START_LEVEL}</label>
  <input type="number" name="level" bind:value={START_LEVEL} />
</div>
