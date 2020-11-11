import { writable } from 'svelte/store';
const CellBeingEdited = writable(null);
const IsDateTime = writable(null);

export {
    CellBeingEdited, IsDateTime
};