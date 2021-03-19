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
s.ChartConfig = writable({});

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
    ['DescriptionProxy', 'chartDescription'],
    ['NumberFormat', undefined],
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
        const seriesLength = get(s.ChartSeries).length;
        s.YAxisLabelsFormatter.set(returnNumberFormatter(v));
        s.TooltipFormatter.set(returnPointFormatter({ numberFormat: v, seriesLength}))
    });
    s.DatatableData.subscribe(v => {
        console.log(v);
    });
} // end initWritables

/**
 * subscriptions to writables
 */


function initDerived(){

    s.GriffinConfig = derived(Object.values(gMap), function(){
        const keys = Object.keys(gMap);
        var rtn = arguments[0].reduce(function(acc,cur,i){
            acc[keys[i]] = cur;
            return acc;
        },{});
        return rtn;
    });
    s.GriffinConfig.subscribe(() => {
        s.ChartHasBeenSaved.set(false);
    });
    s.SeriesCountFromTable = derived([s.DatatableData], ([datatableData]) => {
        return datatableData.length < 2 ? 0 : datatableData[0].length - 1;
    });
    s.SeriesCount = derived([s.ChartSeries], ([chartSeries]) => {
        return chartSeries.length;
    });
    s.SeriesCountMismatch = derived([s.SeriesCountFromTable, s.SeriesCount], ([seriesCountFromTable, seriesCount]) => {
        return seriesCountFromTable != seriesCount;
    });
    s.MaxPointCount = derived([s.ChartSeries], ([chartSeries]) => {
        if ( chartSeries.length == 0){
            return 0;
        }
        return Math.max(...chartSeries.map(d => d.data.length));
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
    //project	type	hed	timestamp	config	user_email	user_id	name	user_id	thumbnail
    s.SavingChartData = derived([s.ChartType, s.ChartTitle, s.ChartConfig, s.GriffinConfig, s.Thumbnail], ([chartType, chartTitle, chartConfig, griffinConfig, thumbnail]) => {
        const obj = {
            type: chartType,
            hed: chartTitle,
            config: JSON.stringify({
                highchartsConfig: chartConfig,
                griffinConfig
            }),
            thumbnail
        };
        return obj;
    });
    s.CodeExport = derived([
        s.ChartConfig,
        s.ChartCredit,
        s.ChartDescription, 
        s.ChartLabel, 
        s.ChartNotes,
        s.ChartTitle, 
        s.ChartSources,
        s.ChartSubtitle,
        s.Classes, 
        s.Picture,
        s.GriffinConfig,
        s.ExportType,
        s.DescriptionProxy
    ], ([
        chartConfig,
        chartCredit,
        chartDescription,
        chartLabel, 
        chartNotes,
        chartTitle, 
        chartSources,
        chartSubtitle,
        classes,
        picture,
        griffinConfig,
        exportType,
        descriptionProxy
    ]) => {
        const hashId = hash(chartLabel + chartTitle + chartSubtitle + chartDescription + chartNotes);
        return `<figure${chartTitle ? ' aria-labelledby="chartTitle-' + hashId + '"' : ''} aria-describedby="${descriptionProxy}-${hashId}" class="ai2html-griffin-figure griffin-figure${exportType == 'dynamic' ? ' js-griffin' : ''}">
        <meta name="format-detection" content="telephone=no">${ chartLabel || chartTitle || chartSubtitle ? `
        <header>${chartLabel ? `
            <span class="figure-label">${chartLabel}</span>` : ''}${chartTitle ? `
            <h1 id="chartTitle-${hashId}">${chartTitle}</h1>` : ''}${chartSubtitle ? `
            <p id="chartSubtitle-${hashId}" class="figure-dek">${chartSubtitle}</p>` : ''}
        </header>` : ''}${chartDescription && descriptionProxy == 'chartDescription' ? `
        <p id="chartDescription-${hashId}" class="visually-hidden">${chartDescription}</p>` : ''}
        <pre class="js-griffin-config" style="display: none;">
        ${JSON.stringify({
            highchartsConfig: chartConfig,
            griffinConfig 
        })}
        </pre>
        <div aria-hidden="true" class="js-hc-container hc-container ${classes.join(' ')}">
            ${picture}
        </div>${ chartNotes || chartSources || chartCredit ? `
        <figcaption>${chartNotes ? `
            <p id="chartNotes-${hashId}" class="figure-note">
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