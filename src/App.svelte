<script lang="ts">
  import Intro from "./components/Intro.svelte";
  import Nav from "./components/Nav.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import WorkBench from "./components/WorkBench.svelte";
</script>

<Nav />
<main>
  <Intro />
  <Toolbar />
  <WorkBench />
</main>

<style>
  main {
    font-family: "bebas-neue", sans-serif;
    color: var(--cultured);
    background: var(--rich-black-fogra-29);
    height: calc(100vh - 70px);
  }
</style>
