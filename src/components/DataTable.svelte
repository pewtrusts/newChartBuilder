<script context="module">
    import Sprite from './Sprite.svelte';
    import updateChartData from '@Script/update-chart-data.js';
    import EditableCell from '@Component/EditableCell.svelte';
    import { XAxisType } from '@Project/store';
    import { createChart } from '@Component/PreviewChart.svelte';
    
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
    export let data = [['X values','Series 1', 'Series 2', 'Series 3'],
        ['Apples',2,3,4],
        ['Oranges',4,6,8],
    ];
    export let Chart;
    let xAxisType = 'linear';
    export let showDataInput;
    function returnHeadClass(i){
        if (data.slice(1).every(row => {
            return ( typeof row[i] === 'number' || row[i] == null );
         })){
            return 'head head--number-column';
        }
        return 'head head--string-column';
    }
    function transpose(){
        const container = Chart.renderTo;
        Chart.destroy();
        data =  data[0].map((_, i) => [...data.map(row => row[i])]);
        Chart = createChart(container);
        updateChartData(data, Chart);
    }
    function handleDataChange(e){
        console.log({e,data});
        updateChartData(data, Chart);
    }
    XAxisType.subscribe(v => {
        xAxisType = v;
    });
    updateChartData(data, Chart);
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
        width: 110px;
        min-width: 110px;
        height: 40px;
        border-right: 1px solid #fff;
    }
    .bar-slot--column:last-child {
        border-right-width: 0;
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
<button on:click="{() => showDataInput = true}" role="button" class="from-excel">Paste</button>
<div class="datatable-container" >
    <div class="bar bar--top">
        {#if data}
        {#each data[0] as _, i}
        <div class="bar-slot bar-slot--column"><span>{returnColumnLetters(i)}</span></div>
        {/each}
        {/if}
    </div>
    <div class="bar bar--left">
        {#if data}
        {#each data as _, i}
        <div class="bar-slot bar-slot--row">{i + 1}</div>
        {/each}
        {/if}
    </div>
    <button role="button" on:click="{transpose}" title="transpose data" class="transpose">
        <Sprite width="15" id="loop-circular" />
        <span class="visually-hidden">transpose data</span>
    </button>
    <table class="datatable">
        <thead>
            <tr>
                {#if data}
                {#each data[0] as columnHead, i}
                <EditableCell isDateTime={false} on:dataChange="{handleDataChange}" bind:value="{data[0][i]}" row="0" column="{i}" type="th" scope="column" klass="{returnValueType(columnHead)} {returnHeadClass(i)}"  />
                {/each}
                {/if}
            </tr>
        </thead>
        <tbody>
            {#if data}
            {#each data.slice(1) as row, i}
            <tr>
                <EditableCell isDateTime="{xAxisType == 'datetime'}" on:dataChange="{handleDataChange}" bind:value="{data[i + 1][0]}" row="{i + 1}" column="0" type="td" scope="{null}" klass="{returnValueType(row[0])}"  />
                {#each row.slice(1) as datum, j}
                <EditableCell isDateTime={false} on:dataChange="{handleDataChange}" bind:value="{data[i + 1][j + 1]}" row="{i + 1}" column="{j + 1}" type="td" scope="{null}" klass="{returnValueType(datum)}" />
                {/each}
            </tr>
            {/each}
            {/if}
        </tbody>
    </table>
</div>