import { writable } from "svelte/store";

//window width, height, fullscreen toggle, and scroll position, and toolbar open style
export const width = writable(0);
export const height = writable(0);
export const fullscreen = writable(false);
export const windowScrollX = writable(0);
export const windowScrollY = writable(0);
export const toolbarOpenStyle = writable(null);

//set when fetching data. for simplicity, we'll just use a single boolean for all data fetching
export const loading = writable(false);

//controls whether certain modals, the toolbar, or the programming grid are open
export const functionsModalOpen = writable(false);
export const htmlModalOpen = writable(false);
export const variablesStoresModalOpen = writable(false);
export const showGrid = writable(false);
export const showToolbar = writable(true);

//child and parent reassignment
export const parentOfChildPendingDeletion = writable(null);
export const childPendingDeletion = writable(null);
export const childAssignmentPending = writable(null);
export const pendingChildDropBackground = writable(null);

//element (things) editing
export const elementOnTheFrontBurner = writable(null);
export const lastInteractedWith = writable(null);
export const contextElement = writable(null);

//programming grid selection tool
export const usingSelectionTool = writable(false);
export const mousePosition = writable({ x: 0, y: 0 });
export const mouseDownStartedOnArrow = writable(false);
export const selectedFunctionIds = writable([]);

//programmming grid
export const componentOnTheFrontBurner = writable(null);
export const functionMoving = writable(null);
export const movingMultipleFunctions = writable(false);

//programming grid connections
export const outArrowClicked = writable(null);
export const inArrowClicked = writable(null);
export const outVariableClicked = writable(null);
export const inVariableClicked = writable(null);
export const outputClicked = writable(false);
export const gridConnectionLocationsUpdatePending = writable(0);

//variable modal logic
export const variablesStore = writable([]);
export const variableUpdated = writable(null);
export const variablesFetched = writable(false);

//things and such. These will be used to fetch all things and such
//and then used to populate the entire codebase
export const things = writable([]);
export const functions = writable([]);
export const variables = writable([]);
export const connections = writable([]);
