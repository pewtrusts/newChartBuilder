<script context="module">
    // TO DO: SWITCH TO MINIFIED HC SRC
    import Highcharts from 'highcharts/highcharts.src.js';
    import options from '@Project/options.json';
    import config from '@Project/base-chart-config.json';
    import {ChartType, ColorIndeces, UserOptions, SelectedColorPalette, ColorByPoint, SeriesCountMismatch} from './../store';
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
    export let Chart;
    export let seriesCountMismatchNotice;
    let colorPalette;
    let notices = new Set();
    SeriesCountMismatch.subscribe(v => {
        notices[v ? 'add' : 'delete'](seriesCountMismatchNotice);
        notices = notices;
    });
    SelectedColorPalette.subscribe(v => {
        colorPalette = v;
    });
    function containerUse(node){
        Chart = createChart(node);
        window.chart = Chart;
        UserOptions.set(Chart.userOptions);
    }
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
    
</style>

<Notices {notices} />

<div class="container {colorPalette}" use:containerUse></div>