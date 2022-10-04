<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { global, updateGlobal } from "../../stores/globals";
  let ready = false;
  let globalArray = [];

  onMount(() => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    for (let i = 0; i < 26; i++) {
      const randomNumber = Math.floor(Math.random() * 100);
      $global[alphabet[i]] = randomNumber;
    }
    $global.domTest = { name: "blah", age: 23 };
    $global.current;
    $global.alpha = "";
    ready = true;
    window.updateGlobal = updateGlobal;
    window.stores = $global;
  });

  const handleClick = (key) => {
    $global.current = key;
    //$global[key] = Math.floor(Math.random() * 100);
  };

  $: globalArray = Object.keys($global);

  $: if ($global.current === "alpha") {
    try {
      functionMaker($global.alpha)();
    } catch (e) {
      console.log(e);
    }
  }

  const functionMaker = (body) => {
    return new Function(body);
  };

  window.functionMaker = functionMaker;
</script>

{#if ready}
  <div transition:fly={{ x: 500, y: 0, duration: 100 }} class="storesTooltip">
    <div class="header">Stores</div>
    <div class="store">
      <div class="storeHeader">
        <div class="storeName">global</div>
        <div class="storeType">object</div>
      </div>
      <div class="storeContents">
        {#each globalArray as item}
          <div
            class="item"
            style={item === "current"
              ? $global.current
                ? "background: var(--oxford-blue); color: white;"
                : ""
              : null}
            on:click={() => handleClick(item)}
          >
            <div class="key"><span>key:</span>{item}</div>
            <div class="value"><span>value:</span>{$global[item]}</div>
          </div>
        {/each}
      </div>
    </div>
    <textarea
      on:mouseenter={() => ($global.current = null)}
      rows="10"
      bind:value={$global.alpha}
    />
  </div>
{/if}

<style>
  .storesTooltip {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: fit-content;
    min-width: 400px;
    height: calc(100vh - 30px);
    background: white;
    font-size: 13px;
    padding: 16px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    overflow-x: auto;
    pointer-events: all;
  }

  .header {
    font-size: 20px;
    font-weight: bold;
    color: var(--oxford-blue);
  }

  .store {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .storeHeader {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .storeName {
    font-size: 16px;
    font-weight: 600;
    color: var(--oxford-blue);
  }

  .storeType {
    font-size: 13px;
    font-weight: 600;
    color: var(--oxford-blue);
  }

  .storeContents {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 3px 13px;
    border: 1px solid var(--oxford-blue);
    width: fit-content;
    min-width: 250px;
    justify-content: center;
    max-width: 375px;
  }

  .item:hover {
    color: white;
    background: var(--oxford-blue);
    cursor: pointer;
  }

  .key {
    font-size: 13px;
    font-weight: 600;
    min-width: 100px;
  }

  .value {
    font-size: 13px;
    font-weight: 600;
    min-width: 100px;
    word-wrap: break-word;
  }

  .item span {
    font-weight: 400;
    margin-right: 8px;
  }

  textarea {
    min-height: 400px;
  }
</style>
