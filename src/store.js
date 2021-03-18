import hash from './griffin/scripts/hash';
import slugger from 'slugger';
import { writable, derived, get } from 'svelte/store';
import baseConfig from './base-chart-config.json';
import { extendObj } from './griffin/griffin';
import returnPointFormatter from './griffin/scripts/return-point-formatter';
import returnNumberFormatter from './griffin/scripts/return-number-formatter';

export const s = {};
export const hMap = {};
export const gMap = {};
export function resetWritables(){
    [...HCStores, ...GStores, ...appStores].forEach(store => {
        s[store[0]].set(store[1]);
    });
}
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
s.ChartConfig = writable({}),
s.ChartConfig.subscribe(v => { // TO DO CAN BE REMOVED
    console.log(v);
    window.chartConfig = v;
});
export const HCStores = [
    ['ChartHeight', '56.25%', 'chart.height'],
    ['ChartSeries', [], 'series'],
    ['ChartType', baseConfig.chart.type, 'chart.type'],
    ['LegendEnabled', true, 'legend.enabled'],
    ['MinHeight', 0, 'responsive.rules[0].chartOptions.chart.height'],
    ['MinHeightCondition', 0, 'responsive.rules[0].condition.maxHeight'],
    ['Stacking', undefined, 'plotOptions.series.stacking'],
    ['StartOfWeek', 1, 'xAxis.startOfWeek'],
    ['TooltipFormatter', returnPointFormatter({ numberFormat: undefined, seriesLength: 2 }), 'tooltip.pointFormatter'],
    ['XAxisCategories', null, 'xAxis.categories'],
    ['XAxisTitle', '', 'xAxis.title.text'],
    ['XAxisType', 'linear', 'xAxis.type'],
    ['YAxisLabelsFormatter', returnNumberFormatter(undefined), 'yAxis.labels.formatter']
];
const GStores = [
    ['NominalMinHeight', '400'],
    ['NominalHeightValue', '56.25%'],
    ['ChartWidth', '650'],
    ['ChartProject', undefined],
    ['DatatableData', []],
    ['CustomColors', []],
    ['ChartCredit', `© ${new Date().getFullYear()} The Pew Charitable Trusts`],
    ['ChartDescription', ''],
    ['ChartLabel', ''],
    ['ChartNotes', ''],
    ['ChartTitle', ''],
    ['ChartSources', ''],
    ['ChartSubtitle', ''],
];
const appStores = [
    ['PrintWidth', undefined],
    ['PrintHeight', undefined],
    ['CellBeingEdited', null],
    ['ActiveSection', 'start'],
    ['ExportType', 'static'],
    ['ChartHasBeenSaved', false],
    ['ImageDataUri', ''],
    ['SelectedColorPalette', 'default'],
    ['ColorIndeces', undefined],
    ['Indicators', {}],
    ['IsWorking', false],
    ['ColorByPoint', []],
    ['LoadedDataConfig', ''],
    ['Picture', ''],
    ['PictureIsMissingOrOld', true],
    ['Thumbnail', ''],
    ['NumberFormat', undefined],
    ['IsLoading', false]
];

function initWritables(){
    /** WRITABLES */

    /**
     *  HIGHCHARTS Stores that correspond to settings in the Highcharts configuration object
     */
    HCStores.forEach(d => {
        createWritable({ name: d[0], value: d[1], config: d[2] }, 'highcharts');
    });

    /**
     *  GRIFFIN Stores that correspond to settings in the Griffin configuration object saved with charts
     */
    GStores.forEach(d => {
        createWritable({ name: d[0], value: d[1], config: d[2] }, 'griffin');
    });
    /**
     * Stores that govern app state but are not saved as HC or Griffin configuration with charts
     */
    appStores.forEach(d => {
        createWritable({ name: d[0], value: d[1], config: d[2] });
    });
    
    s.NumberFormat.subscribe(v => {
        const seriesLength = get(s.ChartSeries).lengthk
        s.YAxisLabelsFormatter.set(returnNumberFormatter(v));
        s.TooltipFormatter.set(returnPointFormatter({ numberFormat: v, seriesLength}))
    });
} // end initWritables

/**
 * subscriptions to writables
 */


function initDerived(){
    
    s.SeriesCountFromTable = derived([s.DatatableData], ([datatableData]) => datatableData.length - 1);
                                                /* SeriesCountFromTable is # of series from data passed in by user.
                                                SeriesCount is # series sent to the Chart instance. e.g., pie charts
                                                only pass in one series regardless of the SeriesCountFromTable */
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
        s.NominalMinHeight,
        s.NominalHeightValue
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
        nominalMinHeight,
        nominalHeightValue
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
            nominalMinHeight,
            nominalHeightValue 
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
    s.SavingChartData = derived([s.ChartType, s.ChartTitle, s.ChartConfig, s.GriffinConfig, s.Thumbnail], ([chartType, chartTitle, chartConfig, griffinConfig, thumbnail]) => {
        return {
            type: chartType,
            hed: chartTitle,
            config: JSON.stringify({
                highchartsConfig: chartConfig,
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
} // end initDerived

initWritables();
initDerived();
/*
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
};*/
/*s.UserOptions.subscribe(() => {
    s.ChartHasBeenSaved.set(false);
    if (!v || !v.chart || !v.chart.type) return;
    s.ChartType.set(v.chart.type);
});*/