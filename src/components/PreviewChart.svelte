<script context="module">
    import Highcharts from 'highcharts';
    import options from '@Project/options.json';
    import config from '@Project/base-chart-config.json';
    Highcharts.setOptions(options);
</script>
<script>
    export let Chart;
    function containerUse(node){
        Chart = Highcharts.chart(node, config);
    }
</script>
<style></style>
<div use:containerUse></div>