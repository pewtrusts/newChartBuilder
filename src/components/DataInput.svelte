<script context="module">
    import Papa from "papaparse";
    //import dataFile from '@Project/data/gdp.csv';
    import dataFile from "@Project/data/datetime-example.csv";
    import createSeriesData from "@Script/create-series.js";
</script>

<script>
    export let chart;
    Papa.parse(dataFile, {
        download: true,
        dynamicTyping: true,
        complete(results) {
            const seriesData = createSeriesData(results.data, chart);
            console.log(chart, seriesData);
            chart.update({ series: seriesData });
        },
        skipEmptyLines: true,
    });
</script>

<style>
</style>

<!-- TODO -->
