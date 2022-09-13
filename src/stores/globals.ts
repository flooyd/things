import { writable } from "svelte/store";

export const width = writable(0);
export const height = writable(0);
export const client = writable(null);
export const db = writable(null);
export const elementTooltipId = writable(null);

width.subscribe((value) => value);
