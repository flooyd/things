import { writable } from "svelte/store";

export const elements = writable(null);
export const workingElement = writable(null);
export const elementsPendingUpdate = writable(false);

//export update function for elements
export function updateElements(newElements) {
  elements.set(newElements);
}
