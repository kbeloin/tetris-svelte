<div class="controls-info">
  <div>
    <div class="small">A</div>
    <span style="font-size: 26px;">⟲</span>
  </div>
  <div>
    <div class="small">D</div>
    <span style="font-size: 26px;">⟳</span>
  </div>
  <div>
    <div class="small">↓</div>
    <span>Drop (Soft)</span>
  </div>
  <div>
    <div class="small">↑</div>
    <span>Drop (Hard)</span>
  </div>
  <div>
    <div class="small">←</div>
    <div class="small">→</div>
    <span>Move</span>
  </div>
  <div>
    <div class="long">SPACE</div>
    <span>Pause</span>
  </div>
</div>

<style>
  .controls-info {
    display: none;
  }

  .small {
    font-size: 12px;
    width: 30px;
    height: 30px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    display: inline-grid;
    place-content: center;
    border: 2px solid #000;
  }

  .long {
    font-size: 12px;
    width: 66px;
    height: 30px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    display: inline-grid;
    place-content: center;
    border: 2px solid #000;
  }

  @media (min-width: 768px) {
    .controls-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 1rem;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }
  }
</style>
