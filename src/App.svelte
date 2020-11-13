<script context="module">
    import DataTable from '@Component/DataTable.svelte';
    import PreviewChart from '@Component/PreviewChart.svelte';
    import DataInput from '@Component/DataInput.svelte';
    import SpriteDefs from './sprite.svelte';
    import brandOptions from './brand-options.json';
</script>
<script>
    let Chart = '';
    let rawData = '';
</script>
<style>
    .table-chart-wrapper {
        display: flex;
        align-items: flex-start;
    }
</style>
<svelte:head>
    {@html brandOptions.googleFonts || ''}
</svelte:head>
<SpriteDefs />
{#if Chart && !rawData}
<DataInput bind:Chart bind:rawData />
{/if}
<div class="table-chart-wrapper">
    {#if Chart && rawData}
    <div>
    	<DataTable bind:data="{rawData}" bind:Chart />
    </div>
    {/if}
    <div style="flex-grow: 1;">
        <PreviewChart {rawData} bind:Chart />
    </div>
</div>
