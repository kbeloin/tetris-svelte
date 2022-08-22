<script>
  function dispatchWindowKeyEvent(key) {
    const eventDown = new KeyboardEvent("keydown", {
      key: key,
      bubbles: false,
      cancelable: false,
    });

    window.dispatchEvent(eventDown);
  }
  function handleDirectionalButtonPress(e) {
    switch (e.target.name) {
      case "up":
        dispatchWindowKeyEvent("ArrowUp");
        break;
      case "down":
        dispatchWindowKeyEvent("ArrowDown");
        break;
      case "left":
        dispatchWindowKeyEvent("ArrowLeft");
        break;
      case "right":
        dispatchWindowKeyEvent("ArrowRight");
        break;
      case "rotate-left":
        dispatchWindowKeyEvent("a");
        break;
      case "rotate-right":
        dispatchWindowKeyEvent("d");
        break;
      default:
        break;
    }
  }
</script>

<div class="mobile-controls">
  <button on:click={handleDirectionalButtonPress} name="up">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      style="
        width: 15px;
        transform: rotate(-45deg);
      "
    >
      <path
        d="M374.6 246.6C368.4 252.9 360.2 256 352 256s-16.38-3.125-22.62-9.375L224 141.3V448c0 17.69-14.33 31.1-31.1 31.1S160 465.7 160 448V141.3L54.63 246.6c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160C387.1 213.9 387.1 234.1 374.6 246.6z"
      />
    </svg>
  </button>
  <button on:click={handleDirectionalButtonPress} name="right">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      style="
        width: 15px;
        transform: rotate(45deg);
      "
    >
      <path
        d="M374.6 246.6C368.4 252.9 360.2 256 352 256s-16.38-3.125-22.62-9.375L224 141.3V448c0 17.69-14.33 31.1-31.1 31.1S160 465.7 160 448V141.3L54.63 246.6c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160C387.1 213.9 387.1 234.1 374.6 246.6z"
      />
    </svg>
  </button>

  <button on:click={handleDirectionalButtonPress} name="left">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      style="
        width: 15px;
        transform: rotate(225deg);
      "
    >
      <path
        d="M374.6 246.6C368.4 252.9 360.2 256 352 256s-16.38-3.125-22.62-9.375L224 141.3V448c0 17.69-14.33 31.1-31.1 31.1S160 465.7 160 448V141.3L54.63 246.6c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160C387.1 213.9 387.1 234.1 374.6 246.6z"
      />
    </svg>
  </button>
  <button on:click={handleDirectionalButtonPress} name="down">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      style="
        width: 15px;
        transform: rotate(135deg);
      "
    >
      <path
        d="M374.6 246.6C368.4 252.9 360.2 256 352 256s-16.38-3.125-22.62-9.375L224 141.3V448c0 17.69-14.33 31.1-31.1 31.1S160 465.7 160 448V141.3L54.63 246.6c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160C387.1 213.9 387.1 234.1 374.6 246.6z"
      />
    </svg>
  </button>
  <div />
  <button
    class="rotate"
    on:click={handleDirectionalButtonPress}
    name="rotate-left"
  >
    <span style="font-size: 26px;">⟲</span>
  </button>
  <button
    class="rotate"
    on:click={handleDirectionalButtonPress}
    name="rotate-right"
  >
    <span style="font-size: 26px;">⟳</span>
  </button>
</div>

<style>
  .mobile-controls {
    margin-top: 1em;
    border-radius: 50%;
    display: grid;
    place-content: center;
    grid-template-columns: repeat(2, 75px);
    grid-template-rows: repeat(2, 1fr);
    width: 150px;
    margin: 0 auto;
    transform: rotate(45deg) scale(0.85);
    position: relative;
    margin-top: -2.5em;
  }

  .rotate {
    position: absolute;
  }

  .mobile-controls button:not(.rotate) {
    width: 75px;
    height: 75px;
    border: none;
    place-content: center;
    display: grid;
    background-color: transparent;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    min-width: unset;
    padding: 0;
    pointer-events: all;
    border: 1px solid black;
  }

  .mobile-controls button:not(.rotate):hover {
    background-color: lightgrey;
  }

  .mobile-controls button:not(.rotate) svg {
    pointer-events: none;
  }

  .mobile-controls button:nth-child(1) {
    border-radius: 100% 0% 0% 0%;

    pointer-events: all;
  }

  .mobile-controls button:nth-child(2) {
    border-radius: 0% 100% 0% 0%;

    pointer-events: all;
  }

  .mobile-controls button:nth-child(3) {
    border-radius: 0% 0% 0 100%;

    pointer-events: all;
  }

  .mobile-controls button:nth-child(4) {
    border-radius: 0% 0% 100% 0%;

    pointer-events: all;
  }

  .mobile-controls div:nth-child(5) {
    border-radius: 50%;
    border: 1px solid black;
    background-color: white;
    position: absolute;
    top: 25%;
    left: 25%;
    width: 75px;
    height: 75px;
    pointer-events: none;
  }

  .mobile-controls button:nth-child(6) {
    border-radius: 50%;
    top: 95%;
    left: -35%;
    pointer-events: all;
  }

  .mobile-controls button:nth-child(7) {
    border-radius: 50%;
    bottom: 105%;
    right: -35%;
    pointer-events: all;
  }

  @media (min-width: 800px) {
    .mobile-controls {
      margin-top: 0;
      display: none;
    }
  }
</style>
