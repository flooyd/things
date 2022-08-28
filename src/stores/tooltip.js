import { writable } from "svelte/store";

export const elementsButtonInside = writable(false);
export const elementsOpen = writable(false);
export const elementsInside = writable(false);

elementsOpen.subscribe((value) => value);
elementsInside.subscribe((value) => value);
