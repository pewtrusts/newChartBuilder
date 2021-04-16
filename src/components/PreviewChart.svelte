<script context="module">
    import HCExporting from "highcharts/modules/exporting";
    import HCOfflineExporting from "highcharts/modules/offline-exporting";
    import "@Submodule/shared-css/styles.css";
    import { s } from "./../store";
    import { get } from "svelte/store";
    import { afterUpdate } from "svelte";
    import Notices from "./Notices.svelte";
    import cloneDeep from 'lodash.clonedeep';
    import { init as initGriffin } from './../griffin/griffin';
    const _= {cloneDeep};
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
    //export let chartResolve;
    export let seriesCountMismatchNotice;
    export let chartWidth;
    export let size;
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
    let codeExport;
    let node;
    s.ChartHeight.subscribe((v) => {
        chartHeight = v;
    });
    s.CodeExport.subscribe(v => {
        codeExport = v;
    });
    /*s.MinHeight.subscribe((v) => {
        minHeight = v;
    });*/
    function _initGriffin(){
        requestIdleCallback(() => {
            node.querySelector('.js-_griffin').classList.add('js-griffin');
            node.querySelector('.js-_griffin').classList.add('js-griffin--chart-builder');
            node.querySelector('.js-_griffin').classList.add(`griffin-chart-builder--${size}`); // TO DO: will be unnecessary when/if iframed
            node.querySelector('.js-_griffin').classList.add(`js-${size}`); 
            node.querySelector('.js-_griffin').style.width = chartWidth + 'px';
            initGriffin();
            requestIdleCallback(() => {
                node.querySelector('.griffin-download-btn').addEventListener('click', exportSVG);
            });
        }, {timeout: 1000});
    }
    function init(_node){
        HCExporting(Highcharts);
        HCOfflineExporting(Highcharts);
        node = _node;
        _initGriffin();
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
    afterUpdate(async () => {
        window.cancelIdleCallback(redrawTimeout);
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
        const Chart = window.Charts[+this.dataset.index];
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
   /* s.ChartLabel.subscribe((v) => {
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
</script>

<Notices {notices} />
<div class="outer-wrapper">
    <div use:init
        data-min-height={minHeight}
        data-height={chartHeight}
        data-width={chartWidth}
        data-size={size}
        class="wrapper js-figure-wrapper"
    >
        {@html codeExport}
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
