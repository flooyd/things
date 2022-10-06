import { v4 as uuidv4 } from "uuid";
//import collection, addDoc
import { awaitingFirebase, updateAwaitingFirebase } from "./stores/globals";
import { elements as elementsStore, updateElements } from "./stores/elements";
import { get } from "svelte/store";

export const getId = () => {
  return uuidv4();
};

export function typewriter(node, { speed = 1 }) {
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

export const addElement = async (type) => {
  updateAwaitingFirebase(true);
  const elements = get(elementsStore);
  const addedDoc = await fetch("http://localhost:3000/things", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: type }),
  });
  const addedDocJson = await addedDoc.json();
  let newElement = addedDocJson;

  updateElements([...elements, newElement]);
  updateAwaitingFirebase(false);
};

export const fetchElements = async () => {
  updateAwaitingFirebase(true);
  const elements = await fetch("http://localhost:3000/things");
  const elementsJson = await elements.json();
  updateAwaitingFirebase(false);
  return elementsJson;
};

export const deleteElement = async (id) => {
  updateAwaitingFirebase(true);
  const elements = get(elementsStore);
  const deletedDoc = await fetch("http://localhost:3000/things/" + id, {
    method: "DELETE",
  });
  updateElements(elements.filter((element) => element._id !== id));
  updateAwaitingFirebase(false);
};

export const copyElement = async (element) => {
  updateAwaitingFirebase(true);
  const elements = get(elementsStore);
  const copiedDoc = await fetch("http://localhost:3000/things", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...element, _id: undefined }),
  });
  const copiedDocJson = await copiedDoc.json();

  updateAwaitingFirebase(false);
};

//function for random hex color
function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

//function for random border
function randomBorder() {
  return Math.floor(Math.random() * 10) + "px solid " + randomColor();
}

//random width string between params x and y (with px at end) for style
function randomWidth(x, y) {
  return Math.floor(Math.random() * (y - x) + x) + "px";
}

//random height string between params x and y (with px at end) for style
function randomHeight(x, y) {
  return Math.floor(Math.random() * (y - x) + x) + "px";
}

//random between range
export function randomRange(x, y) {
  return Math.floor(Math.random() * (y - x) + x);
}

//function to create and return an interval
function createInterval(func, time) {
  return setInterval(func, time);
}

//function to create and return a timeout
function createTimeout(func, time) {
  return setTimeout(func, time);
}

//function to end an interval
function endInterval(interval) {
  clearInterval(interval);
}

//function to end a timeout
function endTimeout(timeout) {
  clearTimeout(timeout);
}

//function get random display value either initial or none
function randomDisplay() {
  return Math.random() < 0.5 ? "block" : "none";
}

export const initFunctions = () => {
  window.randomColor = randomColor;
  window.randomBorder = randomBorder;
  window.randomWidth = randomWidth;
  window.randomHeight = randomHeight;
  window.createInterval = createInterval;
  window.createTimeout = createTimeout;
  window.endInterval = endInterval;
  window.endTimeout = endTimeout;
  window.randomDisplay = randomDisplay;
};

export const functions = {
  mount: "runs when the component is mounted",
  afterUpdate: "runs after the component is updated",
  beforeUpdate: "runs before the component is updated",
  beforeDestroy: "runs before the component is destroyed",
  afterDestroy: "runs after the component is destroyed",
  log: "logs a message to the console",
  logError: "logs an error to the console",
  logWarning: "logs a warning to the console",
  logInfo: "logs an info message to the console",
};

export const executables = ["log", "logError", "logWarning", "logInfo"];

export const classesAndObjects = {
  log: "console",
  logError: "console",
  logWarning: "console",
  logInfo: "console",
  mount: "lifecycle",
  afterUpdate: "lifecycle",
  beforeUpdate: "lifecycle",
  beforeDestroy: "lifecycle",
  afterDestroy: "lifecycle",
};
