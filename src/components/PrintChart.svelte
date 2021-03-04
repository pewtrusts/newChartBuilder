<script>
    import { Classes, PrintWidth, PrintHeight, UserOptions } from './../store';
    import { afterUpdate } from 'svelte';
    let printWidth;
    let printHeight;
    let chartContainer;
    let config;
    let classes = [];
    Classes.subscribe(v => {
        classes = v;
    });
    PrintWidth.subscribe(v => {
        printWidth = v;
    });
    PrintHeight.subscribe(v => {
        printHeight = v;
    });
    UserOptions.subscribe(v => {
        config = v;
    });
    afterUpdate(() => {
        console.log(window);
        window.PrintChart = window.Highcharts.chart(chartContainer, config);
    });
</script>
<style>
    .container {
        position: absolute;
        top: 0;
        width: 100%;
        padding: 1em;
    }
    .chart-container {
        margin: 0 auto;
        background-color: gray;
        height: 300px;
    }
</style>
<div class="container">
    <div bind:this="{chartContainer}" class="chart-container highcharts-print {classes.join(' ')}" style="width: {printWidth}px; height: {printHeight}px;"></div>
</div>