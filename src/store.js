import { writable } from 'svelte/store';
import brandOptions from './brand-options.json';
const CellBeingEdited = writable(null);
const XAxisType = writable('linear');
const ChartType = writable(brandOptions.defaultChartType);
const ActiveSection = writable('data');
const UserOptions = writable({});
const ColorPalette = writable('default');


export {
    ActiveSection, CellBeingEdited, ColorPalette, ChartType, UserOptions, XAxisType
};