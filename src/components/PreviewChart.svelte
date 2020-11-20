<script context="module">
    // TO DO: SWITCH TO MINIFIED HC SRC
    import Highcharts from 'highcharts/highcharts.src.js';
    import options from '@Project/options.json';
    import config from '@Project/base-chart-config.json';
    import {ChartType} from './../store';
    import {UserOptions} from './../store';
    import {ColorPalette} from './../store';
    Highcharts.setOptions(options);
    export function createChart(node){
        return Highcharts.chart(node, config);
    }
</script>
<script>
    export let Chart;
    let colorPalette;
    ColorPalette.subscribe(v => {
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
</script>
<style>
    .container {
        margin-top: 1rem;
    }
</style>
<div class="container {colorPalette}" use:containerUse></div>