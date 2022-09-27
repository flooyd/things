import { v4 as uuidv4 } from "uuid";
//import collection, addDoc
import {
  collection,
  addDoc,
  getDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import {
  db as dbStore,
  awaitingFirebase,
  updateAwaitingFirebase,
} from "./stores/globals";
import { elements as elementsStore, updateElements } from "./stores/elements";
import { get } from "svelte/store";

export const getId = (tag) => {
  return tag + "-" + uuidv4();
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
  const db = get(dbStore);
  const elements = get(elementsStore);
  //switch on type, if type is div, add div, if type is button, add button, etc...format {type: "string"}
  const thingsCol = await collection(db, "things");
  const addedDoc = await addDoc(thingsCol, {
    type: type,
    childOf: "",
    parentOf: "",
  });
  let newElement = await (await getDoc(addedDoc)).data();
  newElement = { ...newElement, id: addedDoc.id };

  updateElements([...elements, newElement]);
  updateAwaitingFirebase(false);
};

const fetchElements = async () => {
  updateAwaitingFirebase(true);
  const db = get(dbStore);
  const thingsCol = await collection(db, "things");
  const querySnapshot = await getDocs(thingsCol);
  let elements = [];
  querySnapshot.forEach((doc) => {
    let element = doc.data();
    element = { ...element, id: doc.id };
    elements.push(element);
  });
  updateElements(elements);
  updateAwaitingFirebase(false);
};

export const deleteElement = async (id) => {
  updateAwaitingFirebase(true);
  const db = get(dbStore);
  const elements = get(elementsStore);
  await deleteDoc(doc(db, "things", id));
  let newElements = [];
  JSON.parse(JSON.stringify(elements.filter((e) => e.id !== id))).forEach((e) =>
    newElements.push(e)
  );
  updateElements(newElements);
  updateAwaitingFirebase(false);
};

export const copyElement = async (id) => {
  updateAwaitingFirebase(true);
  const db = get(dbStore);
  const elements = get(elementsStore);
  const docRef = doc(db, "things", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  const thingsCol = await collection(db, "things");
  const newElement = await addDoc(thingsCol, { ...data });
  const newElementData = await await getDoc(newElement);
  updateElements([
    ...elements,
    { ...newElementData.data(), id: newElementData.id },
  ]);
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
