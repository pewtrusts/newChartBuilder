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
const SeriesCountFromTable = writable(0); /* SeriesCountFromTable is # of series from data passed in by user.
                                             SeriesCount is # series sent to the Chart instance. e.g., pie charts
                                             only pass in one series regardless of the SeriesCountFromTable */

const SeriesCount = derived([UserOptions], ([userOptions]) => !userOptions.series ? 0 : userOptions.series.length);
const SeriesCountMismatch = derived([SeriesCountFromTable, ChartType], ([seriesCount, chartType]) => seriesCount > 1 && chartType == 'pie');
const MaxPointCount = derived([UserOptions], ([userOptions]) => {
    if ( !userOptions.series ){
        return 0;
    }
    return Math.max(...userOptions.series.map(d => d.data.length));
});
const ColorCount = derived([MaxPointCount,ColorByPoint, SeriesCount], ([maxPointCount, colorByPoint, seriesCount]) => {
    if (colorByPoint[0] == true){
        return maxPointCount;
    }
    return seriesCount;
});

export {
    ActiveSection, 
    CellBeingEdited, 
    ChartType, 
    ColorByPoint,
    ColorCount,
    ColorIndeces,
    Indicators,
    MaxPointCount,
    SelectedColorPalette, 
    SeriesCount,
    SeriesCountFromTable,
    SeriesCountMismatch,
    UserOptions, 
    XAxisType
};