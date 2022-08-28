import { writable } from "svelte/store";

export const okay = writable(false);

okay.subscribe((value) => value);
