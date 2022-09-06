import { writable } from "svelte/store";

export const elements = writable([]);
export const workingElement = writable(null);

elements.subscribe((value) => value);
