<script>
  import { cssObject } from "../util";

  export let element;
  export let handleEdit;
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

  //sort properties alphabetically and put the ones that are not null at the top
  properties.sort((a, b) => {
    if (element[a] && !element[b]) return -1;
    if (!element[a] && element[b]) return 1;
    return a.localeCompare(b);
  });
</script>

<div class="cssEditor">
  <div class="header">
    <span class="style">&lt;style&gt;</span>
    <div>
      <input
        class="filterInput"
        placeholder="filter by prop name, prop name, etc."
      />
      <button class="brownButton">Show All</button>
    </div>
  </div>
  {#each properties as property (property)}
    <div class="property">
      <input type="text" class="propertyName" value={property} disabled />
      <span>:</span>
      <input
        type="text"
        class="propertyValue"
        value={element[property] || null}
        on:input={(e) => {
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
  }

  .filterInput {
    width: 280px;
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
