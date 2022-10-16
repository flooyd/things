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

export const addElement = async (tag) => {
  updateLoading(true);
  const elements = get(elementsStore);
  const addedDoc = await fetch("http://localhost:3000/things", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...tag, type: tag.tag }),
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
  //life cycle
  mount: "runs when the component is mounted",
  afterUpdate: "runs after the component is updated",
  beforeUpdate: "runs before the component is updated",
  beforeDestroy: "runs before the component is destroyed",
  afterDestroy: "runs after the component is destroyed",

  //log
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

  //document object model functions (reference mdn)
  getElementsByName: "gets all elements with a given name",
  getElementById: "gets an element by id",
  getElementsByClassName: "gets all elements with a given class name",
  getElementsByTagName: "gets all elements with a given tag name",

  //variable assignment
  setVariable: "sets a variable",
  getVariable: "gets a variable",

  //conditional
  if: "runs a block of code if a condition is true",
  elseIf:
    "runs a block of code if a condition is true and the previous if statement was false",
  else: "runs a block of code if a condition is false",

  //loop
  for: "runs a block of code a given number of times",
  forEach: "runs a block of code for each item in an array",
  while: "runs a block of code while a condition is true",

  //operators
  add: "adds two numbers",
  subtract: "subtracts two numbers",
  multiply: "multiplies two numbers",
  divide: "divides two numbers",
  modulo: "returns the remainder of two numbers",
  power: "raises a number to a power",

  //logic
  and: "returns true if both values are true",
  or: "returns true if either value is true",
  not: "returns the opposite of the value",

  //comparison
  greaterThan: "returns true if the first value is greater than the second",
  lessThan: "returns true if the first value is less than the second",
  greaterThanOrEqual:
    "returns true if the first value is greater than or equal to the second",
  lessThanOrEqual:
    "returns true if the first value is less than or equal to the second",
  equal: "returns true if the two values are equal",
  notEqual: "returns true if the two values are not equal",

  //jump
  break: "stops the current loop",
  continue:
    "stops the current iteration of the loop and continues to the next iteration",

  //return
  return: "returns a value from a function",
};

export const functionOutputs = {
  log: {
    count: 0,
  },
  logError: {
    count: 0,
  },
  logWarning: {
    count: 0,
  },
  logInfo: {
    count: 0,
  },
  getElementsByName: {
    count: 1,
    type: "array",
  },
  getElementById: {
    count: 1,
    type: "object",
  },
  getElementsByClassName: {
    count: 1,
    type: "array",
  },
  getElementsByTagName: {
    count: 1,
    type: "array",
  },
  setVariable: {
    count: 1,
    type: "any",
  },
  getVariable: {
    count: 1,
    type: "any",
  },
  if: {
    count: 0,
  },
  else: {
    count: 0,
  },
  elseIf: {
    count: 0,
  },
  for: {
    count: 0,
  },
  forEach: {
    count: 0,
  },
  while: {
    count: 0,
  },
  add: {
    count: 1,
    type: "number",
  },
  subtract: {
    count: 1,
    type: "number",
  },
  multiply: {
    count: 1,
    type: "number",
  },
  divide: {
    count: 1,
    type: "number",
  },
  modulo: {
    count: 1,
    type: "number",
  },
  power: {
    count: 1,
    type: "number",
  },
  and: {
    count: 1,
    type: "boolean",
  },
  or: {
    count: 1,
    type: "boolean",
  },
  not: {
    count: 1,
    type: "boolean",
  },
  greaterThan: {
    count: 1,
    type: "boolean",
  },
  lessThan: {
    count: 1,
    type: "boolean",
  },
  greaterThanOrEqual: {
    count: 1,
    type: "boolean",
  },
  lessThanOrEqual: {
    count: 1,
    type: "boolean",
  },
  equal: {
    count: 1,
    type: "boolean",
  },
  notEqual: {
    count: 1,
    type: "boolean",
  },
};

