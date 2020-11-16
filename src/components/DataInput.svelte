<script context="module">
    import Papa from "papaparse";
    import updateChartData from "@Script/update-chart-data.js";
    import { fade } from 'svelte/transition';
    //import dataFile from '@Project/data/gdp.csv';
    //import dataFile from "@Project/data/datetime-example.csv";
    //import dataFile from "@Project/data/categorical-example.csv";
    const dataFile = null;
</script>

<script>
    export let Chart;
    export let data;
    export let showDataInput;
    let textarea;
    function submitHandler(){
        const inputString = dataFile ? '' : textarea.value.replace(/\r/g, ''); // remove /\r/s from Windows text
        if ( inputString === '' && !dataFile ){
            return; // TO DO: what should happen if empty string is submitted?
        }
        Papa.parse((dataFile || inputString), { // TO DO: error handling  
            download: !!dataFile,
            dynamicTyping: true,
            complete(results) {
                data = results.data;
                updateChartData(data, Chart);
            },
            skipEmptyLines: true,
        });
        showDataInput = false;
    }
    updateChartData(data, Chart);
    /* for dev only */
    if ( dataFile ) {
        submitHandler();
    }

</script>
<style>
    .container {
        position: fixed;
        top: var(--banner-height, 75px);
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
    }
    .inner {
        width: 100%;
        max-width: 800px;
        padding: 2rem;
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
    }
</style>
<div transition:fade class="container">
    <div class="screen"></div>
    <div class="inner">
        <label for="tsv">Paste the table from Excel below</label>
        <textarea class="datainput" bind:this={textarea} id="tsv" name="tsv"></textarea>
        <input on:click="{submitHandler}" value="submit" id="submit" type="submit" />
    </div>
</div>
