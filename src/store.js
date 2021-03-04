import hash from './griffin/scripts/hash';
import { writable, derived } from 'svelte/store';
import baseConfig from './base-chart-config.json';
export const newChartConfig = {
    config: "{\"highchartsConfig\":{\"title\":null,\"chart\":{\"type\":\"column\"},\"credits\":{\"enabled\":false},\"yAxis\":{\"title\":null},\"series\":[{\"name\":\"Apples\",\"data\":[{\"y\":2},{\"y\":1},{\"y\":15}],\"colorIndex\":0},{\"name\":\"Oranges\",\"data\":[{\"y\":13},{\"y\":7},{\"y\":5}],\"colorIndex\":1},{\"name\":\"Peaches\",\"data\":[{\"y\":4},{\"y\":10},{\"y\":2}],\"colorIndex\":2}],\"xAxis\":{\"title\":{\"text\":\"Harvest\"},\"type\":\"category\",\"categories\":[\"Spring\",\"Summer\",\"Fall\"]}},\"griffinConfig\":{\"chartCredit\":\"© 2021 The Pew Charitable Trusts and the Urban Institute\",\"chartDescription\":\"Bar chart showing that most apples are harvested in the fall.\",\"chartLabel\":\"Figure 1\",\"chartNotes\":\"Some of the increase in apples harvested is due to unusually high rainfall in September. See <a href=\\\"http://example.com\\\">this report</a>.\",\"chartSources\":\"Source: John Adams, <em>Economics</em>, 1789.\",\"chartSubtitle\":\"Fruits by season\",\"chartTitle\":\"Most Apples Are Harvested in the Fall\",\"customColors\":[],\"selectedColorPalette\":\"default\"}}",
};
export const PrintWidth = writable(undefined);
export const PrintHeight = writable(undefined);
export const CellBeingEdited = writable(null);
export const XAxisType = writable('linear');
export const ChartType = writable(baseConfig.chart.type);
export const ActiveSection = writable('start');
export const UserOptions = writable({});
export const ExportType = writable('static');
export const ChartHasBeenSaved = writable(false);

UserOptions.subscribe(v => {
    ChartHasBeenSaved.set(false);
    if (!v || !v.chart || !v.chart.type) return;
    ChartType.set(v.chart.type);
});
export const DatatableData = writable([]);
export const ImageDataUri = writable('');
export const SelectedColorPalette = writable('default');
export const ColorIndeces = writable(undefined);
export const Indicators = writable({});
export const IsWorking = writable(false);
export const ColorByPoint = writable([]);
export const SeriesCountFromTable = derived([DatatableData], ([datatableData]) => datatableData.length - 1);
                                            /* SeriesCountFromTable is # of series from data passed in by user.
                                             SeriesCount is # series sent to the Chart instance. e.g., pie charts
                                             only pass in one series regardless of the SeriesCountFromTable */
export const CustomColors = writable([]);
export const ChartCredit = writable(`© ${new Date().getFullYear()} The Pew Charitable Trusts`);
export const ChartDescription = writable('');
export const ChartLabel = writable('');
export const ChartNotes = writable('');
export const ChartTitle = writable('');
export const ChartSources = writable('');
export const ChartSubtitle = writable('');
export const LoadedDataConfig = writable('');
export const Picture = writable('');
export const PictureIsMissingOrOld = writable(true);
export const Thumbnail = writable('');
export const SeriesCount = derived([UserOptions], ([userOptions]) => !userOptions.series ? 0 : userOptions.series.length);
export const SeriesCountMismatch = derived([SeriesCountFromTable, SeriesCount], ([seriesCountFromTable, seriesCount]) => seriesCountFromTable != seriesCount);
export const MaxPointCount = derived([UserOptions], ([userOptions]) => {
    if ( !userOptions.series ){
        return 0;
    }
    return Math.max(...userOptions.series.map(d => d.data.length));
});
export const ColorCount = derived([MaxPointCount,ColorByPoint, SeriesCount], ([maxPointCount, colorByPoint, seriesCount]) => {
    if (colorByPoint[0] == true){
        return maxPointCount;
    }
    return seriesCount;
});
export const ChartPaletteClassname = derived([SelectedColorPalette,CustomColors], ([selectedPalette, customColors]) => {
    if (selectedPalette !== 'custom') {
        return selectedPalette;
    }
    const rtn = `cc${hash(customColors.join(''))}`;
    return rtn;
});
export const Classes = derived([ChartPaletteClassname], function(){
    return arguments[0];
});
/**
 * to do: when there's a series count mismatch, append the datatable data to the griffin config so it can be loaded back in
 */
