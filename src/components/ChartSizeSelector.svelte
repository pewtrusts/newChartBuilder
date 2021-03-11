<script context="module">
    let figure;
    let chart;
    export function _setRealHeight(nominal){
        figure = figure || document.querySelector('.js-fullscreen');
        chart = chart || document.querySelector('.js-fullscreen .js-hc-container');
        const nonChartHeight = figure.offsetHeight - chart.offsetHeight;
        if ( nominal.slice(-1) == '%'){
            let width = figure.offsetWidth;
            let desiredTotalHeight = width * parseInt(nominal) / 100;
            let desiredChartHeight = desiredTotalHeight - nonChartHeight;
            let percentage = +((100 * desiredChartHeight / width).toFixed(2));
            return {value: Math.max(10, percentage) + '%', warn: percentage < 10};
        } else {
            let value = +parseInt(nominal) - nonChartHeight;
            return {value: Math.max(value,100), warn: value < 100};
        }

    }
</script>
<script>
    /**
     * TO DO: min chart heigth needs to be nominal and calculated just like others. trigger recalc on text change, on load, and 
     * on width change. (or just afterUpdate?)
     * 
     * LOAD saved charts.
     */
    import {ChartWidth, ChartHeight, MinHeight, UserOptions} from './../store';
    import Notices from './Notices.svelte';
    import { get } from 'svelte/store'
    import updateChartConfig from '../scripts/update-chart-config';
    export let Chart;
    let minHeight;
    let chartWidth;
    let chartHeight;
    let nominalHeightValue = '56.25%';
    let nominalCustomHeight = '56.25%';
    let customHeight = false;
    let customWidth = false;
    let outOfBoundsNotice = {
        label: 'Height value too small',
        description: 'The text around the chart (title, subtitle, notes, etc.) take up too much space for the entire figure to be the height you selected.',
        type: 'warning'
    };
    let notices = new Set();
    function setRealHeight(nominal){
        const calc = _setRealHeight(nominal);
        notices[calc.warn ? 'add' : 'delete'](outOfBoundsNotice);
        notices = notices;
        ChartHeight.set(calc.value);
    }
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
    
   /* $: heightValue = (function(){ // nominal value of the selector. need to bind the selectors values for when charts are loaded
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
    })();*/
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
        setRealHeight(this.value);
        //ChartHeight.set();
    }
    function customWidthHandler(){
        ChartWidth.set(this.value);
    }
    function customHeightHandler(){
        setRealHeight(nominalCustomHeight);
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
    <Notices {notices} />
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
    <select id="height-selector" on:change="{heightHandler}" name="chart-height" bind:value="{nominalHeightValue}">
        <option value="56.25%">16:9 (56.25% width)</option>
        <option value="100%">Square (100% width)</option>
        <option value="custom">custom</option>
    </select>
    {#if customHeight }
        <form class="custom-height-form" on:submit|preventDefault="{customHeightHandler}">
            <input placeholder="e.g., 100, 100px, 75%" type="text" bind:value="{nominalCustomHeight}" pattern="\d+|\d+px|\d+%|\d+\.\d+%"/>
            <input class="button button--primary" type="submit">
        </form>
    {/if}
</div>
<!-- svelte-ignore a11y-no-onchange -->
<label for="min-height">Minimum chart height:</label> 
<input id="min-height" type="number" on:change="{minHeightHandler}" increment="1" bind:value="{minHeight}" >