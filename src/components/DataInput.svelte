<script context="module">
    import Papa from "papaparse";
    import dataFile from '@Project/data/gdp.csv';
    //import dataFile from "@Project/data/datetime-example.csv";
    import updateChartData from "@Script/update-chart-data.js";
</script>

<script>
    export let Chart;
    export let rawData;
    Papa.parse(dataFile, {
        download: true,
        dynamicTyping: true,
        complete(results) {
            rawData = results.data;
            updateChartData(rawData, Chart);
        },
        skipEmptyLines: true,
    });
</script>

<style>
</style>

<!-- TODO -->