export const functionInputs = {
  log: {
    count: 1,
    type: "any",
    description: "the message to log",
  },
  logError: {
    count: 1,
    type: "any",
    description: "the error to log",
  },
  logWarning: {
    count: 1,
    type: "any",
    description: "the warning to log",
  },
  logInfo: {
    count: 1,
    type: "any",
    description: "the info message to log",
  },
  getElementsByName: {
    count: 1,
    type: "string",
    description: "the name of the elements to get",
  },
  getElementById: {
    count: 1,
    type: "string",
    description: "the id of the element to get",
  },
  getElementsByClassName: {
    count: 1,
    type: "string",
    description: "the class name of the elements to get",
  },
  getElementsByTagName: {
    count: 1,
    type: "string",
    description: "the tag name of the elements to get",
  },
  setVariable: {
    count: 2,
    type: "string",
    type2: "any",
    description: "the name of the variable to set",
    descripttion2: "the value of the variable to set",
  },
  getVariable: {
    count: 1,
    type: "string",
    description: "the name of the variable to get",
  },
  if: {
    count: 1,
    type: "boolean",
    description: "the condition to check",
  },
  elseIf: {
    count: 1,
    type: "boolean",
    description: "the condition to check",
  },
  else: {
    count: 0,
  },
  for: {
    count: 1,
    type: "number",
    description: "the number of times to run the code",
  },
  forEach: {
    count: 1,
    type: "array",
    description: "the array to loop through",
  },
  while: {
    count: 1,
    type: "boolean",
    description: "the condition to check",
  },
  add: {
    count: 2,
    type: "number",
    description: "the numbers to add",
    extendable: true,
  },
  subtract: {
    count: 2,
    type: "number",
    description: "the numbers to subtract",
    extendable: true,
  },
  multiply: {
    count: 2,
    type: "number",
    description: "the numbers to multiply",
    extendable: true,
  },
  divide: {
    count: 2,
    type: "number",
    description: "the numbers to divide",
    extendable: true,
  },
  modulo: {
    count: 2,
    type: "number",
    description: "the numbers to get the remainder of",
    extendable: true,
  },
  power: {
    count: 2,
    type: "number",
    description: "the numbers to get the power of",
    extendable: true,
  },
  and: {
    count: 2,
    type: "boolean",
    description: "the booleans to check",
    extendable: true,
  },
  or: {
    count: 2,
    type: "boolean",
    description: "the booleans to check",
    extendable: true,
  },
  not: {
    count: 1,
    type: "boolean",
    description: "the boolean to check",
  },
  greaterThan: {
    count: 2,
    type: "number",
    description: "the numbers to check",
  },
  lessThan: {
    count: 2,
    type: "number",
    description: "the numbers to check",
  },
  greaterThanOrEqual: {
    count: 2,
    type: "number",
    description: "the numbers to check",
  },
  lessThanOrEqual: {
    count: 2,
    type: "number",
    description: "the numbers to check",
  },
  equal: {
    count: 2,
    type: "any",
    description: "the values to check",
  },
  notEqual: {
    count: 2,
    type: "any",
    description: "the values to check",
  },
};

export const executables = [
  "log",
  "logError",
  "logWarning",
  "logInfo",
  "getElementsByName",
  "getElementById",
  "getElementsByClassName",
  "getElementsByTagName",
  "setVariable",
  "getVariable",
  "if",
  "elseIf",
  "else",
  "for",
  "forEach",
  "while",
  "add",
  "subtract",
  "multiply",
  "divide",
  "modulo",
  "power",
  "and",
  "or",
  "not",
  "greaterThan",
  "lessThan",
  "greaterThanOrEqual",
  "lessThanOrEqual",
  "equal",
  "notEqual",
];

export const objects = {
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
  getElementsByClassName: "document",
  getElementsByTagName: "document",
  setVariable: "variable",
  getVariable: "variable",
  if: "conditional",
  elseIf: "conditional",
  else: "conditional",
  for: "loop",
  forEach: "loop",
  while: "loop",
  add: "math",
  subtract: "math",
  multiply: "math",
  divide: "math",
  modulo: "math",
  power: "math",
  and: "logic",
  or: "logic",
  not: "logic",
  greaterThan: "logic",
  lessThan: "logic",
  greaterThanOrEqual: "logic",
  lessThanOrEqual: "logic",
  equal: "logic",
  notEqual: "logic",
  break: "jump",
  continue: "jump",
  return: "return",
};

export const objectColors = {
  jump: "yellow",
  lifecycle: "green",
  console: "blue",
  event: "purple",
  document: "pink",
  variable: "orange",
  conditional: "red",
  loop: "cyan",
  math: "teal",
  logic: "gray",
  return: "gray",
};

export const objectDescriptions = {
  jump: "Jump",
  lifecycle: "Lifecycle",
  console: "Console",
  event: "Event",
  document: "Document",
  variable: "Variable",
  conditional: "Conditional",
  loop: "Loop",
  math: "Math",
  logic: "Logic",
  return: "Return",
};

export const objectIcons = {
  lifecycle: "fa-solid fa-arrows-rotate",
  console: "fa-solid fa-terminal",
  event: "fa-solid fa-mouse-pointer",
  document: "fa-solid fa-file",
  variable: "fa-solid fa-database",
  conditional: "fa-solid fa-code",
  loop: "fa-solid fa-repeat",
  math: "fa-solid fa-calculator",
  logic: "fa-solid fa-microchip",
  jump: "fa-solid fa-arrow-right",
  return: "fa-solid fa-arrow-left",
};

//7 from MDN
const primitiveTypes = [
  "string",
  "number",
  "bigint",
  "boolean",
  "undefined",
  "symbol",
  "null",
];

const primitiveTypeColors = {
  string: "orange",
  number: "blue",
  bigint: "purple",
  boolean: "red",
  undefined: "gray",
  symbol: "yellow",
  null: "gray",
};

const otherTypes = ["any", "array", "object", "function"];

const otherTypeColors = {
  any: "gray",
  array: "green",
  object: "cyan",
  function: "pink",
};

export const types = [...primitiveTypes, ...otherTypes];

export const typeColors = {
  ...primitiveTypeColors,
  ...otherTypeColors,
};
