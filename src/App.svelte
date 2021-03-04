<script context="module">
    import Banner from "./components/Banner.svelte";
    import Settings from './components/Settings.svelte';
    import Start from './components/Start.svelte';
    import ListSavedCharts from './components/ListSavedCharts.svelte';
    import DataTable from "@Component/DataTable.svelte";
    import SpriteDefs from "./sprite.svelte";
    import brandOptions from "./brand-options.json";
    import PreviewChart from "./components/PreviewChart.svelte";
    import DataInput from "@Component/DataInput.svelte";
    import SectionHead from "@Component/SectionHead.svelte";
    import Nav from "@Component/Nav.svelte";
    import SaveChart from "@Component/SaveChart.svelte";
    import ChartTypeSelector from '@Component/ChartTypeSelector.svelte';
    import Code from '@Component/Code.svelte';
    import Colors from '@Component/Colors.svelte';
    import VerifySave from '@Component/VerifySave.svelte';
    import Dialog from '@Component/Dialog.svelte';
    import Print from '@Component/Print.svelte';
    import PrintChart from '@Component/PrintChart.svelte';
    import {ActiveSection, IsWorking} from './store';
    import { onMount } from 'svelte';
    import getImageData from './scripts/get-image-data';
    function picClickHandler(){
        IsWorking.set(true);
        requestIdleCallback(getImageData, { timeout: 2000 });
    }
    export const pictureIsMissingOrOldNotice = {
        label: 'Old or missing images',
        description: 'The images of the charts have not yet been generated or have become out of sync with changes made since they were last updated.' + 
                     ' Click on the notice to update the images or navigate to the images section.',
        type: 'warning',
        onclick: picClickHandler
    }
    const seriesCountMismatchNotice = {
        label: 'Unused series',
        description: 'The selected chart type can only render one series, but the data supplied has more than one. Only the first series will be rendered.',
        type: 'warning'
    };

</script> 

<script>

    
    let Chart = "";
    let showDataInput = false;
    let showVerify = false;
    let verifyPromise;
    let verifyResolve;
    let verifyReject;
    let data;
    let leftColumn;  
    let datatableContainer = null;
    let sections = [];
    let activeSection;
    let resolveSaved;
    let savedCharts = new Promise(function(resolve){
        resolveSaved = resolve;
    });
    let googleSheetHeaders = null;
    let loadedChart = false;
    let userId = null;
    let userName = null;
    let userEmail = null;
    let getSavedCharts;
    let dialog = null;
    let enablePrint = undefined;
    let clickSave = () => {};
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
    .right-column {
        position: relative;
        flex-grow: 1;
        height: calc(100vh - var(--banner-height, 75px));
        overflow-y: auto;
        border-left: 1px solid var(--medium-gray, gray);
    }
    .chart-container {
        width: 100%;
        padding: 1rem;
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        flex-direction: column;
    }
   .isHidden {
       visibility: hidden;
   }
   .saved-charts {
       background-color: var(--light-gray, #ccc);
       position: absolute;
       top: 0;
       min-height: calc(100vh - var(--banner-height, 75px));
       width: 100%;
       padding: 1em;
       padding-top: 0;
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
{#if dialog}
    <Dialog bind:dialog />
{/if}
{#if showDataInput}
    <DataInput bind:datatableContainer bind:Chart bind:data bind:showDataInput />
{/if}
{#if showVerify}
    <VerifySave bind:showVerify bind:loadedChart bind:verifyResolve bind:verifyReject />
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
                <Code {pictureIsMissingOrOldNotice} bind:dialog {clickSave} />
            </section>
            <section use:pushSection>
                <SectionHead text="Save" />
                <SaveChart 
                    bind:googleSheetHeaders 
                    bind:resolveSaved 
                    bind:savedCharts 
                    bind:loadedChart 
                    bind:showVerify 
                    bind:verifyPromise 
                    bind:verifyResolve 
                    bind:verifyReject
                    bind:userId
                    bind:userEmail
                    bind:userName
                    bind:getSavedCharts
                    bind:clickSave
                />
            </section>
            <section use:pushSection>
                <SectionHead text="Print" />
                <Print bind:enablePrint/>
            </section>
            
        </div>
        <div class="right-column">
            <div class:isHidden="{activeSection == 'start' || (enablePrint && activeSection == 'print')}" class="chart-container">
                <ChartTypeSelector chartTypes="{brandOptions.chartTypes}" />
                <PreviewChart bind:Chart {seriesCountMismatchNotice} chartWidth="{650}" size="fullscreen"/>
                <PreviewChart {Chart} {seriesCountMismatchNotice} chartWidth="{366}" size="mobile"/>
            </div>
            <div class="saved-charts" class:isHidden="{activeSection !== 'start' || (enablePrint && activeSection == 'print')}">
                <ListSavedCharts 
                    bind:resolveSaved
                    bind:savedCharts 
                    bind:loadedChart 
                    bind:googleSheetHeaders
                    bind:userId
                    bind:userEmail
                    bind:userName
                    bind:getSavedCharts
                />
            </div>
            {#if enablePrint && activeSection == 'print'}
                <PrintChart />
            {/if}
        </div>
    </div>
</div>
