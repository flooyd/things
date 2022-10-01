<script>
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { typewriter } from "../util.js";
</script>

<div transition:fade={{ duration: 100 }} class="nav">
  <div class="title">
    Thing{"<s>"}
    <span>{"Escape for Full Screen"}</span>
  </div>
  <div class="options">
    <div>About</div>
    <div>Settings</div>
  </div>
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
