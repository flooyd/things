import { writable } from "svelte/store";

export const elements = writable(null);
export const workingElement = writable(null);
export const elementsPendingUpdate = writable(false);
export const elementUpdated = writable(1);
export const visualizeDOM = writable(false);
export const elementOpenedInDOM = writable(null);
export const elementHoveredInDOMVisualizer = writable(null);
export const DOMReadyToScroll = writable(1);

//export update function for elements
export function updateElements(newElements) {
  elements.set(newElements);
}
