<script context="module">
    import Banner from "./components/Banner.svelte";
    import DataTable from '@Component/DataTable.svelte';
    import SpriteDefs from './sprite.svelte';
    import brandOptions from './brand-options.json';
    import ChartContainer from "./components/ChartContainer.svelte";
    import DataInput from '@Component/DataInput.svelte';
</script>
<script>
    let Chart = '';
    let showDataInput = false;
    let data;
</script>
<style>
    .table-chart-wrapper {
        display: flex;
        align-items: stretch;
       
    }
</style>
<svelte:head>
    {@html brandOptions.googleFonts || ''}
</svelte:head>
<SpriteDefs />
<Banner />
{#if showDataInput }
    <DataInput bind:Chart bind:data bind:showDataInput />
{/if}
<div class="ctn ctn--full">
    <div class="table-chart-wrapper">   
        <div class="ctn--inner flex flex-center" style="flex-grow: 1;">
            <div>
                {#if Chart }
            	<DataTable bind:showDataInput bind:Chart bind:data />
                {/if}
            </div>
        </div>
        <ChartContainer bind:Chart />
    </div>
</div>
