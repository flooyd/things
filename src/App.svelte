<script lang="ts">
  import Nav from "./components/Nav.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import WorkBench from "./components/WorkBench.svelte";
  import ElementTooltip from "./components/tooltips/ElementTooltip.svelte";
  import {
    client,
    db,
    storesTooltipOpen,
    fullscreen,
    hideUI,
    mousePosition,
    width,
    functionsTooltipOpen,
    clickedElement,
    elementTooltipId,
  } from "./stores/globals";
  import { elements } from "./stores/elements";
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

  const handleEdit = (property, value) => {
    $clickedElement[property] = value;
    $clickedElement = $clickedElement;
  };

  onMount(async () => {
    $client = await initializeApp(firebaseConfig);
    $db = getFirestore($client);

    onkeydown = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        return ($hideUI = !$hideUI);
      }

      if (e.key === "Escape") {
        return ($fullscreen = !$fullscreen);
      }
    };

    initFunctions();

    ready = true;
  });
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
<div class="tooltips">
  {#if ready && $storesTooltipOpen}
    <StoresTooltip />
  {/if}
  {#if ready && $functionsTooltipOpen}
    <FunctionsTooltip />
  {/if}
  {#if $elementTooltipId === $clickedElement?.id}
    <ElementTooltip
      element={$clickedElement}
      {handleEdit}
      on:delete={() => {
        $elements = $elements.filter((e) => e.id !== $clickedElement.id);
        $elementTooltipId = null;
      }}
    />
  {/if}
</div>

<style>
  main {
    font-family: "bebas-neue", sans-serif;
    color: var(--cultured);
    background: var(--rich-black-fogra-29);
    height: calc(100vh - 70px);
  }

  .tooltips {
    display: flex;
    width: calc(100vw - 20px);
    background: transparent;
    top: 0px;
    pointer-events: none;
    justify-content: right;
    position: fixed;
  }
</style>
