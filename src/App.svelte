<script context="module">
    import Banner from "./components/Banner.svelte";
    import DataTable from '@Component/DataTable.svelte';
    import SpriteDefs from './sprite.svelte';
    import brandOptions from './brand-options.json';
    import ChartContainer from "./components/ChartContainer.svelte";
</script>
<script>

    let Chart = '';
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
<Banner />
<div class="ctn ctn--full">
    <div class="table-chart-wrapper">   
        <div style="flex-grow: 1;">
            {#if Chart }
        	<DataTable bind:Chart />
            {/if}
        </div>
        <ChartContainer bind:Chart />
    </div>

</div>
