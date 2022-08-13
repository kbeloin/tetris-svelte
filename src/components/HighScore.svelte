<script>
  import { highScoreState } from "../stores";

  export let score;

  highScoreState.subscribe((highScore) => {
    score = highScore;
  });

  $: {
    if ($highScoreState > score) {
      score = $highScoreState;
    } else {
      highScoreState.update((highScore) => score);
    }
  }
</script>

<div>
  <h1>High Score</h1>
  <p>
    <strong>{score}</strong>
  </p>
</div>
