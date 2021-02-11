<script context="module">
    import Banner from "./components/Banner.svelte";
    import Settings from './components/Settings.svelte';
    import Start from './components/Start.svelte';
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
    import {ActiveSection, IsWorking} from './store';
    import { onMount } from 'svelte';

</script> 

<script>

    let seriesCountMismatchNotice = {
        label: 'Unused series',
        description: 'The selected chart type can only render one series, but the data supplied has more than one. Only the first series will be rendered.',
        type: 'warning'
    };
    let pictureIsMissingOrOldNotice = {
        label: 'Old or missing images',
        description: 'The images of the charts have not yet been generated or have become out of sync with changes made since they were last updated.' + 
                     ' Click on the notice to update the images ot navigate to the images section.',
        type: 'warning'
    }
    let Chart = "";
    let showDataInput = false;
    let data;
    let leftColumn;  
    let datatableContainer = null;
    let sections = [];
    let activeSection;
    IsWorking.subscribe(v => {
        document.body.classList[v ? 'add' : 'remove']('isWorking');
    });
    function pushSection(node){
        sections.push(node);
    }
    ActiveSection.subscribe(v => {
        activeSection = v.value;
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
        window.requestIdleCallback(function(){
            leftColumn.scrollTop = 0;
            const observerOptions = {
                root: leftColumn,
                rootMargin: '0px',
                threshold: 1
            }
            const observer = new IntersectionObserver(intersectionHandler, observerOptions);
            sections.forEach(section => {
                observer.observe(section.querySelector('div.observer'));
            });
        }, {timeout: 1000});
        
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
   .isHidden {
       visibility: hidden;
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
                <SectionHead text="Start" />
                <Start />
            </section>
            <section use:pushSection>
                <SectionHead text="Data" />
                {#if Chart}
                    <DataTable bind:datatableContainer bind:showDataInput bind:Chart bind:data {seriesCountMismatchNotice} />
                {/if}
            </section>
            <section use:pushSection>
                <SectionHead text="Text" />
                <Settings />
            </section>
            <section use:pushSection>
                <SectionHead text="Colors" />
                <Colors />
            </section>
            <section use:pushSection>
                <SectionHead text="Code" />
                <Code {pictureIsMissingOrOldNotice} />
            </section>
            
        </div>
        <div class:isHidden="{activeSection == 'start'}" class="chart-container">
            <ChartTypeSelector chartTypes="{brandOptions.chartTypes}" />
            <PreviewChart bind:Chart {seriesCountMismatchNotice} chartWidth="{650}" size="fullscreen"/>
            <PreviewChart {Chart} {seriesCountMismatchNotice} chartWidth="{366}" size="mobile"/>
        </div>
    </div>
</div>
