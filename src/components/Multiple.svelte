<script context="module">
    import brandOptions from "./../brand-options.json";
    import MultiChart from './MultiChart.svelte';
    import { s } from '../store';
</script>
<script>
    let multipleCharts = [];
    let multiLayout = 1;
    s.LoadedMultipleCharts.subscribe(v => {
        multipleCharts = v;
    });
    s.MultiLayout.subscribe(v => {
        multiLayout = v;
    });
    function layoutHandler(){
        s.MultiLayout.set(+this.value);
    }
    function createMultiple(){
        s.BuildMode.set('multiple');
    }
</script>
<p><strong>(In beta)</strong></p>
<p><strong>Please note:</strong> this is a work in progress. Loading saved multiple charts is not working yet. To get the code for a multiple chart,
    go throught the steps below and select "Create chart." Then grab the code from the code section.
</p>
<p>
Build a single figure with multiple charts. Create and save each chart separately first and then combine them. The first chart you select will
provide the {brandOptions.chartLabelName.toLowerCase()}, {brandOptions.chartTitleName.toLowerCase()}, caption, notes, and source
for the group. Each chart will have its own {brandOptions.chartSubtitleName.toLowerCase()}. Descriptions from each chart
will be combined into one description for the whole collection.
</p>
<h3>Steps</h3>
<ol>
    <li>Select your first chart from the list of saved charts. This chart will provide the {brandOptions.chartLabelName.toLowerCase()}, {brandOptions.chartTitleName.toLowerCase()}, caption, notes, and source
for the group.</li>
<li>Select any number of subsequent charts. Each chart will have its own {brandOptions.chartSubtitleName.toLowerCase()}</li>
<li>Select the layout type below</li>
</ol>
<label>Layout:
    <!-- svelte-ignore a11y-no-onchange -->
    <select on:change="{layoutHandler}">
    {#each [1,2,3,4,5,6] as v}
    <option selected="{multiLayout == v}" value="{v}">{v} up</option>
    {/each}
</select></label>
{#each multipleCharts as chart, i}
    <MultiChart {chart} {i} />
{/each}
{#if multipleCharts.length}
    <p></p>
    <button on:click|preventDefault="{createMultiple}" disabled="{multipleCharts.length < 2}" class="button button--primary">
        Create it
    </button>
{/if}