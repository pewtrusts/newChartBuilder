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
    function widthHandler(){
        if (this.value == 'custom') {
            customWidth = true;
            return;
        }
        customWidth = false;
        ChartWidth.set(this.value);
    }
    function customWidthHandler(){
        ChartWidth.set(this.value);
    }
    function customHeightHandler(){
        ChartHeight.set({type: 'px', value: this.value});
    }
    ChartWidth.subscribe(v => {
        chartWidth = v;
    });
    ChartHeight.subscribe(v => {
        if (Chart){
            updateChartConfig(Chart, {
                chart: {
                    height: `${v.type == 'percent' ? v.value * 100 : v.value}${v.type == 'px' ? 'px' : '%'}`
                }
            });
            /**
             * so Highcharts userOptions property of the Chart instance doesn't actually reflect 1:1 the user
             * options passed in. if responsive conditions are met the userOptions are changed in response. 
             * we don't want the size of how the chart is displayed in the tool to affect the user options in
             * the code export, so he we have a brute force setting of chartHeight to the userOptions.
             */
            let _userOptions = get(UserOptions);
            _userOptions.chart.height = `${v.type == 'percent' ? v.value * 100 : v.value}${v.type == 'px' ? '' : '%'}`;
            UserOptions.set(_userOptions);

        }
    });
    function heightHandler(){
         if (this.value == 'custom') {
            customHeight = true;
            return;
        }
        ChartHeight.set({type: 'percent', value: this.value});
        customHeight = false;
    }
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
</style>
<div>
    <label for="width-selector">Chart width:</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select id="width-selector" on:change="{widthHandler}" name="chart-width">
        <option value="990">990px</option>
        <option selected value="650">650px</option>
        <option value="custom">custom</option>
    </select>
    {#if customWidth }
    <input on:change="{customWidthHandler}" type="number" increment="1" value="{chartWidth}"/>px
    {/if}
</div>
<div>
    <label for="height-selector">Chart height:</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select id="height-selector" on:change="{heightHandler}" name="chart-height">
        <option selected value="0.5625">16:9 (56.25% width)</option>
        <option value="1">Square (100% width)</option>
        <option value="custom">custom</option>
    </select>
    {#if customHeight }
        <input on:change="{customHeightHandler}" type="number" increment="1" value="{chartHeight}"/>px
    {/if}
</div>
<!-- svelte-ignore a11y-no-onchange -->
<label for="min-height">Minimum chart height:</label> 
<input id="min-height" type="number" on:change="{minHeightHandler}" increment="1" bind:value="{minHeight}" >