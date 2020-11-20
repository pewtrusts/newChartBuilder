<script context="module">
    // TO DO: SWITCH TO MINIFIED HC SRC
    import Highcharts from 'highcharts/highcharts.src.js';
    import options from '@Project/options.json';
    import config from '@Project/base-chart-config.json';
    import {ChartType, ColorIndeces, UserOptions, SelectedColorPalette} from './../store';
    import { get } from 'svelte/store';
    Highcharts.setOptions(options);
    export function createChart(node){
        return Highcharts.chart(node, config);
    }
</script>
<script>
    export let Chart;
    let colorPalette;
    SelectedColorPalette.subscribe(v => {
        colorPalette = v;
    });
    function containerUse(node){
        Chart = createChart(node);
        UserOptions.set(Chart.userOptions);
    }
    ChartType.subscribe(v => {
        if ( Chart ){
            Chart.update({chart: {type: v}}, true, true);
            UserOptions.set(Chart.userOptions);
        }
    });
    ColorIndeces.subscribe(v => {
        if (!v) return;
        const series = get(UserOptions).series;
        series.forEach((s,i) => {
            s.colorIndex = v[i];
        });
        Chart.update({series}, true, true);
        UserOptions.set(Chart.userOptions);
    });
</script>
<style>
    .container {
        margin-top: 1rem;
    }
</style>
<div class="container {colorPalette}" use:containerUse></div>