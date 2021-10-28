<script context="module">
    import hash from './../griffin/scripts/hash';
    import HCExporting from "highcharts/modules/exporting";
    import HCOfflineExporting from "highcharts/modules/offline-exporting";
    import "@Submodule/shared-css/styles.css";
    import { s } from "./../store";
    import { get } from "svelte/store";
    import { afterUpdate } from "svelte";
    import Notices from "./Notices.svelte";
    import { customSettingsNotice } from './../App.svelte';
    import options from './../griffin/options.json';
    import cloneDeep from 'lodash.clonedeep';
    import { initSingleGriffin } from './../griffin/griffin';
    const _= {cloneDeep};
    HCExporting(Highcharts);
    HCOfflineExporting(Highcharts);
    Highcharts.setOptions(options);
    //options.legend.labelFormat = "{name}"; // shouldn't be necessary but some charts were tripping up on load
    /*config.title = config.title || {};
    config.title.text = undefined;
    config.exporting = { enabled: false };*/
   /* export function createChart(node, config) {   
        return Highcharts.chart(node, config);
    }*/
    export function clean(userOptions){
        console.log('SHOULD BE ABLE TO DELETE THIS');
        const propsToDelete = ['_id', 'isResponsiveOptions'];
        const v = get(ChartHeight);
        propsToDelete.forEach(prop => {
            delete userOptions[prop];
        });
        userOptions.responsive.rules.forEach(rule => {
            delete rule._id;
        });
        userOptions.chart.height = v;
        return userOptions;
    }
    
</script>

