<script context="module">
    // TO DO: SWITCH TO MINIFIED HC SRC
    import Highcharts from 'highcharts/highcharts.src.js';
    import options from '@Project/options.json';
    import config from '@Project/base-chart-config.json';
    Highcharts.setOptions(options);
    export function createChart(node){
        return Highcharts.chart(node, config);
    }
</script>
<script>
    export let Chart;
    export let rawData; 
    function containerUse(node){
        Chart = createChart(node);
    }
</script>
<style>
    .hidden {
        visibility: hidden;
    }
</style>
<div class:hidden="{!rawData}" use:containerUse></div>