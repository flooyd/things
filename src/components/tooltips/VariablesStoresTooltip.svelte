<script>
  import {
    addVariableForElement,
    getId,
    updateVariableForElement,
    addFunction,
  } from "../../util";
  import {
    toolbarOpenStyle,
    variablesStoresTooltipOpen,
    clickedElement,
    width,
    height,
    variablesStore,
    variableUpdated,
  } from "../../stores/globals";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";

  let error = "";
  let selected = null;
  let dirtyVariables = [];

  onMount(() => {
    setSelected("let");
  });

  const addVariable = async (readonly = false) => {
    const createdVariable = await addVariableForElement($clickedElement._id, {
      name: getId(),
      type: "string",
      readonly,
      value: "",
    });

    if (createdVariable) {
      $variablesStore.push(createdVariable);
      $variablesStore = $variablesStore;
    }
  };

  const createVariableFunction = async (variable) => {
    await saveVariables();
    let createdFunction = await addFunction(
      $clickedElement._id,
      variable.name,
      $width / 2,
      150,
      true,
      variable._id
    );
    if (createdFunction) {
      createdFunction = {
        _id: createdFunction._id,
        name: createdFunction.name,
        elementId: $clickedElement._id,
        rect: {
          x: createdFunction.rectX,
          y: createdFunction.rectY,
          width: 0,
          height: 0,
          inArrowLocation: {
            x: 0,
            y: 0,
          },
          outArrowLocation: {
            x: 0,
            y: 0,
          },
        },
        isVariable: createdFunction.isVariable,
        variableId: createdFunction.variableId,
      };

      $clickedElement.grid.functions.push(createdFunction);
      $clickedElement.grid.functions = $clickedElement.grid.functions;
    }
  };

  const setSelected = (value) => {
    selected = value;
  };

  const handleChange = (e, id) => {
    const variable = $variablesStore.find((v) => v._id === id);
    variable[e.target.name] = e.target.value;
    $variablesStore = $variablesStore;
    $variableUpdated = id;
    if (!dirtyVariables.find((v) => v._id === id)) {
      dirtyVariables.push(variable);
    }
  };

  const saveVariables = async () => {
    if (error.length > 0) {
      return;
    }
    error = "";
    const variablesToSave = dirtyVariables.map((v) => {
      return {
        _id: v._id,
        name: v.name,
        type: v.type,
        value: v.value,
        readonly: v.readonly,
      };
    });
    const elementId = $clickedElement._id;
    variablesToSave.forEach((variable) => {
      const updatedVariable = updateVariableForElement(elementId, variable);
      variable = updatedVariable;
    });
    dirtyVariables = [];
  };

  setInterval(() => {
    $variablesStore.forEach((variable) => {
      if (
        $variablesStore.find(
          (v) => v.name === variable.name && v._id !== variable._id
        )
      ) {
        error = "Variable names must be unique";
      } else {
        error = "";
      }
    });
  }, 500);

  setInterval(() => {
    if (error.length > 0) {
      return;
    } else {
      saveVariables();
    }
  }, 5000);
</script>

<div
  class="variablesStoresTooltip"
  style={$toolbarOpenStyle}
  transition:fly={{ duration: 75, y: -500 }}
