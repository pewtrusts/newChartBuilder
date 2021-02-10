<script context="module">
    import Banner from "./components/Banner.svelte";
    import Settings from './components/Settings.svelte';
    import DataTable from "@Component/DataTable.svelte";
    import SpriteDefs from "./sprite.svelte";
    import brandOptions from "./brand-options.json";
    import PreviewChart from "./components/PreviewChart.svelte";
    import DataInput from "@Component/DataInput.svelte";
    import SectionHead from "@Component/SectionHead.svelte";
    import Nav from "@Component/Nav.svelte";
    import ChartTypeSelector from '@Component/ChartTypeSelector.svelte';
    import Code from '@Component/Code.svelte';
    import Colors from '@Component/Colors.svelte';
    import {ActiveSection} from './store';
    import { onMount } from 'svelte';

</script> 

<script>
    let seriesCountMismatchNotice = {
        label: 'Unused series',
        description: 'The selected chart type can only render one series, but the data supplied has more than one. Only the first series will be rendered.',
        type: 'warning'
    };
    let Chart = "";
    let showDataInput = false;
    let data;
    let leftColumn;  
    let datatableContainer = null;
    let sections = [];
    function pushSection(node){
        sections.push(node);
    }
    ActiveSection.subscribe(v => {
        if (!leftColumn) return;
        if ( v.method == 'click'){
            let anchor = leftColumn.querySelector(`a#${v.value}`);
            anchor.scrollIntoView();
        }
    });
    function intersectionHandler(e){
        const intersecting = e.find(_e => _e.isIntersecting);
        if ( intersecting ){
            ActiveSection.set({method: 'scroll', value: intersecting.target.dataset.section});
        }
    }
    onMount(() => {
        const observerOptions = {
            root: leftColumn,
            rootMargin: '0px',
            threshold: 1
        }
        const observer = new IntersectionObserver(intersectionHandler, observerOptions);
        sections.forEach(section => {
            observer.observe(section.querySelector('div.observer'));
        });

    });
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
        z-index: 3;
    }
    .table-chart-wrapper {
        display: flex;
        align-items: stretch;
    }
    .left-column {
        height: calc(100vh - var(--banner-height, 75px));
        overflow-y: auto;
        padding-left: calc(40px + 1rem);
        max-width: 42%;
    }
    .chart-container {
        flex-grow: 1;
        padding: 1rem;
        border-left: 1px solid var(--medium-gray, gray);
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        flex-direction: column;
        height: calc(100vh - var(--banner-height, 75px));
        overflow-y: auto;
    }

   
</style>

<svelte:head>
    {@html brandOptions.googleFonts || ''}
    {#if brandOptions.externalStylesheets[process.env.NODE_ENV].length > 0 }
    {#each brandOptions.externalStylesheets[process.env.NODE_ENV] as sheet}
        <link rel="stylesheet" href="{sheet}" />
    {/each}
    {/if}
</svelte:head>
<SpriteDefs />
<Banner />
<Nav />
{#if showDataInput}
    <DataInput bind:datatableContainer bind:Chart bind:data bind:showDataInput />
{/if}
<div class="ctn ctn--full">
    <div class="table-chart-wrapper">
        <div bind:this="{leftColumn}"
            class="left-column ctn--inner flex flex-column flex-ac"
            style="flex-grow: 1;">
            <h1>Griffin Chart Builder</h1>
            <section use:pushSection>
                <SectionHead text="Data" />
                {#if Chart}
                    <DataTable bind:datatableContainer bind:showDataInput bind:Chart bind:data {seriesCountMismatchNotice} />
                {/if}
            </section>
            <section use:pushSection>
                <SectionHead text="Settings" />
                <Settings />
            </section>
            <section use:pushSection>
                <SectionHead text="Colors" />
                <Colors />
            </section>
            <section use:pushSection>
                <SectionHead text="Code" />
                <Code />
            </section>
            
        </div>
        <div class="chart-container">
            <ChartTypeSelector chartTypes="{brandOptions.chartTypes}" />
            <PreviewChart bind:Chart {seriesCountMismatchNotice} chartWidth="{650}" size="fullscreen"/>
            <PreviewChart bind:Chart {seriesCountMismatchNotice} chartWidth="{366}" size="mobile"/>
        </div>
    </div>
</div>
