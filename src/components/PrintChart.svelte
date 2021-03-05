<script>
    import { Classes, PrintWidth, PrintHeight, UserOptions } from './../store';
    import convert from './../scripts/unit-conversions';
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
        config.chart.className = 'griffin griffin--for-print';
        window.PrintChart = window.Highcharts.chart(chartContainer, config);
    });
</script>
<style>
    .container {
        position: absolute;
        top: 0;
        width: 100%;
        padding: 1em 1em;
    }
    .chart-container {
        position: relative;
        margin: 0 auto;
        height: 300px;
        overflow: visible;
    }
    h2 {
        margin-top: 0;
    }
    h2::after {
        content: ' ' attr(data-width) 'in X ' attr(data-height) 'in';
        color: #767676;
        font-size: 1rem;
        font-weight: 400;
        
    }
</style>
<div class="container griffin-figure">
    <h2 data-width="{convert.pixelsToInches(printWidth)}" data-height="{convert.pixelsToInches(printHeight)}">Print preview</h2>
    <div bind:this="{chartContainer}" class="chart-container {classes.join(' ')}" style="width: {printWidth}px; height: {printHeight}px;"></div>
</div>