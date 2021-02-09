<script context="module">
    import '@Submodule/shared-css/styles.css';
    // TO DO: SWITCH TO MINIFIED HC SRC
    import Highcharts from 'highcharts/highcharts.src.js';
    import options from '@Project/options.json';
    import config from '@Project/base-chart-config.json';
    import {ChartType, ColorIndeces, UserOptions, ChartPaletteClassname, ColorByPoint, SeriesCountMismatch} from './../store';
    import { get } from 'svelte/store';
    import updateChartConfig from '../scripts/update-chart-config';
    import Notices from './Notices.svelte';
    Highcharts.setOptions(options);
    export function createChart(node){
        return Highcharts.chart(node, config);
    }
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
    let colorPaletteClass;
    let chartLabel;
    let chartTitle;
    let chartSubtitle;
    let chartNotes;
    let chartSources;
    let chartCredit;
    let notices = new Set();
    SeriesCountMismatch.subscribe(v => {
        notices[v ? 'add' : 'delete'](seriesCountMismatchNotice);
        notices = notices;
    });
    ChartPaletteClassname.subscribe(v => {
        colorPaletteClass = v;
    });
    function containerUse(node){
        Chart = createChart(node);
        window.chart = Chart;
        UserOptions.set(Chart.userOptions);
    }
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
        box-sizing: content-box;
        border: 21px solid #fff;
        background-color: #fff;
    }
</style>

<Notices {notices} />
<div>
    <div class="wrapper">
        <figure style="min-width:650px;max-width:650px;" class="ai2html-griffin-figure griffin-figure js-griffin">
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
        <div class="container {colorPaletteClass}" use:containerUse></div>
        <figcaption>
            {#if chartNotes}
            <p class="figure-note">
                {chartNotes}
            </p>
            {/if}
            {#if chartSources}
            <p class="figure-note figure-note--source">
                {chartSources}
            </p>
            {/if}
            {#if chartCredit}
            <p class="figure-note figure-note--source">
                {chartCredit}
            </p>
            {/if}
        </figcaption>
    </div>
</div>