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
