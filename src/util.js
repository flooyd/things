import { v4 as uuidv4 } from "uuid";
//import collection, addDoc
import { updateLoading, clickedElement } from "./stores/globals";
import { elements as elementsStore, updateElements } from "./stores/elements";
import { get } from "svelte/store";

export const getId = () => {
  return uuidv4();
};

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
  // let newElement = updatedDocJson;
  // updateElements(
  //   elements.map((element) => {
  //     if (element._id === newElement._id) {
  //       return newElement;
  //     } else {
  //       return element;
  //     }
  //   })
  // );
  updateLoading(false);
};

//fetch all functions
export const fetchFunctions = async () => {
  updateLoading(true);
  const functions = await fetch("http://localhost:3000/functions");
  const functionsJson = await functions.json();
  updateLoading(false);
  return functionsJson;
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

export const addFunction = async (
  elementId,
  name,
  rectX,
  rectY,
  isVariable = false,
  variableId = null
) => {
  updateLoading(true);
  const functions = await fetch("http://localhost:3000/functions/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      elementId,
      rectX,
      rectY,
      isVariable,
      variableId,
    }),
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
  try {
    const functions = await fetch(
      "http://localhost:3000/functions/" + functionId,
      {
        method: "DELETE",
      }
    );
    updateLoading(false);
    return true;
  } catch (error) {
    updateLoading(false);
    return false;
  }
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

export const saveFunction = async (functionId, pendingDelete) => {
  if (pendingDelete) return;
  const functions = get(clickedElement).grid.functions;
  const functionToSave = functions.find((func) => func._id === functionId);
  const functionFlattend = {
    _id: functionToSave._id,
    name: functionToSave.name,
    elementId: functionToSave.elementId,
    rectX: functionToSave.rect.x,
    rectY: functionToSave.rect.y,
    inArrowX: functionToSave.rect.inArrowLocation.x,
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
    "http://localhost:3000/connections/deleteAll/forElement/" + elementId,
    {
      method: "DELETE",
    }
  );
  updateLoading(false);
};

export const deleteAllConnectionsForFunction = async (functionId) => {
  updateLoading(true);
  try {
    const connections = await fetch(
      "http://localhost:3000/connections/deleteAll/forFunction/" + functionId,
      {
        method: "DELETE",
      }
    );
    updateLoading(false);
    return true;
  } catch (error) {
    updateLoading(false);
    return false;
  }
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
//{in: functionId, out: functionId, elementId: elementId, inVariableId: variableId, outVariableId: variableId}
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

export const getVariablesForElement = async (elementId) => {
  updateLoading(true);
  const variables = await fetch(
    "http://localhost:3000/function-vars/forElement/" + elementId
  );
  const variablesJson = await variables.json();
  updateLoading(false);
  return variablesJson;
};

export const addVariableForElement = async (elementId, variable) => {
  variable.elementId = elementId;
  updateLoading(true);
  const createdVariable = await fetch("http://localhost:3000/function-vars/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ variable }),
  });
  if (createdVariable.ok) {
    const variableJson = await createdVariable.json();
    updateLoading(false);
    return variableJson;
  } else {
    updateLoading(false);
    return null;
  }
};

export const updateVariableForElement = async (elementId, variable) => {
  variable.elementId = elementId;
  updateLoading(true);
  const updatedVariable = await fetch(
    "http://localhost:3000/function-vars/" + variable._id,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ variable }),
    }
  );
  if (updatedVariable.ok) {
    const variableJson = await updatedVariable.json();
    updateLoading(false);
    return variableJson;
  } else {
    updateLoading(false);
    return null;
  }
};

