<script context="module">
   // import DataTable from '@Component/DataTable.svelte';
    //import PreviewChart from '@Component/PreviewChart.svelte';
    import DataInput from '@Component/DataInput.svelte';
   // import SpriteDefs from './sprite.svelte';
   /* let dataResolve;
    let dataPromise = new Promise(function(resolve){
        dataResolve = resolve;
    });*/
    import Highcharts from 'highcharts';
    import options from '@Project/options.json';
    import config from '@Project/base-chart-config.json';
    //import { ChartConfig } from '@Project/store.js';
    Highcharts.setOptions(options);

</script>
<script>
    let chart = undefined;
    function containerUse(node){
        chart = Highcharts.chart(node, config);
    }
</script>
<style></style>
<!--<SpriteDefs />
<h1>App</h1>
<DataInput {dataResolve} /> -->
<div use:containerUse></div>
{#if chart}
<DataInput bind:chart />
{/if}
<!--<PreviewChart {chartResolve} /> -->
<!--<DataTable {data} />
{/await}-->