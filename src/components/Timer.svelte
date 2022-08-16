<script>
  import { gameState } from "../stores";

  let game;
  let running = true;

  gameState.subscribe((currentGame) => {
    game = { ...currentGame };
    if (game.started) {
    }
  });

  gameState.update((game) => ({
    ...game,
    time: 0,
    tick: tick,
  }));

  function tick() {
    if (game.started && !game.over) {
      setTimeout(() => {
        gameState.update((game) => ({
          ...game,
          time: game.time + 1,
        }));
        tick();
      }, 1000);
    }
    if (game.over) {
      clearTimeout();
    }
    return {
      destroy() {
        clearTimeout();
      },
    };
  }
</script>

<div use:tick>
  <h4>
    {`${Math.floor(game.time / 60)}:${game.time % 60 < 10 ? "0" : ""}${
      game.time % 60
    }`}
  </h4>
</div>
