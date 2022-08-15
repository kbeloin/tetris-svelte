<script>
  import { gameState } from "../stores";
  import Controls from "../components/Controls.svelte";
  import Scores from "../components/Scores.svelte";

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
  <Scores score={game.score} />

  <Controls />
</div>

<style>
  .stats-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .stats-container > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
  }
</style>
