<script>
  export let callback;
</script>

<dialog open class="dialog">
  <form method="dialog">
    <slot name="header" />
    <br />
    <slot name="message" />
    <br />
    <button tabIndex={0} on:click={callback}>
      <slot name="button" />
    </button>
  </form>
</dialog>

<style>
  .dialog {
    animation: fade-in-and-slide-down 300ms ease-in-out forwards;
    position: absolute;
    top: 40%;
    left: 30%;
  }

  @keyframes fade-in-and-slide-down {
    0% {
      opacity: 0;
      transform: translateY(-50%);
    }
    100% {
      opacity: 1;
      transform: translateY(-30%);
    }
  }
</style>
