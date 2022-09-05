<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  import Div from "./Div.svelte";
  export let element;
  let x,
    y,
    height,
    width,
    iX,
    iY,
    iWidth,
    styleString,
    showArrows = null;

  onMount(() => {
    element.style.width = 98;
    element.style.height = 98;
  });

  const handleClickRight = () => {
    element.style.width = width + 100;
  };

  const handleClickLeft = () => {
    element.style.width = width - 100 <= 0 ? 98 : width - 100;
  };
  const handleClickUp = () => {
    element.style.height = height - 100 <= 0 ? 98 : height - 100;
  };
  const handleClickDown = () => {
    element.style.height = height + 100;
  };

  $: console.log(height, width);
  $: styleString = `width: ${element.style.width}px; height: ${element.style.height}px;`;
  $: console.log(styleString);
</script>

{#if styleString}
  <div
    class="element"
    bind:offsetHeight={y}
    bind:offsetWidth={x}
    bind:clientHeight={height}
    bind:clientWidth={width}
    style={styleString}
    on:mouseenter={() => {
      showArrows = true;
    }}
    on:mouseleave={() => {
      showArrows = false;
    }}
  >
    {#if element.type === "div"}
      <Div style={element.style} />
    {/if}
    {#if showArrows}
      <div
        class="i-container"
        style="top: calc(-{height / 2}px + -18px); left: -15px;"
        transition:fade={{ duration: 100 }}
        on:click={handleClickLeft}
      >
        <i class="fas fa-2xl fa-angle-left" />
      </div>

      <div
        class="i-container"
        style="top: calc(-{height / 2}px + -18px); left: calc({width}px
      - 27px);"
        transition:fade={{ duration: 100 }}
        on:click={handleClickRight}
      >
        <i class="fas fa-2xl fa-angle-right" />
      </div>

      <div
        class="i-container"
        style="top: calc(-{element.style.height}px - 24px); left: calc({width /
          2}px - 60px);"
        transition:fade={{ duration: 100 }}
        on:click={handleClickUp}
      >
        <i class="fas fa-2xl fa-angle-up" />
      </div>

      <div
        class="i-container"
        style="top: calc(-9px); left: calc({width / 2}px - 84px);"
        transition:fade={{ duration: 100 }}
        on:click={handleClickDown}
      >
        <i class="fas fa-2xl fa-angle-down" />
      </div>
    {/if}
  </div>
{/if}

<style>
  .element {
    position: relative;
    margin-left: 100px;
    margin-top: 100px;
  }
  .i-container {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 32px;
  }
</style>
