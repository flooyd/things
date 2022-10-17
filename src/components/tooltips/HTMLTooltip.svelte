<script>
  import { onMount } from "svelte";
  import { addElement } from "../../util";
  import { toolbarOpenStyle, htmlTooltipOpen } from "../../stores/globals";

  let hovered = null;
  let showOptions = false;
  let pendingTag = null;

  const tags = [
    "a",
    "aside",
    "article",
    "button",
    "div",
    "footer",
    "form",
    "header",
    "img",
    "input",
    "label",
    "main",
    "nav",
    "option",
    "p",
    "section",
    "select",
    "span",
    "table",
    "tbody",
    "td",
    "textarea",
    "th",
    "thead",
    "tr",
  ];

  const tagDescriptions = {
    a: "An anchor tag that links to another page or section of the current page.",
    aside: "A section of the page that is not the main content.",
    article:
      "A section of the page that is self-contained and can be used independently.",
    button: "A button that can be clicked.",
    div: "A generic container that can be used to group elements.",
    footer: "A section of the page that contains information about the page.",
    form: "A section of the page that contains input fields.",
    header: "A section of the page that contains the title of the page.",
    img: "An image.",
    input: "An input field that can be used to enter text.",
    label: "A label that can be used to describe an input field.",
    main: "The main content of the page.",
    nav: "A section of the page that contains navigation links.",
    option: "An option that can be selected in a select field.",
    p: "A paragraph of text.",
    section:
      "A section of the page that is self-contained and can be used independently.",
    select: "A dropdown menu that can be used to select an option.",
    span: "A generic container that can be used to group elements.",
    table: "A table that can be used to display data.",
    tbody: "A section of a table that contains the body of the table.",
    td: "A cell in a table.",
    textarea: "A text area that can be used to enter text.",
    th: "A header cell in a table.",
    thead: "A section of a table that contains the header of the table.",
    tr: "A row in a table.",
  };

  const tagCategories = {
    a: "Links",
    aside: "Containers",
    article: "Containers",
    button: "Buttons",
    div: "Containers",
    footer: "Containers",
    form: "Containers",
    header: "Containers",
    img: "Images",
    input: "Inputs",
    label: "Inputs",
    main: "Containers",
    nav: "Containers",
    option: "Inputs",
    p: "Text",
    section: "Containers",
    select: "Inputs",
    span: "Containers",
    table: "Tables",
    tbody: "Tables",
    td: "Tables",
    textarea: "Inputs",
    th: "Tables",
    thead: "Tables",
    tr: "Tables",
  };

  const tagIcons = {
    a: "link",
    aside: "align-left",
    article: "align-left",
    button: "square",
    div: "align-left",
    footer: "align-left",
    form: "align-left",
    header: "align-left",
    img: "image",
    input: "square",
    label: "square",
    main: "align-left",
    nav: "align-left",
    option: "square",
    p: "align-left",
    section: "align-left",
    select: "square",
    span: "align-left",
    table: "table",
    tbody: "table",
    td: "table",
    textarea: "square",
    th: "table",
    thead: "table",
    tr: "table",
  };

  //tag colors based on category
  const tagColors = {
    Links: "blue",
    Containers: "green",
    Buttons: "yellow",
    Images: "purple",
    Inputs: "orange",
    Text: "red",
    Tables: "teal",
  };

  const setHovered = async (item) => {
    hovered = item;
  };

  const click = async (tag) => {
    pendingTag = {
      tag: tag,
      position: "absolute",
      top: "100px",
      left: "100px",
      width: "100px",
      height: "100px",
      background: "white",
      border: "1px solid black",
      content: "Hello, world!",
      color: "black",
    };
    showOptions = true;
  };

  const createElement = async () => {
    console.log("creating element");
    console.log(pendingTag);
    await addElement(pendingTag);
    pendingTag = null;
    showOptions = false;
    $htmlTooltipOpen = false;
  };
</script>

