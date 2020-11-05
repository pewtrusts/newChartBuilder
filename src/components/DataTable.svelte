<script context="module">
    import Sprite from './Sprite.svelte';
    import _data from '@Project/data/gdp.csv';
    import createSeriesData from '@Script/create-series.js';
    /* for testing data is being imported directly. will come from user input */
    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    function returnColumnLetters(i){
        var letters = '';
        const iterations = Math.floor(i / 26);
        const letterIndex = i % 26;
        for ( let i = 0; i <= iterations; i++){
            letters += alphabet[letterIndex];
        }
        return letters;
    }
    function returnValueType(d){
        return typeof d == 'number' ? 'number' :
            typeof d == 'object' ? 'null' : 
            typeof d == 'boolean' ? 'boolean' : 
            'string';
    }
    
</script>
<script>
    let data = _data;
    createSeriesData(data);
    // TO DO:  add typing for boolean, null
    console.log(data); // for testing purpose, bringing data in as an import. later it will be parse from pasted in tsv
    function returnHeadClass(i){
        if (data.slice(1).every(row => {
            return ( typeof row[i] === 'number' || row[i] == null );
         })){
            return 'head--number-column';
        }
        return 'head--string-column';
    }
    function transpose(){
        data =  data[0].map((_, i) => [...data.map(row => row[i])]);
        createSeriesData(data);
    }
</script>
<style>
    .datatable-container {
        display: inline-block;
        position: relative;
        max-width: 100%;
        max-height: 100vh;
        overflow: auto;
    }
    .datatable {
        position: absolute;
        top: 40px;
        left: 40px;
        table-layout: fixed;
        
    }
    .bar {
        position: sticky;
    }
    .bar--left {
        left: 0;
        width: 40px;
    }
    .bar--top {
        top: 0;
        height: 40px;
        width: 100%;
        padding-left: 41px;
        display: flex;
    }
    .bar-slot {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: lightgray;
    }
    .bar-slot--row {
        height: 40px;
        width: 100%;
        border-bottom: 1px solid #fff;
    }
    .bar-slot--column {
        width: 100px;
        min-width: 100px;
        height: 40px;
        border-right: 1px solid #fff;
    }
    .bar-slot--column:last-child {
        border-right-width: 0;
    }
    .string {
        text-align: left;
        color: orange;
    }
    .number {
        font-family: monospace;
        text-align: right;
        color: blue;
    }
    .null {
        text-align: center;
        color: lightgray
    }
    .boolean {
        font-family: monospace;
        text-align: center;
        color: darkred;
    }
    .head--number-column {
        text-align: right;
    }
    .head--string-column {
        text-align: left;
    }
    td,th {
        width: 100px;
        min-width: 100px;
        height: 40px;
        border-bottom: 1px solid lightgray;
        border-right: 1px solid lightgray;
        padding-right: 8px;
        padding-left: 8px;
    }
    .transpose {
        position: absolute;
        top: 0;
        left: 0;
        appearance: none;
        width: 40px;
        height: 40px;
        border-width: 0;
        background: lightgray;
        border-right: 1px solid #fff;
        border-bottom: 1px solid #fff;
    }
</style>
<h2>DataTable</h2>
<div class="datatable-container">
    <table class="datatable">

        <thead>
            <tr>
                {#each data[0] as columnHead, i}
                <th scope="column" class="{returnValueType(columnHead)} {returnHeadClass(i)}">{columnHead}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each data.slice(1) as row}
            <tr>
                <td class="{returnValueType(row[0])}">{row[0] || '[empty]'}</td>
                {#each row.slice(1) as datum}
                <td class="{returnValueType(datum)}">{datum || '[empty]'}</td>
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>
    <div class="bar bar--top">
        {#each data[0] as _, i}
        <div class="bar-slot bar-slot--column"><span>{returnColumnLetters(i)}</span></div>
        {/each}
    </div>
    <div class="bar bar--left">
        {#each data as _, i}
        <div class="bar-slot bar-slot--row">{i + 1}</div>
        {/each}
    </div>
    <button role="button" on:click="{transpose}" title="transpose data" class="transpose">
        <Sprite width="15" id="loop-circular" />
        <span class="visually-hidden">transpose data</span>
    </button>
</div>