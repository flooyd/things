<script lang="ts">
  import Intro from "./components/Intro.svelte";
  import Nav from "./components/Nav.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import WorkBench from "./components/WorkBench.svelte";
  import { width, height, firebase, analytics } from "./stores/globals";

  $: console.log("global width, height", $width, $height);

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  let fbAnalytics = getAnalytics(app);

  $firebase = app;
  $analytics = fbAnalytics;
</script>

<Nav />
<main bind:clientHeight={$height} bind:clientWidth={$width}>
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
