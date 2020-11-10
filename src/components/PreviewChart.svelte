<script context="module">
    import Highcharts from 'highcharts';
    import config from '@Project/config.json';
    import { ChartConfig } from '@Project/store.js';

    Highcharts.setOptions(config);
</script>
<script>
    let chart = undefined;
    let containerResolve;
    let containerPromise = new Promise(resolve => {
        containerResolve = resolve;
    });
    function containerUse(node){
        containerResolve(node);
    }
    ChartConfig.subscribe(async config => {
        const chartContainer = await containerPromise;
        if ( config.series.length == 0 ){
            return; // the initial config object has no series
        }
        if ( chart ){
            chart.update(config); // if chart exists, update it
        } else {
            chart = Highcharts.chart(chartContainer, config); // if not construct a new one
        }
        console.log(chart);
    });
</script>
<style></style>
<div use:containerUse></div>