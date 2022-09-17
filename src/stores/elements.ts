import { writable } from "svelte/store";

export const elements = writable([]);
export const workingElement = writable(null);

//export update function for elements
export function updateElements(newElements) {
  elements.set(newElements);
}
