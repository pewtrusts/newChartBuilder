<script>
    import { s } from './../store';
    import convert from './../scripts/unit-conversions';
    import { afterUpdate } from 'svelte';
    import cloneDeep from 'lodash.clonedeep';
    const _={cloneDeep};
    let printWidth;
    let printHeight;
    let chartContainer;
    let config;
    let classes = [];
    s.Classes.subscribe(v => {
        classes = v;
    });
    s.PrintWidth.subscribe(v => {
        printWidth = v;
    });
    s.PrintHeight.subscribe(v => {
        printHeight = v;
    });
    s.ChartConfig.subscribe(v => {
        config = v;
    });
    afterUpdate(() => {
        const _config = _.cloneDeep(config);
        _config.chart.height = printHeight;
        _config.chart.className = 'griffin griffin--for-print';
        window.PrintChart = window.Highcharts.chart(chartContainer, _config);
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
    <h2 data-width="{convert.pixelsToInches(printWidth)}" data-height="{convert.pixelsToInches(printHeight)}">Print preview (WIP)</h2>
    <div bind:this="{chartContainer}" class="chart-container {classes.join(' ')}" style="width: {printWidth}px; height: {printHeight}px;"></div>
</div>