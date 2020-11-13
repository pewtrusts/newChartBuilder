<script context="module">
    import Papa from "papaparse";
    //import dataFile from '@Project/data/gdp.csv';
    //import dataFile from "@Project/data/datetime-example.csv";
    //import dataFile from "@Project/data/categorical-example.csv";
    import updateChartData from "@Script/update-chart-data.js";
</script>

<script>
    export let Chart;
    export let rawData;
    let textarea;
    function submitHandler(){
        const inputString = textarea.value.replace(/\r/g, ''); // remove /\r/s from Windows text
        if ( inputString === '' ){
            return; // TO DO: what should happen if empty string is submitted?
        }
        Papa.parse(inputString, { // TO DO: error handling  
            dynamicTyping: true,
            complete(results) {
                rawData = results.data;
                updateChartData(rawData, Chart);
            },
            skipEmptyLines: true,
        });
    }

</script>
<style>
        .datainput {
            display: block;
            width: 100%;
            height: 300px;
        }
</style>
<label for="tsv">Paste the table from Excel below</label>
<textarea class="datainput" bind:this={textarea} id="tsv" name="tsv"></textarea>
<input on:click="{submitHandler}" value="submit" id="submit" type="submit" />
<!-- TODO -->
