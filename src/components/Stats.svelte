<script>
  import { gameState } from "../stores";

  let game;

  gameState.subscribe((currentGame) => {
    game = { ...currentGame };
  });
</script>

<div class="stats-container">
  <div>
    <h4 class="level">Level: {$gameState.level}</h4>
    <h4 class="lines">Lines: {game.lines}</h4>
  </div>
</div>

<style>
  .stats-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .stats-container > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
  }
</style>
