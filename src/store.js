import hash from './griffin/scripts/hash';
import slugger from 'slugger';
import { writable, derived, get } from 'svelte/store';
//import baseConfig from './base-chart-config.json';
import convert from './scripts/unit-conversions';
import { extendObj } from './griffin/griffin';
import returnPointFormatter from './griffin/scripts/return-point-formatter';
import returnNumberFormatter from './griffin/scripts/return-number-formatter';
import returnLegendFormatter from './griffin/scripts/return-legend-formatter';
import defaultsDeep from 'lodash.defaultsdeep';
import cloneDeep from 'lodash.clonedeep';
const _ = { cloneDeep, defaultsDeep };

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
            
            s.ChartConfig.set(chartConfig);
        });
    }
    
}
export function initDynamicStore(node, { configType, localValue }) {
    const name = node.name.charAt(0).toUpperCase() + node.name.slice(1);
    const value = node.value || undefined;
    createWritable({ name, value, config: node.name }, configType);
    s[name].subscribe(v => {
        if (typeof localValue == 'object'){
            localValue[node.name] = v;
        } else {
            localValue = v;
        }
    });
    if (configType == 'highcharts') {
        HCStores.push([name, value, node.name]);
    }
}
s.ChartConfig = writable({});

export const HCStores = [
    ['ChartHeight', '56.25%', 'chart.height'],
    ['ChartClassName', '', 'chart.className'],
    ['ChartSeries', [], 'series'],
    ['ChartType', 'line', 'chart.type'],
    ['DataLabels', false, 'plotOptions.series.dataLabels.enabled'],
    ['LegendAlign', 'center', 'legend.align'],
    ['LegendEnabled', undefined, 'legend.enabled'],
    ['LegendLayout', 'horizontal', 'legend.layout'],
    ['LegendVerticalAlign', 'bottom', 'legend.verticalAlign'],
    ['LegendReversed', false, 'legend.reversed'],
    ['LegendFormatter', undefined, 'legend.labelFormatter'],
    ['Rotation', 0, 'plotOptions.pie.startAngle'],
    ['SpacingRight', 20, 'chart.spacingRight'],
    ['SpacingTop', 10, 'chart.spacingTop'],
    ['SpacingBottom', 15, 'chart.spacingBottom'],
    ['SpacingLeft', 10, 'chart.spacingLeft'],
    ['Stacking', undefined, 'plotOptions.series.stacking'],
    ['StartOfWeek', 1, 'xAxis.startOfWeek'],
    ['TooltipFormatter', returnPointFormatter({ numberFormat: undefined, seriesLength: 2 }), 'tooltip.pointFormatter'],
    ['PlotBands', [], 'xAxis.plotBands'],
    ['PlotLines', [], 'xAxis.plotLines'],
    ['XAxisCategories', null, 'xAxis.categories'],
    ['XAxisTitle', '', 'xAxis.title.text'],
    ['XAxisReversedStacks', false, 'xAxis.reversedStacks'],
    ['XAxisType', 'linear', 'xAxis.type'],
    ['XAxisLabelsY', undefined, 'xAxis.labels.y'],
    ['YAxisLabelsFormatter', returnNumberFormatter(undefined), 'yAxis[0].labels.formatter']
];
const GStores = [
    ['NominalMinHeight', '400'],
    ['NominalHeightValue', '56.25%'],
    ['ChartWidth', '650'],
    ['ChartProject', undefined],
    ['DatatableData', []],
    ['CustomColors', []],
    ['ChartCaption', ''],
    ['ChartCredit', `© ${new Date().getFullYear()} The Pew Charitable Trusts`],
    ['ChartDescription', ''],
    ['ChartLabel', ''],
    ['ChartNotes', ''],
    ['ChartTitle', ''],
    ['ChartSources', ''],
    ['ChartSubtitle', ''],
    ['ColorIndeces', []],
    ['DescriptionProxy', 'chartDescription'],
    ['LastLabelOnly', ''],
    ['NumberFormat', undefined],
    ['SelectedColorPalette', 'default'],
    ['MinHeight', 400],
    ['OtherResponsive', []],
    ['PatternColors', []],
    ['LockHeight', true],
    ['YAxisDecimals', undefined],
    ['CustomSettings', {}]
];
const appStores = [
    ['PrintWidth', convert.inchesToPixels(convert.picaToInches('39p0'))],
    ['PrintHeight', convert.inchesToPixels(convert.picaToInches('39p0')) * 0.5625],
    ['CellBeingEdited', null],
    ['ActiveSection', 'start'],
    ['ExportType', 'static'],
    ['ChartHasBeenSaved', false],
    ['ImageDataUri', ''],
    ['Indicators', {}],
    ['IsWorking', false],
    ['ColorByPoint', []],
    ['LoadedDataConfig', ''],
    ['Picture', ''],
    ['PictureIsMissingOrOld', true],
    ['Thumbnail', ''],
    ['IsLoading', false],
    ['LoadedChartUserId', undefined],
    ['HasCustomSettings', false],
    ['LoadedMultipleCharts',[]],
    ['MultiLayout', 1],
    ['BuildMode', 'single']
];
s.UserId = writable(undefined);
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
    /**
     * TO DO : formatters should be derived. need derived stores hooked into HC config object
     */
    s.NumberFormat.subscribe(v => {
        const yAxisDecimals = get(s.YAxisDecimals)
        const seriesLength = get(s.ChartSeries).length;
        s.YAxisLabelsFormatter.set(returnNumberFormatter(v, null, yAxisDecimals));
        s.TooltipFormatter.set(returnPointFormatter({ numberFormat: v, seriesLength}))
    });
    s.YAxisDecimals.subscribe(v => {
        const numberFormat = get(s.NumberFormat)
        s.YAxisLabelsFormatter.set(returnNumberFormatter(numberFormat, null, v));
    });
    s.ChartType.subscribe(v => {
        if (v == 'pie') {
            s.ColorByPoint.set([true]);
        } else {
            s.ColorByPoint.set([false]);
        }
        s.LegendFormatter.set(returnLegendFormatter(v));
    });
    s.CustomSettings.subscribe(v => {
        if ( v && typeof v == 'object' && Object.keys(v).length > 0 ){
            s.HasCustomSettings.set(true);
        } else {
            s.HasCustomSettings.set(false);
        }
        const _config = get(s.ChartConfig);
        const _v = _.cloneDeep(v);
        const combined = _.defaultsDeep(_v, _config);
        s.ChartConfig.set(combined);
    });
} // end initWritables

