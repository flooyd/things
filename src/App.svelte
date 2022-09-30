<script lang="ts">
  import Nav from "./components/Nav.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import WorkBench from "./components/WorkBench.svelte";
  import {
    client,
    db,
    storesTooltipOpen,
    fullscreen,
    hideUI,
    mousePosition,
    width,
    functionsTooltipOpen,
  } from "./stores/globals";
  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
  import { onMount } from "svelte";
  import StoresTooltip from "./components/tooltips/StoresTooltip.svelte";
  import FunctionsTooltip from "./components/tooltips/FunctionsTooltip.svelte";
  import { initFunctions } from "./util";

  const firebaseConfig = {
    apiKey: "AIzaSyAgh1vJII1SXHxdKuf33mnN1IvURsrQJXI",
    authDomain: "things-site.firebaseapp.com",
    projectId: "things-site",
    storageBucket: "things-site.appspot.com",
    messagingSenderId: "303439958131",
    appId: "1:303439958131:web:0dd53ce4b0aac7d314da06",
    measurementId: "G-ENLDR35L4P",
  };

  let ready = false;

  onMount(async () => {
    $client = await initializeApp(firebaseConfig);
    $db = getFirestore($client);

    onkeydown = (e) => {
      console.log(e.key);

      if (e.key === "F1") {
        e.preventDefault();
        console.log("f1");
        return ($hideUI = !$hideUI);
      }

      if (e.key === "Escape") {
        console.log("escape");
        return ($fullscreen = !$fullscreen);
      }
    };

    initFunctions();

    ready = true;
  });

  $: console.log($mousePosition);
</script>

{#if ready}
  {#if !$fullscreen}
    <Nav />
  {/if}
  <main
    on:mousemove={(e) => {
      $mousePosition = { x: e.clientX, y: e.clientY };
    }}
    bind:clientWidth={$width}
  >
    {#if !$fullscreen}
      <Toolbar />
    {/if}
    <WorkBench />
  </main>
{/if}
{#if ready && $storesTooltipOpen}
  <StoresTooltip />
{/if}
{#if ready && $functionsTooltipOpen}
  <FunctionsTooltip />
{/if}

<style>
  main {
    font-family: "bebas-neue", sans-serif;
    color: var(--cultured);
    background: var(--rich-black-fogra-29);
    height: calc(100vh - 70px);
  }
</style>
