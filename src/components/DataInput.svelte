<script context="module">
    import Papa from "papaparse";
    import updateChartData from "@Script/update-chart-data.js";
    import Button from './Button.svelte';
    import { fade } from 'svelte/transition';
    import { s } from './../store';
    //import dataFile from '@Project/data/gdp.csv';
    //import dataFile from "@Project/data/datetime-example.csv";
    //import dataFile from "@Project/data/categorical-example.csv";
    const dataFile = null;
</script>

<script>

    export let Chart;
    export let data;
    export let showDataInput;
    export let datatableContainer;
   
    $: (function(){
        
    })();
    let textarea;
    function keydownHandler(e){
        if ( e.keyCode == 27 ){ //ESC
            showDataInput  = false;
        }
    }
    function focusInput(node){
        node.focus();
    }
    function submitHandler(){
        var numberFormatIsSet = false;  
        var row = -1;
        const inputString = dataFile ? '' : textarea.value.replace(/\r/g, ''); // remove /\r/s from Windows text
        if ( inputString === '' && !dataFile ){
            return; // TO DO: what should happen if empty string is submitted?
        }
        Papa.parse((dataFile || inputString), { // TO DO: error handling  
            delimiter: dataFile ? ',' : '\t',
            download: !!dataFile,
            dynamicTyping: true,
            complete(results) {
                data = results.data;
                updateChartData(data);
            },
            transform(value, column){
                var format;
                function possiblySetFormat(){
                    if (!numberFormatIsSet && row == 1) {
                        s.NumberFormat.set(format);
                        numberFormatIsSet = true;
                    }
                }
                
                if ( column == 0 || value == ''){
                    return value;
                }
                if ( column == 1 ){
                    row++;
                }
                const rtn = value.replace(/[,$%]/g, '').trim();
                if ( value.slice(-1) == '%'){
                    format = 'percentage';
                    possiblySetFormat();
                    return (+rtn * 0.01).toPrecision(14);
                } else if ( value.charAt(0) == '$'){
                    format = 'currency';
                    possiblySetFormat();
                    return rtn;
                }
                /**
                 *  avoids setting format on basis of first rows which is usually headers
                 * would phaps be better to use papaparse with header set to true but then 
                 * the data model would be as 1:1 with the datatable itself
                */
                possiblySetFormat()
                return rtn;
            },
            skipEmptyLines: true,
        });
        showDataInput = false;
        requestIdleCallback(() => {
            datatableContainer.scrollTop = 0;
        },{timeout:100});
       
    }
    function closeHandler(){
        showDataInput = false;
    }
   // updateChartData(data);
    /* for dev only */
    if ( dataFile ) {
        submitHandler();
    }

</script>
<style>
    .button-container-outer {
        width: 100%;
        position: relative;
    }
    .button-container {
        position: absolute;
        top: -7px;
        right: -1rem;
    }
    .container {
        position: fixed;
        top: var(--banner-height, 75px);
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 4;
    }
    .inner {
        width: 100%;
        max-width: 800px;
        padding: 1rem;
        margin: auto;
        background: #fff;
        z-index: 1;
    }
    .screen {
        position: absolute;
        top: 0;
        right: 0; 
        bottom: 0;
        left: 0;
        background-color: var(--dark-background, #000);
        opacity: 0.5;
        z-index: -1;
    }
    .datainput {
        display: block;
        width: 100%;
        max-width: 100%;
        height: 300px;
        font-family: var(--mono, monospace);
        margin-bottom: 1rem;
    }
    label {
        display: block;
        margin-bottom: 1rem;
    }
</style>
<svelte:body on:keydown="{showDataInput ? keydownHandler : null}" />
<div transition:fade class="container">
    <div class="screen"></div>
    <div class="inner">
        <div class="button-container-outer">
            <div class="button-container">
                <Button clickHandler="{closeHandler}" iconID="circle-x" title="close" />
            </div>
        </div>
        <label for="tsv">Paste the spreadsheet data below</label>
        <textarea use:focusInput class="datainput" bind:this={textarea} id="tsv" name="tsv"></textarea>
        <Button clickHandler="{submitHandler}" title="Import" type="primary" />
    </div>
</div>
