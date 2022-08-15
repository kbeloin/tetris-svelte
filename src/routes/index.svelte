<script>
  import Board from "../components/Board.svelte";
  import Header from "../components/Header.svelte";
  import Stats from "../components/Stats.svelte";

  import { cellsState, positionState, gameState } from "../stores";
  import { speed, music, mute, newBoard, startingPosition } from "../logic";

  let START_LEVEL = 0;
  let START_LINES = 0;
  let START_SCORE = 0;

  let muted = true;

  let game = {
    started: false,
    paused: false,
    over: false,
    currentSpeed: speed(START_LEVEL),
    level: START_LEVEL,
    lines: START_LINES,
    pause: pause,
    start: start,
    mute: handleMute,
    play: playAudio,
    muted: muted,
  };

  function playAudio(callback, audio) {
    // controls audio playback
    if (!game.muted) {
      return callback(audio);
    }
  }

  // uses track, lines, score, level
  function cleanup() {
    gameState.update((game) => ({
      ...game,
      lines: START_LINES,
      score: START_SCORE,
      level: START_LEVEL,
      track: null,
    }));

    positionState.set({ ...startingPosition });
  }

  // uses game, track
  function handleMute() {
    mute();
    gameState.update((game) => ({ ...game, muted: !game.muted }));
    if (game.muted && $gameState.track) {
      $gameState.track.pause();
      gameState.update((game) => ({ ...game, track: null }));
    } else {
      gameState.update((game) => ({
        ...game,
        track: playAudio(music, "track1"),
      }));
      $gameState.track && $gameState.track.play();
    }
  }

  // uses game, track
  function pause() {
    gameState.update((game) => ({
      ...game,
      paused: !game.paused,
    }));

    $gameState.track &&
      $gameState.paused &&
      !$gameState.muted &&
      $gameState.track.pause();
    $gameState.track &&
      !$gameState.paused &&
      !$gameState.muted &&
      $gameState.track.play();
    !game.paused && game.gameTime();
  }
  // uses cells; game; cleanup
  function start() {
    cleanup();
    cellsState.update((cells) => [...newBoard()]);

    gameState.update((game) => ({
      ...game,
      started: true,
      over: false,
      track: playAudio(music, "track1"),
    }));

    $gameState.track && $gameState.track.play();
  }

  gameState.set(game);

  gameState.subscribe((state) => {
    game = { ...state };
  });
</script>

<div class="game-container">
  <Header {game} />
  {#if game.started}
    <Stats />
    <Board />
  {:else if game.over}
    <div class="game-over">
      <button on:click={start}>Restart</button>
    </div>
  {:else}
    <div class="game-start">
      <button on:click={start}>Start</button>
    </div>
  {/if}
</div>

<style>
  :global(.cell) {
    grid-column-start: var(--x);
    grid-row-start: var(--y);
    background-color: var(--color);
    border: 0.5px solid black;
  }

  :global(*, :root, ::after, ::before) {
    box-sizing: border-box;
    margin: 0;
  }

  :global(button) {
    background-color: #fff;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    min-width: 150px;
    border: 1px solid #000;
  }

  :global(button:hover) {
    background-color: #f5f5f5;
  }

  :global(label) {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  :global(input) {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    min-width: 200px;
    width: 200px;
  }

  .game-container {
    max-width: 600px;
  }

  :global(body > div) {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "Work Sans", sans-serif;
  }
</style>
