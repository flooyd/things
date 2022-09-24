import { writable } from "svelte/store";

export const width = writable(0);
export const height = writable(0);
export const client = writable(null);
export const db = writable(null);
export const elementTooltipId = writable(null);
export const mouseInTooltip = writable(false);
export const elementsHovered = writable([]);
export const altDown = writable(false);
export const awaitingFirebase = writable(false);
export const storesTooltipOpen = writable(false);
export const functionsTooltipOpen = writable(false);
export const global = writable<any>({});

//export update function for elements
export function updateAwaitingFirebase(newValue) {
  awaitingFirebase.set(newValue);
}

export function updateGlobal(key, value) {
  global.update((g) => {
    g[key] = value;
    return g;
  });
}
