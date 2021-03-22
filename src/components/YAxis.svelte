<script>
    import { s, initDynamicStore } from './../store';
    let yAxes;
    let yAxisExtents = {};
    s.ChartConfig.subscribe(v => {
        yAxes = v.yAxis;
    });
    function yAxisSubmit(){
        const data =  new FormData(this);
        for (let [name,value] of data) {
            s[name.charAt(0).toUpperCase() + name.slice(1)].set(value)
        }
    }
</script>
<h3>Y Ax{yAxes.length == 1 ? 'i' : 'e'}s</h3>
<form on:submit|preventDefault={yAxisSubmit}>
    {#each yAxes as _, i}
        {#if yAxes.length > 1 }
        <h4>Axis {i + 1}</h4>
        {/if}
        <label>Min: <input use:initDynamicStore="{{configType: 'highcharts', localObj: yAxisExtents}}" name="yAxis[{i}].min" type="text" bind:value="{yAxisExtents[`yAxisMins[${i}]`]}"></label>
        <label>Max: <input use:initDynamicStore="{{configType: 'highcharts', localObj: yAxisExtents}}" name="yAxis[{i}].max" type="text" bind:value="{yAxisExtents[`yAxisMaxes[${i}]`]}"></label>
    {/each}
    <input class="button button--primary" type="submit">
</form>
