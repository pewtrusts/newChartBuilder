<script context="module">
    import Login from './Login.svelte'
    
    import { s, initDynamicStore } from './../store';
    function stackingHandler(){
        const value = this.value == 'none' ? undefined : this.value;
        s.Stacking.set(value);
    }
</script>
<script>

    export let savedCharts;
    let project;
    let stacking;
    let yAxes;
    let yAxisExtents = {};
    s.ChartProject.subscribe(v => {
        project = v;
    });
    s.Stacking.subscribe(v => {
        stacking = v;
    });
    s.ChartConfig.subscribe(v => {
        yAxes = v.yAxis;
    });
    function changeHandler(){
        s.ChartProject.set(this.value);
    }
    function yAxisSubmit(){
        const data =  new FormData(this);
        for (let [name,value] of data) {
            s[name.charAt(0).toUpperCase() + name.slice(1)].set(value)
        }
    }
</script>
<style>
    label {
        display: block;
    }
</style>
{#await savedCharts}
<Login reason="to load previous projects" />
{:then _}
<label for="project-list--settings">Project name (select existing or add a new one):</label>
<input
    value={project}
    class="datalist-input"
    id="project-list--settings"
    name="project"
    list="saved-projects"
    type="text"
    on:change="{changeHandler}"
/>
<p>
    The project name is necessary if you are designing a chart for project with custom styles. Otherwise, the project name is optional.
    Saved charts will have the project name saved with them for easier retrieval later.</p>
{/await}
<label for="stacking-selector">Stacking:</label>
<!-- svelte-ignore a11y-no-onchange -->
<select on:change="{stackingHandler}" name="stacking" id="stacking-selector" bind:value="{stacking}">
    <option value="none">None</option>
    <option value="normal">Normal</option>
    <option value="percent">Percent</option>
</select>
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
