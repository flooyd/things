import { writable } from "svelte/store";

const tab = writable("Collections");

tab.subscribe((value) => value);

export default tab;
