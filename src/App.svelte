<script context="module">
    /* global GOOGLE_SHEET_ID GOOGLE_SHEET_KEY GOOGLE_ID*/
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
    import Custom from '@Component/Custom.svelte';
    import Multiple from '@Component/Multiple.svelte';


 //   import {ActiveSection, IsWorking, ChartWidth} from './store';
  //  import getImageData from './scripts/get-image-data';
    const buildModeMultipleEnabled = ['Start','Code','Save','Print','Multiple'];

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
    export const customSettingsNotice = {
        label: 'Custom settings applied',
        description: 'This chart has custom settings applied that may override options set elsewhere. Navigate to the custom section to review or edit them.',
        type: 'warning'
    };
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
    console.log({gsi: GOOGLE_SHEET_ID, gsk: GOOGLE_SHEET_KEY, GI: GOOGLE_ID});
import { resetColorIndeces } from './components/ColorPalette.svelte';
    let willMigrate;

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
    let numberLoaded;
    let selectMultipleEnabled = false;
    let buildMode = 'single';
    resetColorIndeces(data.length - 1);
    s.BuildMode.subscribe(v => {
        buildMode = v;
    });
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
        selectMultipleEnabled = v.value == 'multiple';
    });
    s.ChartWidth.subscribe(v => {
        chartWidth = v;
    });
    s.WillMigrate.subscribe(v => {
        willMigrate = v;
    })
    function intersectionHandler(e){
        const intersecting = e.find(_e => _e.isIntersecting);
        if ( intersecting ){
            s.ActiveSection.set({method: 'scroll', value: intersecting.target.dataset.section});
        }
    }
    function migrateHandler(){
        s.WillMigrate.set(this.checked)
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
        padding-top: 1rem;
        min-width: 450px;
        max-width: 37%;
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
   .flex-section {
       display: flex;
       flex-direction: column;
   }
   .selectMultipleEnabled {
        background-color: var(--dark-background, #000);
        color: #fff;
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
<Nav {buildModeMultipleEnabled}/>
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
                <SectionHead text="Custom" />
                <Custom /> 
            </section> 
            <section class="flex-section" use:pushSection>
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
            <section use:pushSection>
                <SectionHead text="Multiple" />
                <Multiple {numberLoaded} />
            </section>
            
        </div>
        <div class="right-column">
            <div class:isHidden="{activeSection == 'start' || (activeSection == 'multiple' && buildMode == 'single')  || (enablePrint && activeSection == 'print')}">
                <div style="padding: 1em;">
                    <ChartTypeSelector chartTypes="{brandOptions.chartTypes}" />
                    <label><input type="checkbox" checked="{willMigrate}" on:change={migrateHandler}> Migrate</label>
                    <ChartSizeSelector bind:checkHeight {Chart}/>
                    </div>
                     <div class="chart-container">
                    <PreviewChart bind:Chart {seriesCountMismatchNotice} {chartWidth} size="fullscreen"/>
                    <PreviewChart {Chart} {seriesCountMismatchNotice} chartWidth="{366}" size="mobile"/>
                </div>
            </div>
            <div class="saved-charts" class:selectMultipleEnabled class:isHidden="{
                !['start','multiple'].includes(activeSection) ||
                buildMode == 'multiple' || 
                (enablePrint && activeSection == 'print')}">
                <ListSavedCharts 
                    bind:resolveSaved
                    bind:savedCharts 
                    bind:loadedChart 
                    bind:googleSheetHeaders
                    bind:userId
                    bind:userEmail
                    bind:userName
                    bind:getSavedCharts
                    bind:numberLoaded
                />
            </div>
            {#if enablePrint && activeSection == 'print'}
                <PrintChart {Chart} />
            {/if}
        </div>
    </div>
</div>
