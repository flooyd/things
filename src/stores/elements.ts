import { writable } from "svelte/store";

export const elements = writable([]);

elements.subscribe((value) => value);
