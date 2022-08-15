<script>
  import { highScoreState } from "../stores";

  export let score;
  let currentHighScore;

  highScoreState.subscribe((highScore) => {
    currentHighScore = highScore;
  });

  $: {
    if ($highScoreState > score) {
      currentHighScore = $highScoreState;
    } else {
      highScoreState.update((highScore) => score);
    }
  }
</script>

<div class="score-container">
  <div class="high-score">
    <h4>High Score</h4>
    <p>
      <strong>{currentHighScore}</strong>
    </p>
  </div>
  <div class="current-score">
    <h4>Score</h4>
    <p>
      <strong>{score}</strong>
    </p>
  </div>
</div>

<style>
  .score-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
    width: 100%;
  }
  .high-score,
  .current-score {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .high-score h4,
  .current-score h4 {
    margin: 0;
  }
  .high-score p,
  .current-score p {
    margin: 0;
  }
</style>
