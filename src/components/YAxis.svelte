<script>
    import { s, initDynamicStore } from './../store';
    let yAxes;
    let yAxisLocalValues = {};
    let yAxisDecimals = undefined;
    s.YAxisDecimals.subscribe(v => {
        /**
         * TODO multipl axes
        */
        if (v) {
            yAxisDecimals = +v;
        } else {
            yAxisDecimals = undefined;
        }
    });
    function decimalHandler(){
        s.YAxisDecimals.set(+this.value || undefined);
    }
    s.ChartConfig.subscribe(v => {
        yAxes = v.yAxis;
    });
    function yAxisSubmit(){
        const data =  new FormData(this);
        for (let [name,value] of data) {
            s[name.charAt(0).toUpperCase() + name.slice(1)].set(value || undefined)
        }
    }
    
</script>
<style>
    label {
        display: block;
    }
</style>
<h3>Y Ax{yAxes.length == 1 ? 'i' : 'e'}s</h3>
<form on:submit|preventDefault={yAxisSubmit}>
    {#each yAxes as _, i}
        {#if yAxes.length > 1 }
        <h4>Axis {i + 1}</h4>
        {/if}
        <label>Title: <input use:initDynamicStore="{{configType: 'highcharts', localValue: yAxisLocalValues}}" name="yAxis[{i}].title.text" type="text" bind:value="{yAxisLocalValues[`yAxisTitle[${i}]`]}"></label>
        <label>Min:   <input use:initDynamicStore="{{configType: 'highcharts', localValue: yAxisLocalValues}}" name="yAxis[{i}].min" type="text" bind:value="{yAxisLocalValues[`yAxisMins[${i}]`]}"></label>
        <label>Max:   <input use:initDynamicStore="{{configType: 'highcharts', localValue: yAxisLocalValues}}" name="yAxis[{i}].max" type="text" bind:value="{yAxisLocalValues[`yAxisMaxes[${i}]`]}"></label>
        <label>Decimals: <input on:change="{decimalHandler}" type="number" bind:value="{yAxisDecimals}"></label>  
    {/each}
    <input class="button button--primary" type="submit">
</form>
