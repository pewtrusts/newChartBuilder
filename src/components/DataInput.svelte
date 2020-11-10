<script context="module">
    import Papa from 'papaparse';
    //import dataFile from '@Project/data/gdp.csv';
    import dataFile from '@Project/data/datetime-example.csv';

</script>
<script>
    export let dataResolve;
    Papa.parse(dataFile, {
        download: true,
        dynamicTyping: true,
        complete(results){
            dataResolve(results.data);
        },
        skipEmptyLines: true
    });
</script>
<style></style>
<!-- TODO -->