>
  <div class="header">
    <div class="headerTitle">
      <span>Variables and Stores</span>
      <i class="fa-solid fa-box" />
    </div>
    <button
      class="headerClose"
      on:click={() => ($variablesStoresTooltipOpen = false)}
    >
      <i class="fa-solid fa-times" />
    </button>
    <div class="headerDivider" />
  </div>
  <div class="description">
    <span>
      Variables and stores are used to store data. Variables are used to store
      data that is only used in the current element/component. Stores are used
      to store data that is used across the entire app (or multiple
      elements/components).
    </span>
  </div>
  {#if $clickedElement}
    <div class="variablesStores">
      <div class="variable">
        <div class="variableTitle">
          <span>Variables</span>
          <i class="fa-solid fa-box" />
        </div>
        <div class="variableDescription">
          <span>
            Variables are used to store data that is only used in the current
            element/component.
          </span>
        </div>
        <div class="variableExample">
          <span>
            <span class="variableExampleTitle">Example:</span>
            <span class="variableExampleCode">
              <span class="variableExampleCodeKeyword">let</span>
              <span class="variableExampleCodeName">name</span>
              <span class="variableExampleCodeOperator">=</span>
              <span class="variableExampleCodeString">"John"</span>
              <span class="variableExampleCodeOperator">;</span>
            </span>
          </span>
        </div>

        <div class="variables">
          <div
            class="variable"
            on:click={() => setSelected("let")}
            style={selected === "let" ? "" : "cursor: pointer"}
          >
            <div class="variableTitle">
              <div>
                <span>let</span>
              </div>
              {#if selected === "let"}
                <button
                  class="threethreesbutton"
                  on:click={(e) => {
                    e.stopPropagation();
                    setSelected(null);
                  }}
                >
                  <i class="fa fa-times" />
                </button>
              {/if}
            </div>
            <div class="variableDescription">
              <span>
                Declares a variable that can be changed. The value of the
                variable can be changed at any time.
              </span>
            </div>
            {#if selected === "let"}
              <div class="variableEditors">
                <div class="buttons">
                  <button
                    class="orangeButton"
                    on:click={() => addVariable(false)}
                    disabled={error.length > 0}
                  >
                    <i class="fa fa-plus" />
                  </button>
                </div>
                <div class="error">{error}</div>
                {#each $variablesStore as variable (variable._id)}
                  <div class="variableEditor">
                    <span class="variableEditorKeyword">let</span>
                    <span class="variableEditorName">
                      <input
                        on:input={(e) => handleChange(e, variable._id)}
                        class="nameInput"
                        type="text"
                        placeholder="name"
                        name="name"
                        value={variable.name}
                      />
                    </span>
                    <span class="variableEditorOperator">=</span>
                    <span class="variableEditorString">
                      <input
                        disabled={error.length > 0}
                        class="valueInput"
                        type="text"
                        placeholder="value"
                        name="value"
                        value={variable.value}
                        on:input={(e) => handleChange(e, variable._id)}
                      />
                    </span>
                    <span class="variableEditorOperator">;</span>
                    <select
                      name="type"
                      disabled={error.length > 0}
                      bind:value={variable.type}
                      on:change={(e) => handleChange(e, variable._id)}
                    >
                      <option value="number">number</option>
                      <option value="string">string</option>
                      <option value="boolean">boolean</option>
                      <option value="object">object</option>
                      <option value="array">array</option>
                      <option value="null">null</option>
                      <option value="undefined">undefined</option>
                    </select>
                    <button class="redButton">
                      <i class="fa fa-trash" />
                    </button>
                    <button
                      class="orangeButton"
                      disabled={error.length > 0}
                      on:click={() => createVariableFunction(variable)}
                    >
                      <i class="fa fa-arrow-right" />
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
          <div class="variable" on:click={() => setSelected("const")}>
            <div class="variableTitle">
              <span>const</span>
            </div>
            <div class="variableDescription">
              <span>
                Declares a variable that cannot be changed. The value of the
                variable cannot be changed at any time.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="store">
        <div class="storeTitle">
          <span>Stores</span>
          <i class="fa-solid fa-box" />
        </div>
        <div class="storeDescription">
          <span>
            Stores are used to store data that is used across the entire app (or
            multiple elements/components).
          </span>
        </div>
        <div class="storeExample">
          <span>
            <span class="storeExampleTitle">Example:</span>
            <span class="storeExampleCode">
              <span class="storeExampleCodeKeyword">import</span>
              <span class="storeExampleCodeName">name</span>
              <span class="storeExampleCodeOperator">from</span>
              <span class="storeExampleCodeString">"../stores/name"</span>
              <span class="storeExampleCodeOperator">;</span>
            </span>
          </span>
        </div>
        <div class="stores">
          <div class="store" on:click={() => setSelected("createStore")}>
            <div class="storeTitle">
              <span>Create Store</span>
            </div>
            <div class="storeDescription">
              <span> Creates a store. </span>
            </div>
          </div>
          <div class="store" on:click={() => setSelected("updateStore")}>
            <div class="storeTitle">
              <span>Update Store</span>
            </div>
            <div class="storeDescription">
              <span> Updates a store. </span>
            </div>
          </div>

          <div class="store" on:click={() => setSelected("subscribe")}>
            <div class="storeTitle">
              <span>Subscribe to Store</span>
            </div>
            <div class="storeDescription">
              <span>
                Subscribes to a store. When the store is updated, the subscribed
                element/component will be updated.
              </span>
            </div>
          </div>
          <div class="store" on:click={() => setSelected("unsubscribe")}>
            <div class="storeTitle">
              <span>Unsubscribe from Store</span>
            </div>
            <div class="storeDescription">
              <span>
                Unsubscribes from a store. When the store is updated, the
                unsubscribed element/component will not be updated.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  <div class="divider">Hello</div>
</div>

<style>
  .variablesStoresTooltip {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 8px;
    min-width: 550px;
    max-width: 550px;
    height: 100%;
    background: white;
    font-size: 13px;
    padding: 0px 13px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    left: calc(100vw - 433px);
    overflow-x: auto;
    pointer-events: all;
    opacity: 0.95;
  }

  .variablesStoresTooltip::-webkit-scrollbar {
    width: 8px;
  }

  .variablesStoresTooltip::-webkit-scrollbar-thumb {
    background: orange;
  }
  .header {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    color: orange;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    background: white;
    top: 0px;
    padding: 13px 0px;
    flex-wrap: wrap;
  }

  .headerTitle {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .headerClose:hover {
    cursor: pointer;
    color: black;
    background: orange;
  }

  .header span {
    color: black;
  }

  .description {
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 1.4;
  }

  .headerDivider {
    height: 3px;
    width: 100%;
    border-top: 3px solid orange;
    margin-top: 3px;
    color: transparent;
  }

  .buttons {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }

  .variablesStores {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .variable,
  .store {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    border-radius: 5px;
  }

  .variableEditor {
    padding: 4px 0px;
    border-bottom: 1px solid black;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .variableEditor:hover {
    background: white;
  }

  .error {
    color: red;
  }

  .nameInput,
  .valueInput {
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: black;
    max-width: 100px;
  }

  .variables .variable,
  .stores .store {
    margin-top: 8px;
    border-radius: 5px;
  }

  .variableTitle,
  .storeTitle {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    font-weight: bold;
  }

  .variableDescription,
  .storeDescription {
    font-size: 13px;
    line-height: 1.4;
  }

  .variableExample,
  .storeExample {
    font-size: 13px;
    line-height: 1.4;
  }

  .variableExampleTitle,
  .storeExampleTitle {
    font-weight: bold;
  }

  .variableExampleCode,
  .storeExampleCode,
  .variableEditorOperator {
    font-family: "Courier New", Courier, monospace;
  }

  .variableExampleCodeKeyword,
  .storeExampleCodeKeyword,
  .variableEditorKeyword {
    color: #0000ff;
  }

  .variableExampleCodeName,
  .storeExampleCodeName,
  .variableEditorName {
    color: #a31515;
  }

  .variableExampleCodeOperator,
  .storeExampleCodeOperator,
  .variableEditorOperator {
    color: orange;
  }

  .variableExampleCodeString,
  .storeExampleCodeString {
    color: #a31515;
  }

  .divider {
    width: 100%;
    height: 30px;
    color: transparent;
  }
</style>
