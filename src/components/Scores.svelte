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
    <h3>High Score</h3>
    <p>
      <strong>{currentHighScore}</strong>
    </p>
  </div>
  <div class="current-score">
    <h3>Score</h3>
    <p>
      <strong>{score}</strong>
    </p>
  </div>
</div>