<script>

    export let seriesCountMismatchNotice;
    export let chartWidth;
    export let size;
    export let Chart;
    let chartConfig;
    let griffinConfig;
    let chartResolve;
    let chartContainer;
    let classes = [];
    let chartLabel;
    let chartTitle;
    let chartType;
    let chartSubtitle;
    let chartNotes;
    let chartCaption;
    let chartSources;
    let chartCredit;
    let notices = new Set();
    let previousWidth;
    let chartHeight;
    let minHeight;
    let redrawTimeout;
    let node;
    let loadedMultipleCharts = [];
    let subsDivs = [];
    let multiLayout = 1;
    let patternColors = [];
    let chartDescription = ''
    s.PatternColors.subscribe(v => {
        patternColors = v;
    })
    s.HasCustomSettings.subscribe(v => {
        notices[v ? 'add' : 'delete'](customSettingsNotice);
        notices = notices;
    });
    s.ChartHeight.subscribe((v) => {
        chartHeight = v;
    });
    s.GriffinConfig.subscribe(v => {
        griffinConfig = v;
    })
    s.ChartConfig.subscribe(v => {
        chartConfig = v;
        window.cancelIdleCallback(redrawTimeout);
        redrawTimeout = window.requestIdleCallback(() => {
           _initGriffin(node);
        },{timeout: 1000});
    });
    s.Classes.subscribe(v => {
        classes = v;
    });
    s.LoadedMultipleCharts.subscribe(v => {
        loadedMultipleCharts = v;
    });
     s.MultiLayout.subscribe(v => {
        multiLayout = v;
        requestIdleCallback(() => {
             _initGriffin(subsDivs, node);
        },{timeout:500});
    })
    /*s.MinHeight.subscribe((v) => {
        minHeight = v;
    });*/
    function _initGriffin(node, parent = node){
        const nodelist = Array.isArray(node) ? node : [node];
        nodelist.forEach((_node, i) => {
            requestIdleCallback(() => {
                if ( size == 'fullscreen' ){
                    Chart = new Promise(function(resolve){
                        chartResolve = resolve;
                    });
                }
                //const chart = initSingleGriffin(_node, size == 'fullscreen' ? 0 : 1);
                const chart = initSingleGriffin(_node, i, parent);
                if ( size == 'fullscreen' ){
                    chartResolve(chart);
                }
                requestIdleCallback(() => {
                    parent.querySelector('.griffin-download-btn').addEventListener('click', exportSVG);
                });
                console.log(Chart);
            }, {timeout: 1000});
        });
    }
    function initSubs(){
        setTimeout(() => {
           _initGriffin(subsDivs, node);
        },1000);
        return {
            update(){
                setTimeout(() => {
                    _initGriffin(subsDivs, node);
                },1000);   
            }
        }
    }
    function init(_node){
        node = _node;
        setTimeout(() => {
           _initGriffin(node);
        },1000);
        
         /**
          *  using cloneDeep here to avoid passing reference to the ChartConfig store to Highcharts
          *  because Highcharts can mutate it, especially when the chart's responsive options are in
          *  effect. perhaps better not to use a writable store for this value?
          */
          /*  const config = get(s.ChartConfig);
            _Chart = createChart(chartContainer, _.cloneDeep(config));
            window.Charts.push(_Chart);
            if (size == "fullscreen") {
                _Chart.isFullscreen = true;
                chartResolve(_Chart);
            }*/
    }
    function stringifySubs(sub){
        return sub.config;
    }
    afterUpdate(async () => {
       /* window.cancelIdleCallback(redrawTimeout);
        redrawTimeout = window.requestIdleCallback(() => {
            _initGriffin();
        },{timeout: 1000});
       /* const _Chart = await Chart;
        if (previousWidth && chartWidth !== previousWidth) {
            _Chart.reflow();
        }
        previousWidth = chartWidth;*/
    });
    s.SeriesCountMismatch.subscribe((v) => {
        notices[v ? "add" : "delete"](seriesCountMismatchNotice);
        notices = notices;
    });
    function exportSVG(e){
        e.stopImmediatePropagation();
        const Chart = window.Charts[window.Charts.length - 2];
         const exportingOptions = {
            filename: 'chart',
            scale: 1,
            sourceHeight: Chart.container.clientHeight,
            sourceWidth: Chart.container.clientWidth,
            type: 'image/svg+xml'
        };
        Chart.exportChartLocal(exportingOptions, {className: 'gray'});   
    }
    /*s.ChartConfig.subscribe(async (v) => {
        await Chart;
        window.cancelIdleCallback(redrawTimeout);
        redrawTimeout = window.requestIdleCallback(() => {
            _Chart.redraw();
            window.requestIdleCallback(() => {
                _Chart.reflow();
                _Chart.legend.update(); // bd legend was not updating after color change for pie charts
            },{timeout: 1000});
        },{timeout:1000});
        _Chart.update(v, false, true);
    });*/
    s.ChartLabel.subscribe((v) => {
        chartLabel = v;
    });
    s.ChartTitle.subscribe((v) => {
        chartTitle = v;
    });
    s.ChartSubtitle.subscribe((v) => {
        chartSubtitle = v;
    });
    s.ChartNotes.subscribe((v) => {
        chartNotes = v;
    });
    s.ChartSources.subscribe((v) => {
        chartSources = v;
    });
    s.ChartCredit.subscribe((v) => {
        chartCredit = v;
    });
    s.ChartCaption.subscribe((v) => {
        chartCaption = v;
    });
    s.ChartDescription.subscribe((v) => {
        chartDescription = v;
    });
    s.ChartType.subscribe((v) => {
        chartType = v;
    });
    $:hashId = hash(chartLabel + chartTitle + chartSubtitle + chartDescription + chartNotes);
    /*s.Stacking.subscribe(v => {
        if (Chart){
            updateChartConfig(Chart, {plotOptions: {series: {stacking: v}}});
        }
    })*/
    s.ColorIndeces.subscribe(async (v) => { // TO DO : how are you gonna handle this?. prob should be elsewhere
        if (!v) return;
        const series = get(s.ChartSeries);
        const colorByPoint = get(s.ColorByPoint);
        series.forEach((s, i) => {
            if (colorByPoint[i]) {
                s.colorIndex = undefined;
                s.data.forEach((d, j) => {
                    d.colorIndex = v[j];
                });
            } else {
                s.colorIndex = v[i];
                s.data.forEach((d) => {
                    d.colorIndex = undefined;
                });
            }
        });
       s.ChartSeries.set(series);
    });
    function returnHashId(configString){
        const {ChartLabel, ChartTitle, ChartSubtitle, ChartDescription, ChartNotes} = JSON.parse(configString).griffinConfig;
        return hash(ChartLabel + ChartTitle + ChartSubtitle + ChartDescription + ChartNotes);
    }
    function returnPatternColors(configString){
        return JSON.parse(configString).griffinConfig.PatternColors;
    }
</script>

