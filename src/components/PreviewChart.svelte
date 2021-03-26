<script context="module">
    import "@Submodule/shared-css/styles.css";
    // TO DO: SWITCH TO MINIFIED HC SRC
    import returnFormatter from "./../griffin/scripts/return-number-formatter";
    import Highcharts from "highcharts";
    //import Highcharts from 'highcharts/highcharts.src.js';
    import HCExporting from "highcharts/modules/exporting";
    import HCOfflineExporting from "highcharts/modules/offline-exporting";
    import options from "@Project/options.json";
    // import config from "@Project/base-chart-config.json";
    import { s } from "./../store";
    import { get } from "svelte/store";
    import { onMount, afterUpdate } from "svelte";
    import updateChartConfig from "../scripts/update-chart-config";
    import Notices from "./Notices.svelte";
    import cloneDeep from 'lodash.clonedeep';
    const _= {cloneDeep};
    let chartCount = 0;
    window.Highcharts = Highcharts; // TO DO:  form now ok will need to work out how HC is loaded.
    HCExporting(Highcharts);
    HCOfflineExporting(Highcharts);
    options.legend.labelFormat = "{name}"; // shouldn't be necessary but some charts were tripping up on load
    options.plotOptions.pie.dataLabels.formatter = function(){
        return this.point.x;
    };
    Highcharts.setOptions(options);
    /*config.title = config.title || {};
    config.title.text = undefined;
    config.exporting = { enabled: false };*/
    export function createChart(node, config) {
        return Highcharts.chart(node, config);
    }
    export function clean(userOptions){
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
    window.Charts = [];
    //

    Highcharts.SVGElement.prototype.addClass = function (className, replace) {
        var currentClassName = replace ? "" : this.attr("class") || "";
        // Trim the string and remove duplicates
        className = (className || "")
            .split(/ /g)
            .reduce(
                function (newClassName, name) {
                    if (currentClassName.indexOf(name) === -1) {
                        let split = name.split(/-\d+$/);
                        if (split.length > 1) {
                            let regex = new RegExp(split[0] + "-\\d+$");
                            newClassName[0] = newClassName[0].replace(
                                regex,
                                ""
                            );
                        }
                        newClassName.push(name);
                    }
                    return newClassName;
                },
                currentClassName ? [currentClassName] : []
            )
            .join(" ");
        if (className !== currentClassName) {
            this.attr("class", className);
        }
        return this;
    };
</script>

<script>
    export let chartResolve;
    export let Chart;
    export let seriesCountMismatchNotice;
    export let chartWidth;
    export let size;
    let _Chart;
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
    s.ChartHeight.subscribe((v) => {
        chartHeight = v;
    });
    /*s.MinHeight.subscribe((v) => {
        minHeight = v;
    });*/
    onMount(() => {
         /**
          *  using cloneDeep here to avoid passing reference to the ChartConfig store to Highcharts
          *  because Highcharts can mutate it, especially when the chart's responsive options are in
          *  effect. perhaps better not to use a writable store for this value?
          */
            const config = get(s.ChartConfig);
            _Chart = createChart(chartContainer, _.cloneDeep(config));
            window.Charts.push(_Chart);
            if (size == "fullscreen") {
                _Chart.isFullscreen = true;
                chartResolve(_Chart);
            }
    });
    afterUpdate(async () => {
        const _Chart = await Chart;
        if (previousWidth && chartWidth !== previousWidth) {
            _Chart.reflow();
        }
        previousWidth = chartWidth;
    });
    s.SeriesCountMismatch.subscribe((v) => {
        notices[v ? "add" : "delete"](seriesCountMismatchNotice);
        notices = notices;
    });
    s.Classes.subscribe((v) => {
        classes = v;
    });
    
    function containerUse() {
       
    }
    s.ChartConfig.subscribe(async (v) => {
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
    });
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
    s.ChartType.subscribe((v) => {
        chartType = v;
    });
    /*s.Stacking.subscribe(v => {
        if (Chart){
            updateChartConfig(Chart, {plotOptions: {series: {stacking: v}}});
        }
    })*/
    s.ColorIndeces.subscribe(async (v) => { // TO DO : how are you gonna handle this?
        await Chart;
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
        <figure
            style="min-width:{chartWidth}px;max-width:{chartWidth}px;"
            class="ai2html-griffin-figure griffin-figure js-griffin js-{size} griffin-chart-builder--{size} {classes.join(' ')}"
        >
            <meta name="format-detection" content="telephone=no" />
            {#if chartLabel || chartTitle || chartSubtitle}
                <header>
                    {#if chartLabel}
                        <span class="figure-label">{chartLabel}</span>
                    {/if}
                    {#if chartTitle}
                        <h1>{chartTitle}</h1>
                    {/if}
                    {#if chartSubtitle}
                        <p class="figure-dek">{chartSubtitle}</p>
                    {/if}
                </header>
            {/if}
            <div bind:this="{chartContainer}" 
                class="hc-container js-hc-container {chartType}"
                use:containerUse
            />
            <figcaption>
                {#if chartCaption}
                    <p class="figure-caption">
                        {@html chartCaption}
                    </p>
                {/if}
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
                    <p class="figure-note figure-note--source">
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
    .wrapper::before {
        content: "[" attr(data-size) "]";
        position: absolute;
        top: -35px;
        color: #767676;
    }
</style>
