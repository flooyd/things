<script>
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { typewriter } from "../util.js";

  let timer = null;
  let mounted = false;
  let tag = "<div>";
  let counter = 0;
  let out = false;
  let tags = ["nav", "button", "input", "select", "etc..."];

  if (tag) {
    tag;
  }

  onMount(() => {
    mounted = true;
    timer = setInterval(() => {
      if (counter === tags.length - 1) {
        tag = "<" + tags[counter] + ">";
        clearInterval(timer);
        setTimeout(() => {
          tag = null;
        }, 500);
      } else {
        tag = "<" + tags[counter] + ">";
        counter++;
      }
    }, 250);
  });

  $: tag;
</script>

<div transition:fly={{ x: 0, y: -100 }} class="nav">
  {#if !tag}
    <div in:fade class="title">
      Thing{"<s>"}
      <span in:typewriter={{ speed: 5 }}>{"Escape for Full Screen"}</span>
    </div>
    <div class="options">
      <div>About</div>
      <div>Settings</div>
    </div>
  {:else if tag === "Thing<etc...>"}
    <div transition:typewriter class="title">{tag}</div>
  {:else if tag !== "Thing<etc...>"}
    <div class="title">Thing{tag}</div>
  {/if}
</div>

<style>
  .nav {
    padding: 10px 20px;
    padding-bottom: 0px;
    font-family: "bebas-neue", sans-serif;
    color: var(--platinum);
    background: var(--rich-black-fogra-29);
    height: 60px;
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
  }

  .title {
    font-size: 39px;
    display: flex;
    gap: 13px;
    align-items: center;
  }

  span {
    font-size: 13px;
  }

  .options {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .options div:hover {
    color: var(--shadow-blue);
    cursor: pointer;
  }
</style>
