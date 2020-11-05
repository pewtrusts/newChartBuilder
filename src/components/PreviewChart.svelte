<script context="module">
    import Highcharts from 'highcharts';
    import config from '@Project/config.json';
    import { ChartConfig } from '@Project/store.js';

    Highcharts.setOptions(config);
</script>
<script>
    let chart = undefined;
    let chartContainer = undefined;
    ChartConfig.subscribe(config => {
        if ( config.series.length == 0 || chartContainer == undefined ){
            return; // the initial config object has no series
        }
        if ( chart ){
            chart.update(config); // if chart exists, update it
        } else {
            chart = Highcharts.chart(chartContainer, config); // if not construct a new one
        }
    });
</script>
<style></style>
<div bind:this="{chartContainer}"></div>