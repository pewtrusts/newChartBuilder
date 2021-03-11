<script>
    import {ChartWidth, ChartHeight, MinHeight, UserOptions} from './../store';
    import { get } from 'svelte/store'
    import updateChartConfig from '../scripts/update-chart-config';
    export let Chart;
    let minHeight;
    let chartWidth;
    let chartHeight;
    let customHeight = false;
    let customWidth = false;
    let customHeightValue;
    $: widthValue = (function(){ // need to bind the selectors values for when charts are loaded
        if (chartWidth == undefined){
            customWidth = false;
            return '650';
        }
        if (!['650','990'].includes(chartWidth)){
            customWidth = true;
            return 'custom'
        }
        customWidth = false;
        return chartWidth;
    })();
    $: heightValue = (function(){ // need to bind the selectors values for when charts are loaded
        if ( chartHeight == undefined ){
            customHeight = false;
            return '56.25%';
        }
        if (!['100%','56.25%'].includes(chartHeight)){
            customHeight = true;
            return 'custom';
        }
        customHeight = false;
        return chartHeight;
    })();
    function widthHandler(){
        if (this.value == 'custom') {
            customWidth = true;
            return;
        }
        customWidth = false;
        ChartWidth.set(this.value);
    }
    function heightHandler(){
         if (this.value == 'custom') {
            customHeight = true;
            return;
        }
        customHeight = false;
        ChartHeight.set(this.value);
    }
    function customWidthHandler(){
        ChartWidth.set(this.value);
    }
    function customHeightHandler(){
        ChartHeight.set(chartHeight);
    }
    ChartWidth.subscribe(v => {
        chartWidth = v;
    });
    ChartHeight.subscribe(v => {
        chartHeight = v;
        if (Chart){
            updateChartConfig(Chart, {
                chart: {
                    height: chartHeight
                }
            });
            /**
             * so Highcharts userOptions property of the Chart instance doesn't actually reflect 1:1 the user
             * options passed in. if responsive conditions are met the userOptions are changed in response. 
             * we don't want the size of how the chart is displayed in the tool to affect the user options in
             * the code export, so he we have a brute force setting of chartHeight to the userOptions.
             */
            let _userOptions = get(UserOptions);
            _userOptions.chart.height = chartHeight;
            UserOptions.set(_userOptions);

        }
    });
    
    function minHeightHandler(){
        MinHeight.set(this.value);
    }
    MinHeight.subscribe(v => {
        minHeight = v;
        if (Chart){
            let config = get(UserOptions);
            config.responsive.rules[0] = {
                "chartOptions": {
                "chart": {
                    "height": v
                }
                },
                "condition": {
                "maxHeight": v
                }
            };
            updateChartConfig(Chart, config);
        }
    });
</script>
<style>
    select {
        display: inline-block;
    }
    input[type=number]{
        display: inline-block;
        width: 100px;
    }
    .custom-height-form {
        display: inline-block;
    }
    .custom-height-form input[type=text]{
        border: 1px solid #ccc;
        border-radius: 0;
        line-height: 1.5;
        color: var(--text-color, #000);
        font-size: 0.85em;
    }
</style>
<div>
    <label for="width-selector">Chart width:</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select id="width-selector" on:change="{widthHandler}" name="chart-width" bind:value="{widthValue}">
        <option value="990">990px</option>
        <option value="650">650px</option>
        <option value="custom">custom</option>
    </select>
    {#if customWidth }
    <input on:change="{customWidthHandler}" type="number" increment="1" value="{chartWidth}"/>px
    {/if}
</div>
<div>
    <label for="height-selector">Chart height:</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select id="height-selector" on:change="{heightHandler}" name="chart-height" bind:value="{heightValue}">
        <option value="56.25%">16:9 (56.25% width)</option>
        <option value="100%">Square (100% width)</option>
        <option value="custom">custom</option>
    </select>
    {#if customHeight }
        <form class="custom-height-form" on:submit|preventDefault="{customHeightHandler}">
            <input placeholder="e.g., 100, 100px, 75%" type="text" bind:value="{chartHeight}" pattern="\d+|\d+px|\d+%|\d+\.\d+%"/>
            <input class="button button--primary" type="submit">
        </form>
    {/if}
</div>
<!-- svelte-ignore a11y-no-onchange -->
<label for="min-height">Minimum chart height:</label> 
<input id="min-height" type="number" on:change="{minHeightHandler}" increment="1" bind:value="{minHeight}" >