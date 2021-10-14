<script context="module">
    import brandOptions from "./../brand-options.json";
    import MultiChart from './MultiChart.svelte';
    import { s } from '../store';
</script>
<script>
    let multipleCharts = [];
    s.LoadedMultipleCharts.subscribe(v => {
        multipleCharts = v;
    });
</script>
<p>
Build a single figure with multiple charts. Create and save each chart separately first and then combine them. The first chart you select will
provide the {brandOptions.chartLabelName.toLowerCase()}, {brandOptions.chartTitleName.toLowerCase()}, caption, notes, and source
for the group. Each chart will have its own {brandOptions.chartSubtitleName.toLowerCase()}.
</p>
<h3>Steps</h3>
<ol>
    <li>Select your first chart from the list of saved charts. This chart will provide the {brandOptions.chartLabelName.toLowerCase()}, {brandOptions.chartTitleName.toLowerCase()}, caption, notes, and source
for the group.</li>
<li>Select any number of subsequent charts. Each chart will have its own {brandOptions.chartSubtitleName.toLowerCase()}</li>
</ol>
{#each multipleCharts as chart, i}
    <MultiChart {chart} {i} />
{/each}
{#if multipleCharts.length}
    <p></p>
    <button disabled="{multipleCharts.length < 2}" class="button button--primary">
        Save it
    </button>
{/if}