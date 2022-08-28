<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  let timer = null;
  let mounted = false;
  let tag = "<div>";
  let counter = 0;
  let out = false;
  let tags = ["nav", "button", "input", "select", "etc..."];

  if (tag) {
    console.log(tag);
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

  $: console.log(tag);

  //https://svelte.dev/tutorial/custom-js-transitions
  function typewriter(node, { speed = 1 }) {
    const valid =
      node.childNodes.length === 1 &&
      node.childNodes[0].nodeType === Node.TEXT_NODE;

    if (!valid) {
      throw new Error(
        `This transition only works on elements with a single text node child`
      );
    }

    const text = node.textContent;
    const duration = text.length / (speed * 0.01);

    return {
      duration,
      tick: (t) => {
        const i = Math.trunc(text.length * t);
        node.textContent = text.slice(0, i);
      },
    };
  }
</script>

<div class="nav">
  {#if !tag}
    <div in:fly={{ duration: 500, x: -500 }} class="title">
      Thing{"<s>"}
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
  }

  .title {
    font-size: 39px;
  }
</style>
