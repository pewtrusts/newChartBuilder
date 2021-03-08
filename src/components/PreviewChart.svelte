<script context="module">
    import '@Submodule/shared-css/styles.css';
    // TO DO: SWITCH TO MINIFIED HC SRC
    import Highcharts from 'highcharts';
    //import Highcharts from 'highcharts/highcharts.src.js';
    import HCExporting from 'highcharts/modules/exporting';
    import HCOfflineExporting from 'highcharts/modules/offline-exporting';
    import options from '@Project/options.json';
    import config from '@Project/base-chart-config.json';
    import {ChartType, ColorIndeces, UserOptions, Classes, ColorByPoint, SeriesCountMismatch} from './../store';
    import { get } from 'svelte/store';
    import {beforeUpdate, afterUpdate} from 'svelte';
    import updateChartConfig from '../scripts/update-chart-config';
    import Notices from './Notices.svelte';
    window.Highcharts = Highcharts; // TO DO:  form now ok will need to work out how HC is loaded.
    HCExporting(Highcharts);
    HCOfflineExporting(Highcharts);
    Highcharts.setOptions(options);
    config.title = config.title || {};
    config.title.text = undefined;
    config.exporting = {enabled:false};
    export function createChart(node){
        return Highcharts.chart(node, config);
    }
    window.Charts = [];
    //console.log(Highcharts.SVGElement.prototype.addClass);
    
    Highcharts.SVGElement.prototype.addClass = function (className, replace) {
        var currentClassName = replace ? '' : (this.attr('class') || '');
        // Trim the string and remove duplicates
        className = (className || '')
            .split(/ /g)
            .reduce(function (newClassName, name) {
                if (currentClassName.indexOf(name) === -1) {
                    let split = name.split(/-\d+$/);
                    if (split.length > 1 ) {
                        let regex = new RegExp(split[0] + '-\\d+$');
                        newClassName[0] = newClassName[0].replace(regex, '');
                    }
                    newClassName.push(name);
                }
                return newClassName;
            }, (currentClassName ?
                [currentClassName] :
                []))
            .join(' ');
        if (className !== currentClassName) {
            this.attr('class', className);
        }
        return this;
    };
            
</script>
<script>
    import {ChartLabel, ChartTitle, ChartSubtitle, ChartNotes, ChartSources, ChartCredit} from './../store';
    export let Chart;
    export let seriesCountMismatchNotice;
    export let chartWidth;
    export let size;
    let classes = [];
    let chartLabel;
    let chartTitle;
    let chartSubtitle;
    let chartNotes;
    let chartSources;
    let chartCredit;
    let notices = new Set();
    let previousWidth;
    beforeUpdate(() => {
        console.log(chartWidth);
    });
    afterUpdate(() => {
        if ( Chart && previousWidth && chartWidth !== previousWidth ){
            Chart.reflow();
        }
        previousWidth = chartWidth;
    });
    SeriesCountMismatch.subscribe(v => {
        notices[v ? 'add' : 'delete'](seriesCountMismatchNotice);
        notices = notices;
    });
    Classes.subscribe(v => {
        classes = v;
    });
    function containerUse(node){
        Chart = createChart(node);
        window.Charts.push(Chart);
        UserOptions.set(Chart.userOptions);
    }
    /*function replaceFn(_, p1, p2){
        return `<a href="${p1}">${p2.replace(/\//g, '/&#8203')}</a>`;
    }*/
    /* '<a href="$1">$2</a><span class="print-only">, $1</span>')
            .replace(/(\/)/g, '/&#8203;' )*/
    /*$:modifiedChartSources = (function(){
        //return chartSources.replace(/<a href="(.*?)">(.*?)<\/a>/g, replaceFn);
        return chartSources.replace(/(\/(?!\/)|[.-])/g, '$1&#8203;');
    })();*/
    ChartLabel.subscribe(v => {
        chartLabel = v;
    });
    ChartTitle.subscribe(v => {
        chartTitle = v;
    });
    ChartSubtitle.subscribe(v => {
        chartSubtitle = v;
    });
    ChartNotes.subscribe(v => {
        chartNotes = v;
    });
    ChartSources.subscribe(v => {
        chartSources = v;
    });
    ChartCredit.subscribe(v => {
        chartCredit = v;
    });
    ChartType.subscribe(v => {
        if ( Chart ){
            updateChartConfig(Chart, {chart: {type: v}});
        }
    });
    ColorIndeces.subscribe(v => {
        if (!v) return;
        const series = get(UserOptions).series;
        const colorByPoint = get(ColorByPoint);
        series.forEach((s,i) => {
            if ( colorByPoint[i]){
                s.colorIndex = undefined;
                s.data.forEach((d,j) => {
                    d.colorIndex = v[j];
                });
            } else {
                s.colorIndex = v[i];
                s.data.forEach(d => {
                    d.colorIndex = undefined;
                });
            }
        });
        updateChartConfig(Chart, {series});
        
    });
</script>
<style>
    .container {
        margin-top: 1rem;
    }
    .griffin-figure {
        margin: 0 auto;
        background-color: #fff;
    }
    .wrapper {
        position: relative;
    }
    .wrapper::before {
        content: attr(data-width) 'px';
        position: absolute;
        top: -10px;
    }
</style>

<Notices {notices} />
<div>
    <div data-width="{chartWidth}" class="wrapper js-figure-wrapper">
        <figure style="min-width:{chartWidth}px;max-width:{chartWidth}px;" class="ai2html-griffin-figure griffin-figure js-griffin js-{size}">
            <meta name="format-detection" content="telephone=no">
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
        <div class="container js-hc-container {classes.join(' ')}" use:containerUse></div>
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
            <p class="figure-note figure-note--source">
                {@html chartCredit}
            </p>
            {/if}
        </figcaption>
    </div>
</div>