//function vars
const createGridFunctionVar = async (body) => {
  updateLoading(true);
  const addedDoc = await fetch("http://localhost:3000/function-vars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const addedDocJson = await addedDoc.json();
  updateLoading(false);
  return addedDocJson;
};

const updateGridFunctionVar = async (id, body) => {
  updateLoading(true);
  const updatedDoc = await fetch("http://localhost:3000/function-vars/id", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const updatedDocJson = await updatedDoc.json();
  updateLoading(false);
  return updatedDocJson;
};

const deleteGridFunctionVar = async (id) => {
  updateLoading(true);
  const deletedDoc = await fetch("http://localhost:3000/function-vars/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const deletedDocJson = await deletedDoc.json();
  updateLoading(false);
  return deletedDocJson;
};

//delete grid function vars for element
const deleteGridFunctionVarsForElement = async (elementId) => {
  updateLoading(true);
  const deletedDocs = await fetch(
    "http://localhost:3000/function-vars/forElement/" + elementId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const deletedDocsJson = await deletedDocs.json();
  updateLoading(false);
  return deletedDocsJson;
};

//delete grid function vars for function
const deleteGridFunctionVarsForFunction = async (functionId) => {
  updateLoading(true);
  const deletedDocs = await fetch(
    "http://localhost:3000/function-vars/forFunction/" + functionId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const deletedDocsJson = await deletedDocs.json();
  updateLoading(false);
  return deletedDocsJson;
};

const deleteAllGridFunctionVars = async () => {
  updateLoading(true);
  const deletedDocs = await fetch("http://localhost:3000/function-vars", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const deletedDocJson = await deletedDocs.json();
  updateLoading(false);
  return deletedDocJson;
};

const getAllGridFunctionVars = async () => {
  updateLoading(true);
  const docs = await fetch("http://localhost:3000/function-vars");
  const docsJson = await docs.json();
  updateLoading(false);
  return docsJson;
};

const getGridFunctionVarsForFunction = async (functionId) => {
  updateLoading(true);
  const docs = await fetch(
    "http://localhost:3000/function-vars/forFunction/" + functionId
  );
  const docsJson = await docs.json();
  updateLoading(false);
  return docsJson;
};

//for element
const getAllGridFunctionVarsForElement = async (elementId) => {
  updateLoading(true);
  const docs = await fetch(
    "http://localhost:3000/function-vars/forElement/" + elementId
  );
  const docsJson = await docs.json();
  updateLoading(false);
  return docsJson;
};

const getGridFunctionVar = async (id) => {
  updateLoading(true);
  const doc = await fetch("http://localhost:3000/function-vars/" + id);
  const docJson = await doc.json();
  updateLoading(false);
  return docJson;
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
  element: "brown",
};

export const types = [...primitiveTypes, ...otherTypes];

export const typeColors = {
  ...primitiveTypeColors,
  ...otherTypeColors,
};

export const epicFunctions = {
  onMount: {
    name: "onMount",
    category: "lifecycle",
    categoryColor: "green",
    categoryDescription: "Lifecycle",
    categoryIcon: "fa-solid fa-arrows-rotate",
    executable: false,
    description: "runs when the component is mounted",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  afterUpdate: {
    name: "afterUpdate",
    category: "lifecycle",
    categoryColor: "green",
    categoryDescription: "Lifecycle",
    categoryIcon: "fa-solid fa-arrows-rotate",
    executable: false,
    description: "runs after the component is updated",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  beforeUpdate: {
    name: "beforeUpdate",
    category: "lifecycle",
    categoryColor: "green",
    categoryDescription: "Lifecycle",
    categoryIcon: "fa-solid fa-arrows-rotate",
    executable: false,
    description: "runs before the component is updated",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  beforeDestroy: {
    name: "beforeDestroy",
    category: "lifecycle",
    categoryColor: "green",
    categoryDescription: "Lifecycle",
    categoryIcon: "fa-solid fa-arrows-rotate",
    executable: false,
    description: "runs before the component is destroyed",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  afterDestroy: {
    name: "afterDestroy",
    category: "lifecycle",
    categoryColor: "green",
    categoryDescription: "Lifecycle",
    categoryIcon: "fa-solid fa-arrows-rotate",
    executable: false,
    description: "runs after the component is destroyed",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  log: {
    name: "log",
    category: "console",
    categoryColor: "blue",
    categoryDescription: "Console",
    categoryIcon: "fa-solid fa-terminal",
    executable: true,
    description: "logs a message to the console",
    inputs: {
      count: 1,
      types: ["any"],
      names: ["message1"],
      description: "the message to log",
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  logError: {
    name: "logError",
    category: "console",
    categoryColor: "blue",
    categoryDescription: "Console",
    categoryIcon: "fa-solid fa-terminal",
    executable: true,
    description: "logs an error to the console",
    inputs: {
      count: 1,
      types: ["any"],
      names: ["message1"],
      description: "the error to log",
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  logWarning: {
    name: "logWarning",
    category: "console",
    categoryColor: "blue",
    categoryDescription: "Console",
    categoryIcon: "fa-solid fa-terminal",
    executable: true,
    description: "logs a warning to the console",
    inputs: {
      count: 1,
      types: ["any"],
      names: ["message1"],
      description: "the warning to log",
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  logInfo: {
    name: "logInfo",
    category: "console",
    categoryColor: "blue",
    categoryDescription: "Console",
    categoryIcon: "fa-solid fa-terminal",
    executable: true,
    description: "logs an info message to the console",
    inputs: {
      count: 1,
      types: ["any"],
      names: ["message1"],
      description: "the info message to log",
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  onClick: {
    name: "onClick",
    category: "event",
    categoryColor: "purple",
    categoryDescription: "Event",
    categoryIcon: "fa-solid fa-mouse-pointer",
    executable: false,
    description: "runs when the component is clicked",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  onDblClick: {
    name: "onDblClick",
    category: "event",
    categoryColor: "purple",
    categoryDescription: "Event",
    categoryIcon: "fa-solid fa-mouse-pointer",
    executable: false,
    description: "runs when the component is double clicked",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  onMouseDown: {
    name: "onMouseDown",
    category: "event",
    categoryColor: "purple",
    categoryDescription: "Event",
    categoryIcon: "fa-solid fa-mouse-pointer",
    executable: false,
    description: "runs when the mouse is pressed down on the component",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  onMouseUp: {
    name: "onMouseUp",
    category: "event",
    categoryColor: "purple",
    categoryDescription: "Event",
    categoryIcon: "fa-solid fa-mouse-pointer",
    executable: false,
    description: "runs when the mouse is released on the component",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  onMouseEnter: {
    name: "onMouseEnter",
    category: "event",
    categoryColor: "purple",
    categoryDescription: "Event",
    categoryIcon: "fa-solid fa-mouse-pointer",
    executable: false,
    description: "runs when the mouse enters the component",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  onMouseLeave: {
    name: "onMouseLeave",
    category: "event",
    categoryColor: "purple",
    categoryDescription: "Event",
    categoryIcon: "fa-solid fa-mouse-pointer",
    executable: false,
    description: "runs when the mouse leaves the component",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  onMouseMove: {
    name: "onMouseMove",
    category: "event",
    categoryColor: "purple",
    categoryDescription: "Event",
    categoryIcon: "fa-solid fa-mouse-pointer",
    executable: false,
    description: "runs when the mouse moves over the component",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  onContextMenu: {
    name: "onContextMenu",
    category: "event",
    categoryColor: "purple",
    categoryDescription: "Event",
    categoryIcon: "fa-solid fa-mouse-pointer",
    executable: false,
    description: "runs when the context menu is opened on the component",
    inputs: {
      count: 0,
      types: [],
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  getElementsByName: {
    name: "getElementsByName",
    category: "document",
    categoryColor: "pink",
    categoryDescription: "Document",
    categoryIcon: "fa-solid fa-file",
    executable: true,
    description: "gets all elements with a given name",
    inputs: {
      count: 1,
      types: ["string"],
      names: ["name"],
      description: "the name of the elements to get",
    },
    outputs: {
      count: 1,
      types: ["array"],
    },
  },
  getElementById: {
    name: "getElementById",
    category: "document",
    categoryColor: "pink",
    categoryDescription: "Document",
    categoryIcon: "fa-solid fa-file",
    executable: true,
    description: "gets an element by id",
    inputs: {
      count: 1,
      types: ["string"],
      names: ["id"],
      description: "the id of the element to get",
    },
    outputs: {
      count: 1,
      types: ["object"],
    },
  },
  getElementsByClassName: {
    name: "getElementsByClassName",
    category: "document",
    categoryColor: "pink",
    categoryDescription: "Document",
    categoryIcon: "fa-solid fa-file",
    executable: true,
    description: "gets all elements with a given class name",
    inputs: {
      count: 1,
      types: ["string"],
      names: ["className"],
      description: "the class name of the elements to get",
    },
    outputs: {
      count: 1,
      types: ["array"],
    },
  },
  getElementsByTagName: {
    name: "getElementsByTagName",
    category: "document",
    categoryColor: "pink",
    categoryDescription: "Document",
    categoryIcon: "fa-solid fa-file",
    executable: true,
    description: "gets all elements with a given tag name",
    inputs: {
      count: 1,
      types: ["string"],
      names: ["tagName"],
      description: "the tag name of the elements to get",
    },
    outputs: {
      count: 1,
      types: ["array"],
    },
  },
  setStyle: {
    name: "setStyle",
    category: "element",
    categoryColor: "brown",
    categoryDescription: "Element",
    categoryIcon: "fa-solid fa-square",
    executable: true,
    description: "sets the style of the component",
    inputs: {
      count: 3,
      types: ["string", "string", "element"],
      names: ["property", "value", "element"],
      optional: [false, false, true],
      description:
        "the style and value to set, optionally the element to set it on",
    },
    outputs: {
      count: 1,
      types: ["object"],
    },
  },
  getStyle: {
    name: "getStyle",
    category: "element",
    categoryColor: "brown",
    categoryDescription: "Element",
    categoryIcon: "fa-solid fa-square",
    executable: true,
    description: "gets the style of the component",
    inputs: {
      count: 2,
      types: ["string", "element"],
      names: ["property", "element"],
      optional: [false, true],
      description: "the style to get, optionally the element to get it from",
    },
    outputs: {
      count: 1,
      types: ["object"],
    },
  },
  setAttribute: {
    name: "setAttribute",
    category: "element",
    categoryColor: "brown",
    categoryDescription: "Element",
    categoryIcon: "fa-solid fa-square",
    executable: true,
    description: "sets an attribute of the component",
    inputs: {
      count: 3,
      types: ["string", "string", "element"],
      names: ["attribute", "value", "element"],
      optional: [false, false, true],
      description:
        "the attribute and value to set, optionally the element to set it on",
    },
    outputs: {
      count: 1,
      types: ["string"],
    },
  },
  getAttribute: {
    name: "getAttribute",
    category: "element",
    categoryColor: "brown",
    categoryDescription: "Element",
    categoryIcon: "fa-solid fa-square",
    executable: true,
    description: "gets an attribute of the component",
    inputs: {
      count: 2,
      types: ["string", "element"],
      names: ["attribute", "element"],
      optional: [false, true],
      description:
        "the attribute to get, optionally the element to get it from",
    },
    outputs: {
      count: 1,
      types: ["string"],
    },
  },
  setVariable: {
    name: "setVariable",
    category: "variable",
    categoryColor: "orange",
    categoryDescription: "Variable",
    categoryIcon: "fa-solid fa-database",
    executable: true,
    description: "sets a variable",
    inputs: {
      count: 2,
      types: ["string", "any"],
      names: ["name", "value"],
      description: "the name of the variable to set",
      description2: "the value of the variable to set",
    },
    outputs: {
      count: 1,
      types: ["any"],
    },
  },
  getVariable: {
    name: "getVariable",
    category: "variable",
    categoryColor: "orange",
    categoryDescription: "Variable",
    categoryIcon: "fa-solid fa-database",
    executable: true,
    description: "gets a variable",
    inputs: {
      count: 1,
      types: ["string"],
      names: ["name"],
      description: "the name of the variable to get",
    },
    outputs: {
      count: 1,
      types: ["any"],
    },
  },
  if: {
    name: "if",
    category: "conditional",
    categoryColor: "red",
    categoryDescription: "Conditional",
    categoryIcon: "fa-solid fa-code",
    executable: true,
    description: "runs a block of code if a condition is true",
    inputs: {
      count: 1,
      types: ["boolean"],
      names: ["condition"],
      description: "the condition to check",
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  elseIf: {
    name: "elseIf",
    category: "conditional",
    categoryColor: "red",
    categoryDescription: "Conditional",
    categoryIcon: "fa-solid fa-code",
    executable: true,
    description:
      "runs a block of code if a condition is true and the previous if statement was false",
    inputs: {
      count: 1,
      types: ["boolean"],
      names: ["condition"],
      description: "the condition to check",
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  else: {
    name: "else",
    category: "conditional",
    categoryColor: "red",
    categoryDescription: "Conditional",
    categoryIcon: "fa-solid fa-code",
    executable: true,
    description: "runs a block of code if a condition is false",
    inputs: {
      count: 0,
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  for: {
    name: "for",
    category: "loop",
    categoryColor: "cyan",
    categoryDescription: "Loop",
    categoryIcon: "fa-solid fa-repeat",
    executable: true,
    description: "runs a block of code a given number of times",
    inputs: {
      count: 1,
      types: ["number"],
      names: ["count"],
      description: "the number of times to run the code",
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  forEach: {
    name: "forEach",
    category: "loop",
    categoryColor: "cyan",
    categoryDescription: "Loop",
    categoryIcon: "fa-solid fa-repeat",
    executable: true,
    description: "runs a block of code for each item in an array",
    inputs: {
      count: 1,
      types: ["array"],
      names: ["array"],
      description: "the array to loop through",
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  while: {
    name: "while",
    category: "loop",
    categoryColor: "cyan",
    categoryDescription: "Loop",
    categoryIcon: "fa-solid fa-repeat",
    executable: true,
    description: "runs a block of code while a condition is true",
    inputs: {
      count: 1,
      types: ["boolean"],
      names: ["condition"],
      description: "the condition to check",
    },
    outputs: {
      count: 0,
      types: [],
    },
  },
  add: {
    name: "add",
    category: "math",
    categoryColor: "teal",
    categoryDescription: "Math",
    categoryIcon: "fa-solid fa-calculator",
    executable: true,
    description: "adds two numbers",
    inputs: {
      count: 2,
      types: ["number", "number"],
      names: ["number1", "number2"],
      description: "the numbers to add",
    },
    outputs: {
      count: 1,
      types: ["number"],
    },
  },
  subtract: {
    name: "subtract",
    category: "math",
    categoryColor: "teal",
    categoryDescription: "Math",
    categoryIcon: "fa-solid fa-calculator",
    executable: true,
    description: "subtracts two numbers",
    inputs: {
      count: 2,
      types: ["number", "number"],
      description: "the numbers to subtract",
    },
    outputs: {
      count: 1,
      types: ["number"],
    },
  },
  multiply: {
    name: "multiply",
    category: "math",
    categoryColor: "teal",
    categoryDescription: "Math",
    categoryIcon: "fa-solid fa-calculator",
    executable: true,
    description: "multiplies two numbers",
    inputs: {
      count: 2,
      types: ["number", "number"],
      description: "the numbers to multiply",
    },
    outputs: {
      count: 1,
      types: ["number"],
    },
  },
  divide: {
    name: "divide",
    category: "math",
    categoryColor: "teal",
    categoryDescription: "Math",
    categoryIcon: "fa-solid fa-calculator",
    executable: true,
    description: "divides two numbers",
    inputs: {
      count: 2,
      types: ["number", "number"],
      description: "the numbers to divide",
    },
    outputs: {
      count: 1,
      types: ["number"],
    },
  },
  modulo: {
    name: "modulo",
    category: "math",
    categoryColor: "teal",
    categoryDescription: "Math",
    categoryIcon: "fa-solid fa-calculator",
    executable: true,
    description: "returns the remainder of two numbers",
    inputs: {
      count: 2,
      types: ["number", "number"],
      names: ["number1", "number2"],
      description: "the numbers to get the remainder of",
    },
    outputs: {
      count: 1,
      types: ["number"],
    },
  },
  power: {
    name: "power",
    category: "math",
    categoryColor: "teal",
    categoryDescription: "Math",
    categoryIcon: "fa-solid fa-calculator",
    executable: true,
    description: "raises a number to a power",
    inputs: {
      count: 2,
      types: ["number", "number"],
      names: ["number1", "number2"],
      description: "the numbers to get the power of",
    },
    outputs: {
      count: 1,
      types: ["number"],
    },
  },
  and: {
    name: "and",
    category: "logic",
    categoryColor: "gray",
    categoryDescription: "Logic",
    categoryIcon: "fa-solid fa-microchip",
    executable: true,
    description: "returns true if both values are true",
    inputs: {
      count: 2,
      types: ["boolean", "boolean"],
      names: ["boolean1", "boolean2"],
      description: "the booleans to check",
    },
    outputs: {
      count: 1,
      types: ["boolean"],
    },
  },
  or: {
    name: "or",
    category: "logic",
    categoryColor: "gray",
    categoryDescription: "Logic",
    categoryIcon: "fa-solid fa-microchip",
    executable: true,
    description: "returns true if either value is true",
    inputs: {
      count: 2,
      types: ["boolean", "boolean"],
      names: ["boolean1", "boolean2"],
      description: "the booleans to check",
    },
    outputs: {
      count: 1,
      types: ["boolean"],
    },
  },
  not: {
    name: "not",
    category: "logic",
    categoryColor: "gray",
    categoryDescription: "Logic",
    categoryIcon: "fa-solid fa-microchip",
    executable: true,
    description: "returns the opposite of the value",
    inputs: {
      count: 1,
      types: ["boolean"],
      names: ["boolean"],
      description: "the boolean to check",
    },
    outputs: {
      count: 1,
      types: ["boolean"],
    },
  },
  greaterThan: {
    name: "greaterThan",
    category: "logic",
    categoryColor: "gray",
    categoryDescription: "Logic",
    categoryIcon: "fa-solid fa-microchip",
    executable: true,
    description: "returns true if the first value is greater than the second",
    inputs: {
      count: 2,
      types: ["number", "number"],
      names: ["number1", "number2"],
      description: "the numbers to check",
    },
    outputs: {
      count: 1,
      types: ["boolean"],
    },
  },
  lessThan: {
    name: "lessThan",
    category: "logic",
    categoryColor: "gray",
    categoryDescription: "Logic",
    categoryIcon: "fa-solid fa-microchip",
    executable: true,
    description: "returns true if the first value is less than the second",
    inputs: {
      count: 2,
      types: ["number", "number"],
      names: ["number1", "number2"],
      description: "the numbers to check",
    },
    outputs: {
      count: 1,
      types: ["boolean"],
    },
  },
  greaterThanOrEqual: {
    name: "greaterThanOrEqual",
    category: "logic",
    categoryColor: "gray",
    categoryDescription: "Logic",
    categoryIcon: "fa-solid fa-microchip",
    executable: true,
    description:
      "returns true if the first value is greater than or equal to the second",
    inputs: {
      count: 2,
      types: ["number", "number"],
      names: ["number1", "number2"],
      description: "the numbers to check",
    },
    outputs: {
      count: 1,
      types: ["boolean"],
    },
  },
  lessThanOrEqual: {
    name: "lessThanOrEqual",
    category: "logic",
    categoryColor: "gray",
    categoryDescription: "Logic",
    categoryIcon: "fa-solid fa-microchip",
    executable: true,
    description:
      "returns true if the first value is less than or equal to the second",
    inputs: {
      count: 2,
      types: ["number", "number"],
      names: ["number1", "number2"],
      description: "the numbers to check",
    },
    outputs: {
      count: 1,
      types: ["boolean"],
    },
  },
  equal: {
    name: "equal",
    category: "logic",
    categoryColor: "gray",
    categoryDescription: "Logic",
    categoryIcon: "fa-solid fa-microchip",
    executable: true,
    description: "returns true if the two values are equal",
    inputs: {
      count: 2,
      types: ["any", "any"],
      names: ["value1", "value2"],
      description: "the values to check",
    },
    outputs: {
      count: 1,
      types: ["boolean"],
    },
  },
  notEqual: {
    name: "notEqual",
    category: "logic",
    categoryColor: "gray",
    categoryDescription: "Logic",
    categoryIcon: "fa-solid fa-microchip",
    executable: true,
    description: "returns true if the two values are not equal",
    inputs: {
      count: 2,
      types: ["any", "any"],
      names: ["value1", "value2"],
      description: "the values to check",
    },
    outputs: {
      count: 1,
      types: ["boolean"],
    },
  },
  break: {
    name: "break",
    category: "jump",
    categoryColor: "yellow",
    categoryDescription: "Jump",
    categoryIcon: "fa-solid fa-arrow-right",
    executable: true,
    description: "stops the current loop",
    inputs: null,
    outputs: null,
  },
  continue: {
    name: "continue",
    category: "jump",
    categoryColor: "yellow",
    categoryDescription: "Jump",
    categoryIcon: "fa-solid fa-arrow-right",
    executable: true,
    description:
      "stops the current iteration of the loop and continues to the next iteration",
    inputs: null,
    outputs: null,
  },
  return: {
    name: "return",
    category: "return",
    categoryColor: "gray",
    categoryDescription: "Return",
    categoryIcon: "fa-solid fa-arrow-left",
    executable: true,
    description: "returns a value from a function",
    inputs: null,
    outputs: null,
  },
};

export const cssProperties = [
  "accent-color",
  "align-content",
  "align-items",
  "align-self",
  "Experimentalalign-tracks",
  "all",
  "animation",
  "Experimentalanimation-composition",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "Experimentalanimation-timeline",
  "animation-timing-function",
  "appearance",
  "aspect-ratio",
  "backdrop-filter",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-position-x",
  "background-position-y",
  "background-repeat",
  "background-size",
  "block-size",
  "border",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-style",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-style",
  "border-block-start-width",
  "border-block-style",
  "border-block-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-style",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-style",
  "border-inline-start-width",
  "border-inline-style",
  "border-inline-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-start-end-radius",
  "border-start-start-radius",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-decoration-break",
  "box-shadow",
  "box-sizing",
  "break-after",
  "break-before",
  "break-inside",
  "caption-side",
  "caret-color",
  "clear",
  "Deprecatedclip",
  "clip-path",
  "color",
  "color-scheme",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "contain",
  "Experimentalcontain-intrinsic-block-size",
  "Experimentalcontain-intrinsic-height",
  "Experimentalcontain-intrinsic-inline-size",
  "Experimentalcontain-intrinsic-size",
  "Experimentalcontain-intrinsic-width",
  "content",
  "content-visibility",
  "counter-increment",
  "counter-reset",
  "counter-set",
  "cursor",
  "direction",
  "display",
  "empty-cells",
  "filter",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "font",
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-language-override",
  "font-optical-sizing",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-variant",
  "font-variant-alternates",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-variation-settings",
  "font-weight",
  "forced-color-adjust",
  "gap",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-start",
  "grid-row",
  "grid-row-end",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "hanging-punctuation",
  "height",
  "hyphenate-character",
  "hyphens",
  "image-orientation",
  "image-rendering",
  "Experimentalimage-resolution",
  "Deprecatedime-mode",
  "Experimentalinitial-letter",
  "Experimentalinitial-letter-align",
  "inline-size",
  "inset",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "isolation",
  "justify-content",
  "justify-items",
  "justify-self",
  "Experimentaljustify-tracks",
  "left",
  "letter-spacing",
  "line-break",
  "line-height",
  "Experimentalline-height-step",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "Experimentalmargin-trim",
  "mask",
  "mask-border",
  "mask-border-mode",
  "mask-border-outset",
  "mask-border-repeat",
  "mask-border-slice",
  "mask-border-source",
  "mask-border-width",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  "Experimentalmasonry-auto-flow",
  "Experimentalmath-depth",
  "Experimentalmath-shift",
  "Experimentalmath-style",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  "object-fit",
  "object-position",
  "offset",
  "offset-anchor",
  "offset-distance",
  "offset-path",
  "Experimentaloffset-position",
  "offset-rotate",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-anchor",
  "overflow-block",
  "overflow-clip-margin",
  "overflow-inline",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "overscroll-behavior",
  "overscroll-behavior-block",
  "overscroll-behavior-inline",
  "overscroll-behavior-x",
  "overscroll-behavior-y",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "paint-order",
  "perspective",
  "perspective-origin",
  "place-content",
  "place-items",
  "place-self",
  "pointer-events",
  "position",
  "print-color-adjust",
  "quotes",
  "resize",
  "right",
  "rotate",
  "row-gap",
  "Experimentalruby-align",
  "ruby-position",
  "scale",
  "scroll-behavior",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-align",
  "scroll-snap-stop",
  "scroll-snap-type",
  "Experimentalscroll-timeline",
  "Experimentalscroll-timeline-axis",
  "Experimentalscroll-timeline-name",
  "scrollbar-color",
  "scrollbar-gutter",
  "scrollbar-width",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "tab-size",
  "table-layout",
  "text-align",
  "text-align-last",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "Experimentaltext-decoration-skip",
  "text-decoration-skip-ink",
  "text-decoration-style",
  "text-decoration-thickness",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-indent",
  "text-justify",
  "text-orientation",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "Experimentaltext-size-adjust",
  "text-transform",
  "text-underline-offset",
  "text-underline-position",
  "top",
  "touch-action",
  "transform",
  "transform-box",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "translate",
  "unicode-bidi",
  "user-select",
  "vertical-align",
  "visibility",
  "white-space",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "writing-mode",
  "z-index",
];

export const cssObject = {
  experimental: cssProperties
    .map((prop) => {
      if (prop.startsWith("Experimental")) {
        return prop.replace("Experimental", "");
      }
    })
    .filter((prop) => prop),
  css: cssProperties.filter((prop) => {
    if (!prop.startsWith("Experimental")) {
      return prop;
    }
  }),
};