<Notices {notices} />
<div class="outer-wrapper">
    <div 
        data-min-height={minHeight}
        data-height={chartHeight}
        data-width={chartWidth}
        data-size={size}
        class="wrapper js-figure-wrapper"
    >
        <p class="size-tag">[{size}]</p>
        <figure
            use:init="{loadedMultipleCharts}"
            style="min-width:{chartWidth}px;max-width:{chartWidth}px;"
            class="ai2html-griffin-figure griffin-figure js-griffin js-{size} griffin-chart-builder--{size} js-griffin--chart-builder {classes.join(' ')}"
        >
            <meta name="format-detection" content="telephone=no" />
            {#if chartLabel || chartTitle }
                <header>
                    {#if chartLabel}
                        <span class="figure-label">{chartLabel}</span>
                    {/if}
                    {#if chartTitle}
                        <h1>{@html chartTitle}</h1>
                    {/if}
                </header>
                {/if}
                <div class="griffin-outer-container griffin-outer-container--{multiLayout}-up" class:griffin-outer-container--grid="{multiLayout > 1}">
                    <div bind:this="{subsDivs[0]}" class="js-griffin-container griffin-container cp-{hash(patternColors.flat().join(''))}">
                        {#each patternColors as pattern, i}
                            {#if pattern && pattern.length > 1}
                            <svg width=0 height=0 style="display:block;">
                                <pattern id="pattern-{hash(patternColors.flat().join(''))}-{i}" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                    <rect x="0" y="0" width="10" height="10" style="fill:{pattern[0]}" />
                                    <line x1="0" y1="0" x2="0" y2="10" style="stroke:{pattern[1]}; stroke-width:8" />
                                </pattern>
                            </svg>
                            {/if}
                        {/each}
                        {#if chartSubtitle}
                        <p class="figure-dek">{@html chartSubtitle}</p>
                        {/if}
                        <pre class="js-griffin-config" style="display: none;">
                            {JSON.stringify({
                                highchartsConfig: chartConfig,
                                griffinConfig 
                            })}
                        </pre>
                        <div bind:this="{chartContainer}" class="hc-container js-hc-container {chartType}"></div>
                        {#if chartCaption}
                        <p class="figure-caption">
                            {@html chartCaption}
                        </p>
                        {/if}
                    </div>
                    {#if loadedMultipleCharts.slice(1).length}
                        {#each loadedMultipleCharts.slice(1) as subsequent, i }
                        <div use:initSubs bind:this="{subsDivs[i+1]}" class="js-griffin-container griffin-container hash-{returnHashId(subsequent)}">
                            {#each returnPatternColors(subsequent) as pattern, i}
                                {#if pattern && pattern.length > 1}
                                <svg width=0 height=0>
                                    <pattern id="pattern-{i}" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                        <rect x="0" y="0" width="10" height="10" style="fill:{pattern[0]}" />
                                        <line x1="0" y1="0" x2="0" y2="10" style="stroke:{pattern[1]}; stroke-width:8" />
                                    </pattern>
                                </svg>
                                {/if}
                            {/each}
                            {#each [JSON.parse(subsequent.config).griffinConfig.ChartSubtitle] as dek}
                                {#if dek}
                                    <p class="figure-dek">{@html dek.replace(/&lt;/g,'<').replace(/&gt;/g,'>')}</p>
                                {/if}
                            {/each}
                            <pre class="js-griffin-config" style="display: none;">
                                {subsequent.config}
                            </pre>
                            <div bind:this="{chartContainer}"
                                class="hc-container js-hc-container {chartType}"
                            />
                            {#each [JSON.parse(subsequent.config).griffinConfig.ChartCaption] as caption}
                                {#if caption}
                                <p class="figure-caption">
                                    {@html caption}
                                </p>
                                {/if}
                            {/each}
                        </div>
                        {/each}
                    {/if}
                </div>
            <figcaption>
                
                {#if chartNotes}
                    <p class="figure-note">
                        {@html chartNotes}
                    </p>
                {/if}
                {#if chartSources}
                    <p class="figure-note figure-note--source">
                        {@html chartSources}
                    </p>
                {/if}
                {#if chartCredit}
                    <p on:click="{exportSVG}" class="figure-note figure-note--source js-griffin-credit">
                        {@html chartCredit}
                    </p>
                {/if}
            </figcaption>
        </figure>
    </div>
</div>

<style>
    .outer-wrapper {
        margin-bottom: 2em;
        align-self: center;
    }
   
    .griffin-figure {
        margin: 0 auto;
        background-color: #fff;
    }
    .wrapper {
        position: relative;
    }
    
</style>
