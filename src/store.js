import hash from './griffin/scripts/hash';
import slugger from 'slugger';
import { writable, derived, get } from 'svelte/store';
import baseConfig from './base-chart-config.json';
import { extendObj } from './griffin/griffin';
import returnPointFormatter from './griffin/scripts/return-point-formatter';

export const s = {};
export const hMap = {};
export const gMap = {};
s.ChartConfig = writable({});
function createWritable({ name, value, config }, configType) {
    const map = configType == 'highcharts' ? hMap : configType == 'griffin' ? gMap : null;
    s[name] = writable(value);
    if ( map ){
        map[config || name] = s[name];
    }
    if ( configType == 'highcharts'){
        s[name].subscribe(v => {
            const chartConfig = get(s.ChartConfig);
            extendObj(chartConfig, config.split('.'), v);
            console.log(name);
            s.ChartConfig.set(chartConfig);
        });
    }
}
s.ChartConfig.subscribe(v => {
    console.log(v);
    window.chartConfig = v;
});

/**
 *  Stores that correspond to settings in the Highcharts configuration object
 */
[
    ['ChartHeight', '56.25%', 'chart.height'],
    ['ChartSeries', [], 'series'],
    ['ChartType', baseConfig.chart.type, 'chart.type'],
    ['LegendEnabled', true, 'legend.enabled'],
    ['MinHeight', 0, 'responsive.rules[0].chartOptions.chart.height'],
    ['MinHeightCondition', 0, 'responsive.rules[0].condition.maxHeight'],
    ['Stacking', undefined, 'plotOptions.series.stacking'],
    ['StartOfWeek', 1, 'xAxis.startOfWeek'],
    ['TooltipFormatter', returnPointFormatter({numberFormat: undefined, seriesLength: 2}), 'tooltip.pointFormatter' ],
    ['XAxisCategories', null, 'xAxis.categories'],
    ['XAxisTitle', '', 'xAxis.title.text'],
    ['XAxisType', 'linear', 'xAxis.type']
].forEach(d => {
    createWritable({ name: d[0], value: d[1], config: d[2] }, 'highcharts');
});

/**
 *  Stores that correspond to settings in the Griffin configuration object saved with charts
 */
[
    ['NominalMinHeight', '400'],
    ['ChartWidth', '650'],
    ['ChartProject', undefined],
    ['DatatableData', []],
    ['CustomColors',[]],
    ['ChartCredit', `© ${new Date().getFullYear()} The Pew Charitable Trusts`],
    ['ChartDescription', ''],
    ['ChartLabel', ''],
    ['ChartNotes', ''],
    ['ChartTitle', ''],
    ['ChartSources', ''],
    ['ChartSubtitle', ''],
].forEach(d => {
    createWritable({ name: d[0], value: d[1], config: d[2] }, 'griffin');
});
/**
 * Stores that govern app state but are not saved as HC or Griffin configuration with charts
 */
/* TO DO :  instead of newChart config, you can more simply reset hc config and griffin config to defaults */
/*s.newChartConfig = {
    config: "{\"highchartsConfig\":{\"title\":null,\"chart\":{\"type\":\"column\"},\"credits\":{\"enabled\":false},\"yAxis\":{\"title\":null},\"series\":[{\"name\":\"Apples\",\"data\":[{\"y\":2},{\"y\":1},{\"y\":15}],\"colorIndex\":0},{\"name\":\"Oranges\",\"data\":[{\"y\":13},{\"y\":7},{\"y\":5}],\"colorIndex\":1},{\"name\":\"Peaches\",\"data\":[{\"y\":4},{\"y\":10},{\"y\":2}],\"colorIndex\":2}],\"xAxis\":{\"title\":{\"text\":\"\"},\"type\":\"category\",\"categories\":[\"Spring\",\"Summer\",\"Fall\"]}},\"griffinConfig\":{\"chartCredit\":\"© 2021 The Pew Charitable Trusts and the Urban Institute\",\"chartDescription\":\"Bar chart showing that most apples are harvested in the fall.\",\"chartLabel\":\"Figure 1\",\"chartNotes\":\"Some of the increase in apples harvested is due to unusually high rainfall in September. See <a href=\\\"http://example.com\\\">this report</a>.\",\"chartSources\":\"Source: John Adams, <em>Economics</em>, 1789.\",\"chartSubtitle\":\"Fruits by season\",\"chartTitle\":\"Most Apples Are Harvested in the Fall\",\"customColors\":[],\"selectedColorPalette\":\"default\",\"numberFormat\":\"default\"}}",
};*/
s.PrintWidth = writable(undefined);
s.PrintHeight = writable(undefined);
s.CellBeingEdited = writable(null);
s.ActiveSection = writable('start');
s.ExportType = writable('static');
s.ChartHasBeenSaved = writable(false);



