<script context="module">
    import Banner from "./components/Banner.svelte";
    import DataTable from "@Component/DataTable.svelte";
    import SpriteDefs from "./sprite.svelte";
    import brandOptions from "./brand-options.json";
    import PreviewChart from "./components/PreviewChart.svelte";
    import DataInput from "@Component/DataInput.svelte";
    import SectionHead from "@Component/SectionHead.svelte";
    import Nav from "@Component/Nav.svelte";
    import ChartTypeSelector from '@Component/ChartTypeSelector.svelte';

    /*
     * TO DO: USING THIS proxy url probably not sufficient for production
     */
    const proxyURL = 'https://cors-anywhere.herokuapp.com/'; 
    let resolveAPI;
    const HighchartsAPI = new Promise(function (resolve) {
        resolveAPI = resolve;
    });
    fetch(proxyURL + "https://api.highcharts.com/highcharts/tree.json")
        .then((response) => response.json())
        .then((data) => resolveAPI(data));
</script>

<script>
    let Chart = "";
    let showDataInput = false;
    let data;
</script>

<style>
    h1 {
        width: 100%;
        background-color: #fff;
        text-align: center;
        position: sticky;
        padding: 0.67em 0;
        margin: 0;
        top: 0;
        z-index: 2;
    }
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
    .chart-container {
        flex-grow: 1;
        padding: 1rem;
        background-color: var(--background-shade, lightgray);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        height: calc(100vh - var(--banner-height, 75px));
        overflow-y: auto;
    }
    .loading-placeholder {
        height: 23px;
    }
    
</style>

<svelte:head>
    {@html brandOptions.googleFonts || ''}
</svelte:head>
<SpriteDefs />
<Banner />
<Nav />
{#if showDataInput}
    <DataInput bind:Chart bind:data bind:showDataInput />
{/if}
<div class="ctn ctn--full">
    <div class="table-chart-wrapper">
        <div
            class="left-column ctn--inner flex flex-column flex-ac"
            style="flex-grow: 1;">
            <h1>Griffin Chart Builder</h1>
            <section>
                <SectionHead text="Data" />
                {#if Chart}
                    <DataTable bind:showDataInput bind:Chart bind:data />
                {/if}
            </section>
            <section class="dummy" />
            <section class="dummy" />
            <section class="dummy" />
            <section class="dummy" />
        </div>
        <div class="chart-container">
            {#await HighchartsAPI}
            <div class="loading-placeholder">loading . . .</div>
            {:then APIData}
            <ChartTypeSelector {APIData} preferred={brandOptions.preferredChartTypes} isLimited="{brandOptions.limitToPreferredTypes}" />
            {:catch error}
            <div class="loading-placeholder">There was a problem loading the Highcharts API: {error}</div>
            {/await}
            <div>
                <PreviewChart bind:Chart />
            </div>
        </div>
    </div>
</div>
