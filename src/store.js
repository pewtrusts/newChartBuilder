import { writable, derived } from 'svelte/store';
import brandOptions from './brand-options.json';
const CellBeingEdited = writable(null);
const XAxisType = writable('linear');
const ChartType = writable(brandOptions.defaultChartType);
const ActiveSection = writable('data');
const UserOptions = writable({});
const SelectedColorPalette = writable('default');
const ColorIndeces = writable(undefined);
const Indicators = writable({});
const ColorByPoint = writable([]);

const SeriesCount = derived([UserOptions], ([userOptions]) => !userOptions.series ? 0 : userOptions.series.length);
const SeriesCountMismatch = derived([SeriesCount, ChartType], ([seriesCount, chartType]) => seriesCount > 1 && chartType == 'pie');

export {
    ActiveSection, 
    CellBeingEdited, 
    ChartType, 
    ColorByPoint,
    ColorIndeces,
    Indicators,
    SelectedColorPalette, 
    SeriesCount,
    SeriesCountMismatch,
    UserOptions, 
    XAxisType
};