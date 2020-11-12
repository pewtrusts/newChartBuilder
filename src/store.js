import { writable } from 'svelte/store';
const CellBeingEdited = writable(null);
const XAxisType = writable('linear');

export {
    CellBeingEdited, XAxisType
};