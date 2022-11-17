<script>
  import { cssObject } from "../util";

  export let element;
  export let handleEdit;

  let filter = "";
  let filtered = [];
  let propsToShow = [];
  let clientHeight = null;
  let hideEmpty = true;

  const properties = [...cssObject.css, ...cssObject.experimental]
    .filter(
      (key) =>
        key !== "name" &&
        key !== "id" &&
        key !== "type" &&
        key !== "__v" &&
        key !== "_id"
    )
    .map((prop) => {
      //return prop to camelCase
      return prop.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });
    });

  const setPropsToShow = () => {
    if (filter.length > 0) {
      return (propsToShow = filtered);
    }

    if (hideEmpty) {
      return (propsToShow = properties.filter((prop) => element[prop] !== ""));
    }

    return (propsToShow = properties);
  };

  const handleFilterInput = (e) => {
    filter = e.target.value;
    filtered = filter.split(",").map((f) => f.trim().toLowerCase());
    //for each filter, check for exact match in properties and add to array
    filtered = properties.filter((prop) => {
      return filtered.some(
        (f) =>
          prop === //f to camelCase
            f.replace(/-([a-z])/g, function (g) {
              return g[1].toUpperCase();
            }) || prop.toLowerCase() === f.toLowerCase()
      );
    });

    setPropsToShow();
  };

  const refreshProps = () => {
    filter = "";
    filtered = [];
    setPropsToShow();
  };

  setPropsToShow();
</script>

<div class="cssEditor" bind:clientHeight>
  <div class="header">
    <i class="fa-solid fa-filter" />
    <input
      class="filterInput"
      placeholder="property, property, etc..."
      value={filter}
      on:input={(e) => handleFilterInput(e)}
    />
    {#if hideEmpty && filter.length === 0}
      <button
        class="threethreesbutton"
        on:click={() => {
          hideEmpty = false;
          filtered = setPropsToShow();
        }}
      >
        <i class="fa-solid fa-eye" />
      </button>
    {/if}
    {#if !hideEmpty && filter.length === 0}
      <button
        class="threethreesbutton"
        on:click={() => {
          hideEmpty = true;
          filtered = setPropsToShow();
        }}
      >
        <i class="fa-solid fa-eye-slash" />
      </button>
    {/if}
    {#if filter.length > 0 && filtered.length > 0}
      <button on:click={() => refreshProps()}>
        <i class="fas fa-refresh" />
      </button>
    {/if}
    {#if filter.length === 0}
      <button on:click={() => refreshProps()}>
        <i class="fas fa-refresh" />
      </button>
    {/if}
  </div>
  <span class="style">&lt;style&gt;</span>
  {#each propsToShow as property (property)}
    <div class="property">
      <input type="text" class="propertyName" value={property} disabled />
      <span>:</span>
      <input
        type="text"
        class="propertyValue"
        value={element[property] || null}
        on:input={(e) => {
          if (e.target.value.includes(";")) {
            e.target.value = e.target.value.replace(";", "");
            return;
          }
          handleEdit(property, e.target.value);
        }}
      />
      <span>;</span>
    </div>
  {/each}
  <span class="endStyle">&lt;/style&gt;</span>
</div>

<style>
  .cssEditor {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: #1e1e1e;
    color: #d4d4d4;
    font-family: monospace;
    gap: 8px;
    padding: 8px;
    border-radius: 5px;
  }

  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .filterInput {
    width: 100%;
  }

  span {
    font-weight: bold;
    color: brown;
  }

  .property {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input {
    width: 200px;
    border: none;
    outline: none;
    font-family: monospace;
    background: #1e1e1e;
    color: white;
  }

  input.propertyValue {
    background: white;
    color: black;
  }
</style>
