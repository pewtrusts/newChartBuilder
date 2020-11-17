<script context="module">
    // TO DO: SWITCH TO MINIFIED HC SRC
    import Highcharts from 'highcharts/highcharts.src.js';
    import options from '@Project/options.json';
    import config from '@Project/base-chart-config.json';
    import {ChartType} from './../store';
    Highcharts.setOptions(options);
    export function createChart(node){
        return Highcharts.chart(node, config);
    }
</script>
<script>
    export let Chart;
    function containerUse(node){
        Chart = createChart(node);
    }
    ChartType.subscribe(v => {
        if ( Chart ){
            Chart.update({chart: {type: v}}, true, true);
        }
    });
</script>
<style>
    .container {
        margin-top: 1rem;
    }
</style>
<div class="container" use:containerUse></div>