/**
 * subscriptions to writables
 */




function initDerived(){
    s.PlotMarks = derived([s.PlotBands, s.PlotLines], ([bands, lines]) => [...bands, ...lines]);
    s.AllResponsiveRules = derived([s.MinHeight, s.OtherResponsive], ([minHeight, otherResponsive]) => {
        return [{
            chartOptions: {
                chart: {
                    height: minHeight
                }
            },
            condition: {
                maxWidth: 416
            }
        }, ...otherResponsive];
    });
    s.AllResponsiveRules.subscribe(v => {
        const chartConfig = get(s.ChartConfig);
        extendObj(chartConfig, ['responsive','rules'], v);
        s.ChartConfig.set(chartConfig);
    });
    s.GriffinConfig = derived(Object.values(gMap), function(){
        const keys = Object.keys(gMap);
        var rtn = arguments[0].reduce(function(acc,cur,i){
            acc[keys[i]] = typeof cur == 'string' ? cur.replace(/</g, '&lt;').replace(/>/g, '&gt;') : cur;
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
   /* s.ColorCount = derived([s.MaxPointCount,s.ColorByPoint, s.SeriesCount], ([maxPointCount, colorByPoint, seriesCount]) => {
        if (colorByPoint[0] == true){
            return maxPointCount;
        }
        return seriesCount;
    });*/
    s.ColorCount = derived([s.ColorIndeces], ([colorIndeces]) => colorIndeces.length);
    s.ChartPaletteClassname = derived([s.SelectedColorPalette,s.CustomColors], ([selectedPalette, customColors]) => {
        if (selectedPalette !== 'custom') {
            return selectedPalette;
        }
        const rtn = `cc${hash(customColors.join(''))}`;
        return rtn;
    });
    s.Classes = derived([s.ChartPaletteClassname, s.ChartProject, s.LastLabelOnly], function(){
        const rtn = arguments[0].map(d => slugger(d));
        s.ChartClassName.set('griffin ' + rtn.join(' '));
        return rtn;
    });
    //project	type	hed	timestamp	config	user_email	user_id	name	user_id	thumbnail
    s.SavingChartData = derived([s.ChartType, s.ChartTitle, s.ChartConfig, s.GriffinConfig, s.Thumbnail, s.BuildMode, s.LoadedMultipleCharts], ([chartType, chartTitle, chartConfig, griffinConfig, thumbnail, buildMode, loadedMultipleCharts]) => {
        const obj = {
            type: chartType,
            hed: chartTitle,
            config: buildMode == 'single' ? JSON.stringify({
                highchartsConfig: chartConfig,
                griffinConfig
            }) : JSON.stringify(loadedMultipleCharts.map(chart => JSON.parse(chart.config))),
            thumbnail,
            buildMode
        };
        return obj;
    });
    s.CodeExport1 = derived([
        s.ChartConfig,
        s.ChartDescription, 
        s.ChartLabel, 
        s.ChartNotes,
        s.ChartTitle, 
        s.ChartSubtitle,
        s.Classes, 
        s.GriffinConfig,
        s.ExportType,
        s.DescriptionProxy,
        s.MultiLayout,
        s.ChartType,
        s.LoadedMultipleCharts,
        s.ChartCaption,
        s.PatternColors
    ], ([
        chartConfig,
        chartDescription,
        chartLabel, 
        chartNotes,
        chartTitle,
        chartSubtitle,
        classes,
        griffinConfig,
        exportType,
        descriptionProxy,
        multiLayout,
        chartType,
        loadedMultipleCharts,
        chartCaption,
        patternColors
    ]) => {
        function returnAdditionalCharts(){
            return loadedMultipleCharts.slice(1).map(chart => {
                const config = JSON.parse(chart.config);
                const subtitle = config.griffinConfig.ChartSubtitle || null;
                const caption = config.griffinConfig.ChartCaption || null;
                const chartType = config.highchartsConfig.chart.type || null;
                return `<div class="js-griffin-container griffin-container">${subtitle ? `
                    <p class="figure-dek">${subtitle}</p>` : ''}
                    <pre class="js-griffin-config" style="display: none;">
                        ${chart.config}
                    </pre>
                    <div aria-hidden="true" class="js-hc-container hc-container ${chartType}">
                    </div>${caption ? `
            <p id="chartCaption-${hashId}" class="figure-caption">
                ${caption}
            </p>` : ''}
                </div>
                `
            });
        }
        function returnDescription(){
            if (loadedMultipleCharts.length < 2){
                return chartDescription;
            } else {
                return loadedMultipleCharts.reduce((acc, cur, i) => {
                    return acc + ` Chart ${i + 1} — ${JSON.parse(cur.config).griffinConfig.ChartDescription} `;
                }, `${loadedMultipleCharts.length} charts: `);
            }
        }
        function returnPatterns(patterns){
            return patterns.reduce((acc,pattern, i) => {
                if (pattern && pattern.length > 1){
                    return acc + `
                        <pattern id="pattern-${hash(patterns.flat().join(''))}-${i}" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="10" height="10" style="fill:${pattern[0]}" />
                            <line x1="0" y1="0" x2="0" y2="10" style="stroke:${pattern[1]}; stroke-width:8" />
                        </pattern>
                        `;
                }
                return acc;
            }, `
            <svg width=0 height=0 style="display:block;">`) + '</svg>';
        }
        const hashId = hash(chartLabel + chartTitle + chartSubtitle + chartDescription + chartNotes);
        return `<figure${chartTitle ? ' aria-labelledby="chartTitle-' + hashId + '"' : ''} aria-describedby="${descriptionProxy}-${hashId}" class="${classes.join(' ')} ai2html-griffin-figure griffin-figure js-_griffin${exportType == 'dynamic' ? ' js-griffin' : exportType == 'lazy' ? ' js-griffin js-griffin--lazy' : '' }">
        <a class="griffin-anchor js-griffin-anchor"></a>
        <meta name="format-detection" content="telephone=no">${ chartLabel || chartTitle || chartSubtitle ? `
        <header>${chartLabel ? `
            <span class="figure-label">${chartLabel}</span>` : ''}${chartTitle ? `
            <h1 id="chartTitle-${hashId}">${chartTitle}</h1>` : ''}
        </header>` : ''}${chartDescription && descriptionProxy == 'chartDescription' ? `
        <p id="chartDescription-${hashId}" class="visually-hidden">${returnDescription()}</p>` : ''}
        <div class="griffin-outer-container griffin-outer-container--${multiLayout}-up${multiLayout > 1 ? ' griffin-outer-container--grid' : ''}">
            <div class="js-griffin-container griffin-container${patternColors.some(d => !!d && d.length > 1) ? ' cp-' + hash(patternColors.flat().join('')) : ''}">${patternColors.some(d => !!d && d.length > 1) ? returnPatterns(patternColors) : ''}${chartSubtitle ? `
                     <p class="figure-dek">${chartSubtitle}</p>` : ''}
                       <pre class="js-griffin-config" style="display: none;">
                    ${JSON.stringify({
                        highchartsConfig: chartConfig,
                        griffinConfig 
                    })}
              </pre>
              <div aria-hidden="true" class="js-hc-container hc-container ${chartType}">
                    </div>${chartCaption ? `
            <p id="chartCaption-${hashId}" class="figure-caption">
                ${chartCaption}
            </p>` : ''}
                </div>

                ${returnAdditionalCharts()}
        </div>`;
    });
    
    s.CodeExport2 = derived([
        s.ChartCredit,
        s.ChartDescription,
        s.ChartLabel,
        s.ChartNotes,
        s.ChartTitle,
        s.ChartSources,
        s.ChartSubtitle,
        s.Picture
    ], ([
        chartCredit,
        chartDescription,
        chartLabel,
        chartNotes,
        chartTitle,
        chartSources,
        chartSubtitle,
        picture,
    ]) => {
        const hashId = hash(chartLabel + chartTitle + chartSubtitle + chartDescription + chartNotes);
        return `
        <div class="picture-container js-picture-container">
            ${picture}
        </div>
        ${chartNotes || chartSources || chartCredit ? `
        <figcaption>${chartNotes ? `
            <p id="chartNotes-${hashId}" class="figure-note">
                ${chartNotes}
            </p>` : ''}${chartSources ? `
            <p class="figure-note figure-note--source">
                ${chartSources}
            </p>` : ''}${chartCredit ? `
            <p class="figure-note figure-note--source js-griffin-credit">
                ${chartCredit}
            </p>` : ''}
        </figcaption>` : ''}
    </figure>`;
    });
    s.CodeExport = derived([s.CodeExport1, s.CodeExport2], ([a,b]) => a + b);
} // end initDerived

initWritables();
initDerived();