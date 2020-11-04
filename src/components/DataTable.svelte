<script context="module">
    import Sprite from './Sprite.svelte';
    import _data from '@Project/data/gdp.csv';
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
    
</script>
<script>
    let data = _data;
    // TO DO:  add typing for boolean, null
    console.log(data); // for testing purpose, bringing data in as an import. later it will be parse from pasted in tsv
    function returnHeadClass(i){
        if (data.slice(1).every(row => typeof row[i] === 'number' )){
            return 'head--number-column';
        }
        return 'head--string-column';
    }
    function transpose(){
        data =  data[0].map((cHead, i) => [...data.map(row => row[i])]);
    }
</script>
<style>
    .datatable-container {
        display: inline-block;
        padding-top: 40px;
        position: relative;
        max-width: 100%;
        max-height: 100vh;
        overflow: auto;
    }
    .datatable {
        table-layout: fixed;
        margin: 0 0 0 40px;
    }
    .bar {
        position: absolute;
        top: 0;
        left: 0;
        
    }
    .bar--left {
        padding-top: 40px;
        width: 40px;
    }
    .bar--top {
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
    <div class="bar bar--left">
        {#each data as _, i}
        <div class="bar-slot bar-slot--row">{i + 1}</div>
        {/each}
    </div>
    <div class="bar bar--top">
        {#each data[0] as _, i}
        <div class="bar-slot bar-slot--column"><span>{returnColumnLetters(i)}</span></div>
        {/each}
    </div>
    <button role="button" on:click="{transpose}" title="transpose data" class="transpose">
        <Sprite width="15" id="loop-circular" />
        <span class="visually-hidden">transpose data</span>
    </button>
    <table class="datatable">

        <thead>
            <tr>
                {#each data[0] as columnHead, i}
                <th scope="column" class="{typeof columnHead == 'string' ? 'string' : 'number'} {returnHeadClass(i)}">{columnHead}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each data.slice(1) as row}
            <tr>
                <td class="{typeof row[0] == 'string' ? 'string' : 'number'}">{row[0]}</td>
                {#each row.slice(1) as datum}
                <td class="{typeof datum == 'string' ? 'string' : 'number'}">{datum}</td>
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>
</div>