<div class="htmlTooltip" style={$toolbarOpenStyle}>
  <div class="header">
    <div class="headerTitle">
      <span>HTML</span>
      <i class="fa fa-html5" />
    </div>
    <button
      class="headerClose"
      on:click={() => {
        $htmlTooltipOpen = false;
      }}
    >
      <i class="fa fa-times" />
    </button>
  </div>
  {#if !showOptions}
    <div class="description">
      <span>HTML tags are used to create elements.</span>
      <span>Elements represent the structure of your app.</span>
      <span>Click on a tag to create an element and add it to the app.</span>
    </div>
    <div class="tags">
      {#each tags as tag}
        <div
          on:click={() => {
            click(tag);
          }}
          on:mouseover={() => {
            setHovered(tag);
          }}
          on:focus={() => {
            setHovered(tag);
          }}
          on:mouseleave={() => {
            setHovered(null);
          }}
          class={`tag ${tagColors[tagCategories[tag]]}`}
          on:click={() => {
            addElement(tag);
          }}
          style={hovered === tag
            ? "color: black"
            : "color: " + tagColors[tagCategories[tag]]}
        >
          <div class="tagTitle">
            <i class="fa fa-{tagIcons[tag]}" />
            <span>{tag}</span>
          </div>
          <div class="tagDescription">
            <span>{tagDescriptions[tag]}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  {#if showOptions}
    <div class="options">
      <div class="optionsHeader">
        <span>Options for {pendingTag.tag}</span>
        <i class="fa fa-cog" />
      </div>
      <div class="optionsDescription">
        Assign basic attributes to the element. You can add more attributes by
        clicking on the element in the app. You can add an element as a child of
        another element by assigning its Name to the ChildOf attribute.
      </div>
      <div class="optionsBody">
        <div class="option">
          <label for="class">Classes</label>
          <input
            type="text"
            placeholder="Enter class names separated by spaces"
            bind:value={pendingTag.classes}
          />
        </div>
        <div class="option">
          <label for="id">ID</label>
          <input
            type="text"
            placeholder="Enter an ID"
            bind:value={pendingTag.id}
          />
        </div>
        <div class="option">
          <label for="name">Name</label>
          <input
            type="text"
            placeholder="Enter a name"
            bind:value={pendingTag.name}
          />
        </div>
        <div class="option">
          <label for="childOf">ChildOf</label>
          <input
            type="text"
            placeholder="Enter the name of the parent element"
            bind:value={pendingTag.childOf}
          />
        </div>
        <div class="option">
          <label for="position">Position</label>
          <input
            type="text"
            placeholder="Enter the position of the element"
            bind:value={pendingTag.position}
          />
        </div>
        <div class="option">
          <label for="top">Top</label>
          <input
            type="text"
            placeholder="Enter the top position of the element"
            bind:value={pendingTag.top}
          />
        </div>
        <div class="option">
          <label for="right">Right</label>
          <input
            type="text"
            placeholder="Enter the right position of the element"
            bind:value={pendingTag.right}
          />
        </div>
        <div class="option">
          <label for="bottom">Bottom</label>
          <input
            type="text"
            placeholder="Enter the bottom position of the element"
            bind:value={pendingTag.bottom}
          />
        </div>
        <div class="option">
          <label for="left">Left</label>
          <input
            type="text"
            placeholder="Enter the left position of the element"
            bind:value={pendingTag.left}
          />
        </div>
        <div class="option">
          <label for="width">Width</label>
          <input
            type="text"
            placeholder="Enter the width of the element"
            bind:value={pendingTag.width}
          />
        </div>
        <div class="option">
          <label for="height">Height</label>
          <input
            type="text"
            placeholder="Enter the height of the element"
            bind:value={pendingTag.height}
          />
        </div>
        <div class="option">
          <label for="background">Background</label>
          <input
            type="text"
            placeholder="Enter the background of the element"
            bind:value={pendingTag.background}
          />
        </div>
        <div class="option">
          <label for="border">Border</label>
          <input
            type="text"
            placeholder="Enter the border of the element"
            bind:value={pendingTag.border}
          />
        </div>
        <div class="option">
          <label for="content">Content</label>
          <input
            type="text"
            placeholder="Enter the content of the element"
            bind:value={pendingTag.content}
          />
        </div>
        <div class="option">
          <label for="color">Color</label>
          <input
            type="text"
            placeholder="Enter the color of the element"
            bind:value={pendingTag.color}
          />
        </div>
      </div>
    </div>
    <div class="optionsFooter">
      <button
        on:click={() => {
          createElement();
        }}
      >
        Add Element ({pendingTag.tag})
      </button>
    </div>
  {/if}
</div>

<style>
  .htmlTooltip {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 400px;
    max-width: 400px;
    background: white;
    font-size: 13px;
    padding: 0px 13px;
    overflow-y: auto;
    color: black;
    z-index: 200;
    pointer-events: all;
    border-right: 3px solid lightgreen;
  }

  .htmlTooltip::-webkit-scrollbar {
    width: 0px;
  }

  .header {
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
    font-weight: bold;
    display: flex;
    gap: 8px;
    color: lightgreen;
    justify-content: space-between;
    align-items: center;
  }

  .headerTitle {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .headerClose:hover {
    cursor: pointer;
    color: black;
  }

  span {
    color: black;
  }

  .description {
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 1.4;
  }

  .tag {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    border: 3px solid black;
    border-radius: 5px;
    padding: 8px;
  }

  .tagTitle {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: left;
    font-weight: bold;
    font-size: 16px;
  }

  .tagDescription {
    font-size: 13px;
    line-height: 1.4;
  }

  .option {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-bottom: 10px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

  .optionsBody {
    border: 3px solid black;
    border-radius: 5px;
    padding: 8px;
  }

  .optionsHeader {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
    display: flex;
    gap: 8px;
  }

  .optionsDescription {
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 1.4;
  }

  .optionsFooter {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  input {
    width: 250px;
    border-radius: 5px;
    padding: 8px;
    border: 1px solid black;
  }

  button:hover {
    background: lightgreen;
  }
</style>
