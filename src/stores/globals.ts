import { writable } from "svelte/store";

export const width = writable(0);
export const height = writable(0);
export const firebase = writable(null);
export const analytics = writable(null);
export const elementTooltipId = writable(null);

width.subscribe((value) => value);
