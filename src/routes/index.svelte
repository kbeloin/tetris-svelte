<script>
  import Board from "../components/Board.svelte";
  import Header from "../components/Header.svelte";
  import Stats from "../components/Stats.svelte";
  import Scores from "../components/Scores.svelte";
  import Preview from "../components/Preview.svelte";
  import Controls from "../components/Controls.svelte";
  import Dialog from "../components/Dialog.svelte";
  import Menu from "../components/Menu.svelte";
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
    lines: START_LINES,
    level: START_LEVEL,
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

  function restart() {
    cleanup();
    cellsState.update((cells) => [...newBoard()]);
    gameState.update((game) => ({
      ...game,
      started: true,
      over: false,
      track: playAudio(music, "track1"),
      time: 0,
    }));
    $gameState.track && $gameState.track.play();
    $gameState.gameTime && $gameState.gameTime();
    $gameState.tick && $gameState.tick();
  }

  gameState.set(game);

  gameState.subscribe((state) => {
    game = { ...state };
  });
</script>

<div class="game-container">
  <Header {game} />
  {#if game.started}
    <Controls />
    <Board>
      <Scores slot="score" score={game.score} />
      <Stats slot="stats" />
      <Preview slot="preview" />
    </Board>
    {#if game.over}
      <Dialog callback={restart}>
        <h3 slot="header">Game Over</h3>
        <p slot="message">
          You scored {game.score} points.
          <br />
        </p>
        <div slot="button">Try Again</div>
      </Dialog>
    {/if}
    {#if game.paused && !game.over}
      <Dialog callback={game.pause}>
        <h3 slot="header">Paused</h3>
        <p slot="message">
          Game paused.
          <br />
        </p>
        <div slot="button">Resume</div>
      </Dialog>
    {/if}
  {:else}
    <div class="game-start">
      <!-- TODO: Link up start levels -->
      <!-- <Menu bind:START_LEVEL on:change={console.log(START_LEVEL)} /> -->
      <button on:click={start}>Start</button>
    </div>
  {/if}
</div>

<style>
  :global(.cell) {
    grid-column-start: var(--x);
    grid-row-start: var(--y);
    background-color: var(--color);
    box-shadow: inset 1px 1px 1px 1px black, 1px 1px 1px 1px black;
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
    min-width: fit-content;
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
    display: flex;
    flex-direction: column;
    max-width: min(600px, 100vw);
    width: 100%;
    padding: 1rem;
    margin: 0 auto;
    position: relative;
  }

  :global(body > div) {
    font-family: "Work Sans", sans-serif;
  }
</style>
