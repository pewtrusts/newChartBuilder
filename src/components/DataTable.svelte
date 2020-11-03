<script context="module">
    import data from '@Project/data/gdp.csv';
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
    // TO DO:  add typing for boolean, null
    console.log(data); // for testing purpose, bringing data in as an import. later it will be parse from pasted in tsv
    function returnHeadClass(i){
        if (data.slice(1).every(row => typeof row[i] === 'number' )){
            return 'number';
        }
        return 'string';
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
        margin: 0 0 0 40px;
    }
    .bar {
        position: absolute;
        top: 0;
        left: 0;
        background-color: lightgray;
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
    }
    .bar-slot--row {
        height: 40px;
        width: 100%;
        border-bottom: 1px solid #fff;
    }
    .bar-slot--column {
        width: 100px;
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
        text-align: right;
        color: blue;
    }
    td,th {
        width: 100px;
        height: 40px;
        border-bottom: 1px solid lightgray;
        border-right: 1px solid lightgray;
        padding-right: 8px;
        padding-left: 8px;
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
    <table class="datatable">

        <thead>
            <tr>
                {#each data[0] as columnHead, i}
                <th scope="column" class="{returnHeadClass(i)}">{columnHead}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each data.slice(1) as row}
            <tr>
                <td class="{typeof datum == 'string' ? 'string' : 'number'}">{row[0]}</td>
                {#each row.slice(1) as datum}
                <td class="{typeof datum == 'string' ? 'string' : 'number'}">{datum}</td>
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>
</div>