s.ImageDataUri = writable('');
s.SelectedColorPalette = writable('default');
s.ColorIndeces = writable(undefined);
s.Indicators = writable({});
s.IsWorking = writable(false);
s.ColorByPoint = writable([]);
s.SeriesCountFromTable = derived([s.DatatableData], ([datatableData]) => datatableData.length - 1);
                                            /* SeriesCountFromTable is # of series from data passed in by user.
                                             SeriesCount is # series sent to the Chart instance. e.g., pie charts
                                             only pass in one series regardless of the SeriesCountFromTable */

s.LoadedDataConfig = writable('');
s.Picture = writable('');
s.PictureIsMissingOrOld = writable(true);
s.Thumbnail = writable('');
s.NumberFormat = writable(undefined);
s.SeriesCount = derived([s.ChartConfig], ([chartConfig]) => !chartConfig.series ? 0 : chartConfig.series.length);
s.SeriesCountMismatch = derived([s.SeriesCountFromTable, s.SeriesCount], ([seriesCountFromTable, seriesCount]) => seriesCountFromTable != seriesCount);
s.MaxPointCount = derived([s.UserOptions], ([userOptions]) => {
    if ( !userOptions.series || userOptions.series.length == 0){
        return 0;
    }
    return Math.max(...userOptions.series.map(d => d.data.length));
});
s.ColorCount = derived([s.MaxPointCount,s.ColorByPoint, s.SeriesCount], ([maxPointCount, colorByPoint, seriesCount]) => {
    if (colorByPoint[0] == true){
        return maxPointCount;
    }
    return seriesCount;
});
s.ChartPaletteClassname = derived([s.SelectedColorPalette,s.CustomColors], ([selectedPalette, customColors]) => {
    if (selectedPalette !== 'custom') {
        return selectedPalette;
    }
    const rtn = `cc${hash(customColors.join(''))}`;
    return rtn;
});
s.Classes = derived([s.ChartPaletteClassname, s.ChartProject], function(){
    return arguments[0].map(d => slugger(d));
});
/**
 * to do: when there's a series count mismatch, append the datatable data to the griffin config so it can be loaded back in
 */
s.GriffinConfig = derived([
    s.ChartCredit,
    s.ChartDescription, 
    s.ChartLabel, 
    s.ChartNotes,
    s.ChartPaletteClassname,
    s.ChartSources, 
    s.ChartSubtitle,
    s.ChartTitle,
    s.CustomColors,
    s.DatatableData,
    s.SeriesCountMismatch,
    s.NumberFormat,
    s.ChartWidth,
    s.NominalMinHeight 
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
    seriesCountMismatch,
    numberFormat,
    chartWidth ,
    nominalMinHeight
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
        datatableData,
        numberFormat,
        chartWidth,
        nominalMinHeight 
    };
    if (!seriesCountMismatch){
        delete obj.datatableData;
    }
    s.PictureIsMissingOrOld.set(true);
    return obj;
});
s.GriffinConfig.subscribe(() => {
    s.ChartHasBeenSaved.set(false);
});
//project	type	hed	timestamp	config	user_email	user_id	name	user_id	thumbnail
s.SavingChartData = derived([s.ChartType, s.ChartTitle, s.UserOptions, s.GriffinConfig, s.Thumbnail], ([chartType, chartTitle, userOptions, griffinConfig, thumbnail]) => {
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
s.CodeExport = derived([
    s.ChartCredit,
    s.ChartDescription, 
    s.ChartLabel, 
    s.ChartNotes,
    s.ChartTitle, 
    s.ChartSources,
    s.ChartSubtitle,
    s.Classes, 
    s.Picture,
    s.UserOptions, 
    s.GriffinConfig,
    s.ExportType
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

s.importConfig = { // THIS SHOULD BECOME UNNECESSARY
    ChartCredit: s.ChartCredit,
    ChartDescription: s.ChartDescription,
    SelectedColorPalette: s.SelectedColorPalette,
    ChartLabel: s.ChartLabel,
    ChartNotes: s.ChartNotes,
    ChartSources: s.ChartSources,
    ChartSubtitle: s.ChartSubtitle,
    ChartTitle: s.ChartTitle,
    ColorByPoint: s.ColorByPoint,
    ColorIndeces: s.ColorIndeces,
    CustomColors: s.CustomColors,
    UserOptions: s.UserOptions,
    NumberFormat: s.NumberFormat,
    ChartWidth: s.ChartWidth,
    NominalMinHeigh: s.NominalMinHeight
};
/*s.UserOptions.subscribe(() => {
    s.ChartHasBeenSaved.set(false);
    if (!v || !v.chart || !v.chart.type) return;
    s.ChartType.set(v.chart.type);
});*/