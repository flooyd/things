<script>
  import { cssObject } from "../util";
  import { clickedElement } from "../stores/globals";

  export let element;
  export let handleEdit;

  let filter = "";
  let filtered = [];
  let clientHeight = null;

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

  $: filtered = filtered.length > 0 ? filtered : properties;

  //sort properties alphabetically and put the ones that are not null at the top
  properties.sort((a, b) => {
    if (element[a] && !element[b]) return -1;
    if (!element[a] && element[b]) return 1;
    return a.localeCompare(b);
  });

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
  };
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
  </div>
  <span class="style">&lt;style&gt;</span>
  {#each filtered as property (property)}
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
