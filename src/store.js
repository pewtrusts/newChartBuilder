import { writable } from 'svelte/store';
import brandOptions from './brand-options.json';
const CellBeingEdited = writable(null);
const XAxisType = writable('linear');
const ChartType = writable(brandOptions.defaultChartType);

export {
    CellBeingEdited, ChartType, XAxisType
};