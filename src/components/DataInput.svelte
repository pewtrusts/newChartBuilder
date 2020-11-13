<script context="module">
    import Papa from "papaparse";
    import updateChartData from "@Script/update-chart-data.js";
    //import dataFile from '@Project/data/gdp.csv';
    //import dataFile from "@Project/data/datetime-example.csv";
    //import dataFile from "@Project/data/categorical-example.csv";
    const dataFile = null;
</script>

<script>
    export let Chart;
    export let data;
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
    }
    updateChartData(data, Chart);
    /* for dev only */
    if ( dataFile ) {
        submitHandler();
    }

</script>
<style>
    .datainput {
        display: block;
        width: 100%;
        height: 300px;
        font-family: var(--mono, monospace);
    }
</style>
<div>
    <label for="tsv">Paste the table from Excel below</label>
    <textarea class="datainput" bind:this={textarea} id="tsv" name="tsv"></textarea>
    <input on:click="{submitHandler}" value="submit" id="submit" type="submit" />
</div>
