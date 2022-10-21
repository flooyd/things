import { writable } from "svelte/store";

export const width = writable(0);
export const height = writable(0);
export const client = writable(null);
export const db = writable(null);
export const elementTooltipId = writable(null);
export const clickedElement = writable(null);
export const elementsHovered = writable([]);
export const loading = writable(false);
export const functionsTooltipOpen = writable(false);
export const htmlTooltipOpen = writable(false);
export const variablesStoresTooltipOpen = writable(false);
export const showGrid = writable(false);
export const fullscreen = writable(false);
export const hideUI = writable(false);
export const mousePosition = writable({ x: 0, y: 0 });
export const parentOfChildPendingDeletion = writable(null);
export const childPendingDeletion = writable(null);
export const global = writable<any>({});
export const outArrowClicked = writable(null);
export const inArrowClicked = writable(null);
export const functionMoving = writable(null);
export const showToolbar = writable(true);
export const toolbarOpenStyle = writable(null);
export const mouseDownStartedOnArrow = writable(false);
export const gridConnectionLocationsUpdatePending = writable(false);
export const windowScrollX = writable(0);
export const windowScrollY = writable(0);
export const lastInteractedWith = writable(null);
export const variablesStore = writable([]);
export const variableUpdated = writable(null);

//export update function for elements
export function updateLoading(newValue) {
  loading.set(newValue);
}

export function updateGlobal(key, value) {
  global.update((g) => {
    g[key] = value;
    return g;
  });
}
