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
    <h4>Top:</h4>
    <div>
      <span>{currentHighScore}</span>
    </div>
  </div>
  <div class="current-score">
    <h4>Score:</h4>
    <div>
      <span>{score}</span>
    </div>
  </div>
</div>

<style>
  .score-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

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
    position: relative;
  }
  .high-score div,
  .current-score div {
    margin: 0;
    float: right;
    right: 0;
    position: relative;
  }

  span {
    position: absolute;
  }
</style>
