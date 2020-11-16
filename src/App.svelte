<script context="module">
    import Banner from "./components/Banner.svelte";
    import DataTable from '@Component/DataTable.svelte';
    import SpriteDefs from './sprite.svelte';
    import brandOptions from './brand-options.json';
    import ChartContainer from "./components/ChartContainer.svelte";
    import DataInput from '@Component/DataInput.svelte';
    import SectionHead from '@Component/SectionHead.svelte';
    import Nav from '@Component/Nav.svelte';
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
    .dummy {
        width: 100%;
        min-height: 300px;
        background-color: #f0f0f0;
        margin-bottom: 2rem;
    }
    .left-column {
        height: calc(100vh - var(--banner-height, 75px));
        overflow-y: auto;
        padding-left: 40px;
    }
    section {
        margin-top: 1rem;
    }
</style>
<svelte:head>
    {@html brandOptions.googleFonts || ''}
</svelte:head>
<SpriteDefs />
<Banner />
<Nav />
{#if showDataInput }
    <DataInput bind:Chart bind:data bind:showDataInput />
{/if}
<div class="ctn ctn--full">
    <div class="table-chart-wrapper">   
        <div class="left-column ctn--inner flex flex-column flex-ac" style="flex-grow: 1;">
            <section>
                <SectionHead text="Data" />
                {#if Chart }
            	<DataTable bind:showDataInput bind:Chart bind:data />
                {/if}
            </section>
            <section class="dummy"></section>
            <section class="dummy"></section>
            <section class="dummy"></section>
            <section class="dummy"></section>
        </div>
        <ChartContainer bind:Chart />
    </div>
</div>
