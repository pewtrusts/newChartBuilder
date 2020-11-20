import { writable, derived } from 'svelte/store';
import brandOptions from './brand-options.json';
const CellBeingEdited = writable(null);
const XAxisType = writable('linear');
const ChartType = writable(brandOptions.defaultChartType);
const ActiveSection = writable('data');
const UserOptions = writable({});
const SelectedColorPalette = writable('default');
const ColorIndeces = writable(undefined);

const SeriesCount = derived([UserOptions], ([userOptions]) => !userOptions.series ? 0 : userOptions.series.length);


export {
    ActiveSection, 
    CellBeingEdited, 
    ChartType, 
    ColorIndeces,
    SelectedColorPalette, 
    SeriesCount,
    UserOptions, 
    XAxisType
};