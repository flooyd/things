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

//fetchFunctions(id) /functions
export const fetchFunctionsForElement = async (elementId) => {
  updateAwaitingFirebase(true);
  const functions = await fetch(
    "http://localhost:3000/functions/forElement/" + elementId
  );
  const functionsJson = await functions.json();
  updateAwaitingFirebase(false);
  return functionsJson;
};

export const addFunction = async (elementId, type) => {
  updateAwaitingFirebase(true);
  const functions = await fetch("http://localhost:3000/functions/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: type, elementId: elementId }),
  });
  const functionsJson = await functions.json();
  updateAwaitingFirebase(false);
  return functionsJson;
};

//delete function by id
export const deleteFunctionById = async (functionId) => {
  updateAwaitingFirebase(true);
  const functions = await fetch(
    "http://localhost:3000/functions/" + functionId,
    {
      method: "DELETE",
    }
  );
  updateAwaitingFirebase(false);
};

//delete all functions by id
export const deleteAllFunctionsForElement = async (elementId) => {
  updateAwaitingFirebase(true);
  const functions = await fetch(
    "http://localhost:3000/functions/" + elementId,
    {
      method: "DELETE",
    }
  );
  updateAwaitingFirebase(false);
};

export const removeAllFunctions = async () => {
  updateAwaitingFirebase(true);
  const functions = await fetch("http://localhost:3000/functions/all", {
    method: "DELETE",
  });
  updateAwaitingFirebase(false);
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
