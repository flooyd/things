<script>
  import { onMount } from "svelte";

  import Div from "./Div.svelte";
  export let element;
  let x,
    y,
    height,
    width,
    iX,
    iY,
    iWidth,
    styleString = null;

  onMount(() => {
    console.log(x, y, height, width);
    element.style.width = 98;
    element.style.height = 98;
  });

  const handleClickRight = () => {
    element.style.width = width + 100;
  };

  const handleClickLeft = () => {
    element.style.width = width - 100;
  };
  const handleClickUp = () => {
    element.style.height = height - 100;
  };
  const handleClickDown = () => {
    element.style.height = height + 100;
  };

  $: console.log(iY, iX, iWidth);

  $: styleString = `width: ${element.style.width}px; height: ${element.style.height}px;`;
</script>

{#if styleString}
  <div
    class="element"
    bind:offsetHeight={y}
    bind:offsetWidth={x}
    bind:clientHeight={height}
    bind:clientWidth={width}
    style={styleString}
  >
    {#if element.type === "div"}
      <Div style={element.style} />
    {/if}
    <div
      class="i-container"
      style="top: calc(-{height / 2}px + -12px); left: -14px;"
      on:click={handleClickLeft}
    >
      <i class="fas fa-2xl fa-angle-left" />
    </div>

    <div
      class="i-container"
      style="top: calc(-{height / 2}px + -12px); left: calc({width}px - 21px);"
      on:click={handleClickRight}
    >
      <i class="fas fa-2xl fa-angle-right" />
    </div>

    <div
      class="i-container"
      style="top: calc(-{height}px - 24px); left: calc({width / 2}px - 52px);"
      on:click={handleClickUp}
    >
      <i class="fas fa-2xl fa-angle-up" />
    </div>

    <div
      class="i-container"
      style="top: calc(-10px); left: calc({width / 2}px - 80px);"
      on:click={handleClickDown}
    >
      <i class="fas fa-2xl fa-angle-down" />
    </div>
  </div>
{/if}

<style>
  .element {
    position: relative;
    margin-left: 20px;
    margin-top: 20px;
  }
  .i-container {
    position: relative;
    display: inline-block;
  }
</style>
