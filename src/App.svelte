<script lang="ts">
  import Nav from "./components/Nav.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import WorkBench from "./components/WorkBench.svelte";
  import {
    width,
    height,
    client,
    db,
    altDown,
    elementTooltipId,
    mouseInTooltip,
    storesTooltipOpen,
  } from "./stores/globals";
  import { initializeApp } from "firebase/app";
  import { collection, getDocs, getFirestore } from "firebase/firestore";
  import { onMount } from "svelte";
  import { elements } from "./stores/elements";
  import StoresTooltip from "./components/tooltips/StoresTooltip.svelte";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
      if (e.key === "f") {
        $altDown = true;
      }
    };
    onkeyup = (e) => {
      if (e.key === "f") {
        $altDown = false;
      }
    };
    ready = true;
  });
</script>

<Nav />
{#if ready}
  <main>
    <Toolbar />
    <WorkBench />
  </main>
{/if}
{#if ready && $storesTooltipOpen}
  <StoresTooltip />
{/if}

<style>
  main {
    font-family: "bebas-neue", sans-serif;
    color: var(--cultured);
    background: var(--rich-black-fogra-29);
    height: calc(100vh - 70px);
  }
</style>
