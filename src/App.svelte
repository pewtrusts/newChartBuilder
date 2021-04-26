<script context="module">
    import { onMount } from 'svelte';
    import cloneDeep from 'lodash.clonedeep';
    const _= {cloneDeep};
    
    import SpriteDefs from "./sprite.svelte";
    import brandOptions from "./brand-options.json";
    import {s} from './store';
    
    import Banner from "./components/Banner.svelte";
    import ChartSizeSelector from '@Component/ChartSizeSelector.svelte';
    import ChartTypeSelector from '@Component/ChartTypeSelector.svelte';
    import DataInput from "@Component/DataInput.svelte";
    import DataTable from "@Component/DataTable.svelte";
    import ListSavedCharts from './components/ListSavedCharts.svelte';
    import Nav from "@Component/Nav.svelte";
    import PreviewChart from "./components/PreviewChart.svelte";
    import SaveChart from "@Component/SaveChart.svelte";
    import SectionHead from "@Component/SectionHead.svelte";
    import Start from './components/Start.svelte';
    import Settings from '@Component/Settings.svelte';
    import Text from './components/Text.svelte';
    import Code from '@Component/Code.svelte';
    import Responsive from '@Component/Responsive.svelte';
    import Dialog from '@Component/Dialog.svelte';
    import VerifySave from '@Component/VerifySave.svelte';
    import Print from '@Component/Print.svelte';
    import PrintChart from '@Component/PrintChart.svelte';
    import Colors from '@Component/Colors.svelte';
    import XAxis from '@Component/XAxis.svelte';
    import YAxis from '@Component/YAxis.svelte';
    import Legend from '@Component/Legend.svelte';


 //   import {ActiveSection, IsWorking, ChartWidth} from './store';
  //  import getImageData from './scripts/get-image-data';


  function picClickHandler(){
        s.IsWorking.set(true);
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
    export const dummyData = [
        ["", "Apples", "Oranges", "Peaches"],
        ["Spring", 2, 13, 4],
        ["Summer", 1, 7, 10],
        ["Fall", 15, 5, 2],
    ];


</script> 

<script>
import { resetColorIndeces } from './components/ColorPalette.svelte';


    let Chart = new Promise(function(){});
    let showDataInput = false;
    let showVerify = false;
    let verifyPromise;
    let verifyResolve;
    let verifyReject;
    let data = _.cloneDeep(dummyData); // cloned to avoid mutating the dummyData which may be called later upon reset
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
    let enablePrint = false;
    let clickSave = () => {};
    let chartWidth = 650;
    let checkHeight = null;
    resetColorIndeces(data.length - 1);
    s.IsWorking.subscribe(v => {
        document.body.classList[v ? 'add' : 'remove']('isWorking');
    });
    function pushSection(node){
        sections.push(node);
    }
    s.ActiveSection.subscribe(v => {
        activeSection = v.value;
        if (!leftColumn) return;
        if ( v.method == 'click'){
            let anchor = leftColumn.querySelector(`a#${v.value}`);
            anchor.scrollIntoView();
        }
    });
    s.ChartWidth.subscribe(v => {
        chartWidth = v;
    });
    function intersectionHandler(e){
        const intersecting = e.find(_e => _e.isIntersecting);
        if ( intersecting ){
            s.ActiveSection.set({method: 'scroll', value: intersecting.target.dataset.section});
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
        padding-left: calc(55px + 1rem);
        max-width: 37%;
    }
    .right-column {
        position: relative;
        flex-grow: 1;
        min-width: 1000px;
        height: calc(100vh - var(--banner-height, 75px));
        overflow-y: auto;
        border-left: 1px solid var(--medium-gray, gray);
    }
    .chart-container {
        width: 100%;
        padding: 1rem;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
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
                <Start {Chart} {checkHeight} bind:data />
            </section>
            <section use:pushSection>
                <SectionHead text="Data" />
                {#if Chart}
                    <DataTable bind:datatableContainer bind:showDataInput bind:Chart bind:data {seriesCountMismatchNotice} />
                {/if}
            </section>
            <section use:pushSection>
                <SectionHead text="Text" />
                <Text {checkHeight} {savedCharts} />
            </section>
            <section use:pushSection>
                <SectionHead text="X Axis" />
                <XAxis />
            </section>
            <section use:pushSection>
                <SectionHead text="Y Axis" />
                <YAxis />
            </section>
            <section use:pushSection>
                <SectionHead text="Legend" />
                <Legend />
            </section>
            
            <section use:pushSection>
                <SectionHead text="Colors" />
                <Colors />
            </section>
            <section use:pushSection>
                <SectionHead text="Mobile" />
                <Responsive />
            </section>
            <section use:pushSection>
                <SectionHead text="Other" />
                <Settings /> 
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
            <div class:isHidden="{activeSection == 'start' || (enablePrint && activeSection == 'print')}" style="padding: 1em;">
                <ChartTypeSelector chartTypes="{brandOptions.chartTypes}" />
                <ChartSizeSelector bind:checkHeight {Chart}/>
            </div>
            <div class:isHidden="{activeSection == 'start' || (enablePrint && activeSection == 'print')}" class="chart-container">
                <PreviewChart bind:Chart {seriesCountMismatchNotice} {chartWidth} size="fullscreen"/>
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
