import { v4 as uuidv4 } from "uuid";
//import collection, addDoc
import {
  updateLoading,
  dirtyFunctions,
  clickedElement,
  updateDirtyFunctions,
} from "./stores/globals";
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
  updateLoading(true);
  const elements = get(elementsStore);
  const addedDoc = await fetch("http://localhost:3000/things", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: type }),
  });
  if (addedDoc.ok) {
    const addedDocJson = await addedDoc.json();
    let newElement = addedDocJson;
    updateElements([...elements, newElement]);
    updateLoading(false);
  } else {
    return;
  }
};

export const fetchElements = async () => {
  updateLoading(true);
  const elements = await fetch("http://localhost:3000/things");
  const elementsJson = await elements.json();
  updateLoading(false);
  return elementsJson;
};

export const deleteElement = async (id) => {
  updateLoading(true);
  const elements = get(elementsStore);
  const deletedDoc = await fetch("http://localhost:3000/things/" + id, {
    method: "DELETE",
  });
  updateElements(elements.filter((element) => element._id !== id));
  updateLoading(false);
};

export const deleteAllElements = async () => {
  updateLoading(true);
  const elements = get(elementsStore);
  const deletedDoc = await fetch("http://localhost:3000/things/deleteAll", {
    method: "DELETE",
  });
  updateElements([]);
  updateLoading(false);
};

export const updateElement = async (element) => {
  updateLoading(true);
  const elements = get(elementsStore);
  const updatedDoc = await fetch("http://localhost:3000/things/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(element),
  });
  const updatedDocJson = await updatedDoc.json();
  let newElement = updatedDocJson;
  updateElements(
    elements.map((element) => {
      if (element._id === newElement._id) {
        return newElement;
      } else {
        return element;
      }
    })
  );
  updateLoading(false);
};

//fetchFunctions(id) /functions
export const fetchFunctionsForElement = async (elementId) => {
  updateLoading(true);
  const functions = await fetch(
    "http://localhost:3000/functions/forElement/" + elementId
  );
  const functionsJson = await functions.json();
  updateLoading(false);
  return functionsJson;
};

export const addFunction = async (elementId, type) => {
  updateLoading(true);
  const functions = await fetch("http://localhost:3000/functions/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: type, elementId: elementId }),
  });
  if (functions.ok) {
    const functionsJson = await functions.json();
    updateLoading(false);
    return functionsJson;
  } else {
    return;
  }
};

//delete function by id
export const deleteFunctionById = async (functionId) => {
  updateLoading(true);
  const functions = await fetch(
    "http://localhost:3000/functions/" + functionId,
    {
      method: "DELETE",
    }
  );
  updateLoading(false);
};

//delete all functions by id
export const deleteAllFunctionsForElement = async (elementId) => {
  updateLoading(true);
  const functions = await fetch(
    "http://localhost:3000/functions/" + elementId,
    {
      method: "DELETE",
    }
  );
  updateLoading(false);
};

export const removeAllFunctions = async () => {
  updateLoading(true);
  const functions = await fetch("http://localhost:3000/functions/all", {
    method: "DELETE",
  });
  updateLoading(false);
};

export const addDirtyFunction = async (functionId) => {
  const dirtyFunctionsArray = get(dirtyFunctions);
  if (dirtyFunctionsArray.includes(functionId) || functionId === null) {
    return;
  }
  updateDirtyFunctions([...dirtyFunctionsArray, functionId]);
};

export const saveDirtyFunctions = async () => {
  const dirtyFunctionsArray = get(dirtyFunctions);
  dirtyFunctionsArray.forEach(async (func) => {
    await saveFunction(func);
  });
};

export const saveFunction = async (functionId) => {
  const functions = get(clickedElement).grid.functions;
  const functionToSave = functions.find((func) => func._id === functionId);
  const functionFlattend = {
    _id: functionToSave._id,
    name: functionToSave.name,
    elementId: functionToSave.elementId,
    rectX: functionToSave.rect.x,
    rectY: functionToSave.rect.y,
    inArrowX: functionToSave.rect.inArrowLocation.x,
    inArrowYLocations: [functionToSave.rect.inArrowLocation.y],
    outArrowX: functionToSave.rect.outArrowLocation.x,
    outArrowYLocations: [functionToSave.rect.outArrowLocation.y],
  };
  const updatedDoc = await fetch("http://localhost:3000/functions/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(functionFlattend),
  });
  if (updatedDoc) {
    return await updatedDoc.json();
  }
};

//get all connections for element
export const getAllConnectionsForElement = async (elementId) => {
  console.log("getting all connections for element", elementId);
  updateLoading(true);
  const connections = await fetch(
    "http://localhost:3000/connections/forElement/" + elementId
  );
  const connectionsJson = await connections.json();
  updateLoading(false);
  return connectionsJson;
};

//get connection by id
export const getConnectionById = async (connectionId) => {
  updateLoading(true);
  const connections = await fetch(
    "http://localhost:3000/connections/" + connectionId
  );
  const connectionsJson = await connections.json();
  updateLoading(false);
  return connectionsJson;
};

//delete connection by id
export const deleteConnectionById = async (connectionId) => {
  updateLoading(true);
  const connections = await fetch(
    "http://localhost:3000/connections/" + connectionId,
    {
      method: "DELETE",
    }
  );
  updateLoading(false);
};

//delete all connections by element id
export const deleteAllConnectionsForElement = async (elementId) => {
  updateLoading(true);
  const connections = await fetch(
    "http://localhost:3000/connections/deleteAll/" + elementId,
    {
      method: "DELETE",
    }
  );
  updateLoading(false);
};

//delete all connections
export const deleteAllConnections = async () => {
  updateLoading(true);
  const connections = await fetch("http://localhost:3000/connections/delete", {
    method: "DELETE",
  });
  updateLoading(false);
};

//add connection
export const addConnection = async (connection) => {
  updateLoading(true);
  const createdConnection = await fetch("http://localhost:3000/connections/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(connection),
  });
  if (createdConnection.ok) {
    const connectionJson = await createdConnection.json();
    updateLoading(false);
    return connectionJson;
  } else {
    return null;
  }
};

//update connection is not necessary

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
  //events
  onClick: "runs when the component is clicked",
  onDblClick: "runs when the component is double clicked",
  onMouseDown: "runs when the mouse is pressed down on the component",
  onMouseUp: "runs when the mouse is released on the component",
  onMouseEnter: "runs when the mouse enters the component",
  onMouseLeave: "runs when the mouse leaves the component",
  onMouseMove: "runs when the mouse moves over the component",
  onContextMenu: "runs when the context menu is opened on the component",
  getElementsByName: "gets all elements with a given name",
  getElementById: "gets an element by id",
};

export const executables = [
  "log",
  "logError",
  "logWarning",
  "logInfo",
  "getElementsByName",
  "getElementById",
];

export const classesAndObjects = {
  mount: "lifecycle",
  afterUpdate: "lifecycle",
  beforeUpdate: "lifecycle",
  beforeDestroy: "lifecycle",
  afterDestroy: "lifecycle",
  log: "console",
  logError: "console",
  logWarning: "console",
  logInfo: "console",
  onClick: "event",
  onDblClick: "event",
  onMouseDown: "event",
  onMouseUp: "event",
  onMouseEnter: "event",
  onMouseLeave: "event",
  onMouseMove: "event",
  onContextMenu: "event",
  getElementsByName: "document",
  getElementById: "document",
};