export const GriffinConfig = derived([
    ChartCredit,
    ChartDescription, 
    ChartLabel, 
    ChartNotes,
    ChartPaletteClassname,
    ChartSources, 
    ChartSubtitle,
    ChartTitle,
    CustomColors,
    DatatableData,
    SeriesCountMismatch 
], ([
    chartCredit,
    chartDescription, 
    chartLabel, 
    chartNotes,
    chartPaletteClassname,
    chartSources, 
    chartSubtitle,
    chartTitle,
    customColors,
    datatableData,
    seriesCountMismatch 
]) => {
    const obj =  {
        chartCredit,
        chartDescription, 
        chartLabel, 
        chartNotes,
        chartPaletteClassname,
        chartSources, 
        chartSubtitle,
        chartTitle,
        customColors,
        datatableData 
    };
    if (!seriesCountMismatch){
        delete obj.datatableData;
    }
    delete obj.chartCredit;
    delete obj.chartDescription;
    delete obj.chartNotes;
    delete obj.chartSources;
    PictureIsMissingOrOld.set(true);
    return obj;
});
GriffinConfig.subscribe(() => {
    ChartHasBeenSaved.set(false);
});
//project	type	hed	timestamp	config	user_email	user_id	name	user_id	thumbnail
export const SavingChartData = derived([ChartType, ChartTitle, UserOptions, GriffinConfig, Thumbnail], ([chartType, chartTitle, userOptions, griffinConfig, thumbnail]) => {
    return {
        type: chartType,
        hed: chartTitle,
        config: JSON.stringify({
            highchartsConfig: userOptions,
            griffinConfig
        }),
        thumbnail
    };
});
export const CodeExport = derived([
    ChartCredit,
    ChartDescription, 
    ChartLabel, 
    ChartNotes,
    ChartTitle, 
    ChartSources,
    ChartSubtitle,
    Classes, 
    Picture,
    UserOptions, 
    GriffinConfig,
    ExportType
], ([
    chartCredit,
    chartDescription,
    chartLabel, 
    chartNotes,
    chartTitle, 
    chartSources,
    chartSubtitle,
    classes,
    picture,
    userOptions, 
    griffinConfig,
    exportType
]) => {
    const hashTitle = chartTitle ? hash(chartTitle) : null;
    return `<figure${chartTitle ? ' aria-labelledby="heading-' + hashTitle + '"' : ''}${chartDescription ? ` aria-describedby="description-${hashTitle || hash(chartDescription)}"` : ''} class="ai2html-griffin-figure griffin-figure${exportType == 'dynamic' ? ' js-griffin' : ''}">
    <meta name="format-detection" content="telephone=no">${ chartLabel || chartTitle || chartSubtitle ? `
    <header>${chartLabel ? `
        <span class="figure-label">${chartLabel}</span>` : ''}${chartTitle ? `
        <h1 id="heading-${hashTitle}">${chartTitle}</h1>` : ''}${chartSubtitle ? `
        <p class="figure-dek">${chartSubtitle}</p>` : ''}
    </header>` : ''}${chartDescription ? `
    <p id="description-${hashTitle ? hashTitle : hash(chartDescription)}" class="visually-hidden">${chartDescription}</p>` : ''}
    <pre class="js-griffin-config" style="display: none;">
    ${JSON.stringify({
        highchartsConfig: userOptions,
        griffinConfig 
    })}
    </pre>
    <div aria-hidden="true" class="js-hc-container hc-container ${classes.join(' ')}">
        ${picture}
    </div>${ chartNotes || chartSources || chartCredit ? `
    <figcaption>${chartNotes ? `
        <p class="figure-note">
            ${chartNotes}
        </p>` : ''}${chartSources ? `
        <p class="figure-note figure-note--source">
            ${chartSources}
        </p>` : ''}${chartCredit ? `
        <p class="figure-note figure-note--source">
            ${chartCredit}
        </p>` : ''}
    </figcaption>` : ''}
</figure>`;
});

export const importConfig = {
    ChartCredit,
    ChartDescription,
    SelectedColorPalette,
    ChartLabel,
    ChartNotes,
    ChartSources,
    ChartSubtitle,
    ChartTitle,
    ChartType,
    ColorByPoint,
    ColorIndeces,
    CustomColors,
    UserOptions
};
