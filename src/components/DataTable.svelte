<script context="module">
    import Sprite from "./Sprite.svelte";
    import Button from "./Button.svelte";
    import Notices from './Notices.svelte';
    import updateChartData from "@Script/update-chart-data.js";
    import EditableCell from "@Component/EditableCell.svelte";
    import { s } from "@Project/store";
    /* for testing data is being imported directly. will come from user input */
    const alphabet = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
    ];
    function returnColumnLetters(i) {
        var letters = "";
        const iterations = Math.floor(i / 26);
        const letterIndex = i % 26;
        for (let i = 0; i <= iterations; i++) {
            letters += alphabet[letterIndex];
        }
        return letters;
    }
    function returnValueType(d) {
        return typeof d == "number"
            ? "number"
            : typeof d == "object"
            ? "null"
            : typeof d == "boolean"
            ? "boolean"
            : "string";
    }
</script>

<script>
    export let data = _.cloneDeep(dummyData); // cloned to acoid mutating the dummyData which may be called later upon reset
    export let Chart;
    export let showDataInput;
    let chartType;
    let xAxisType = "linear";
    export let datatableContainer;
    let notices = new Set();
    export let seriesCountMismatchNotice;
    let seriesCountMismatch = false;
    function returnHeadClass(i) {
        if (
            data.slice(1).every((row) => {
                return typeof row[i] === "number" || row[i] == null;
            })
        ) {
            return "head head--number-column";
        }
        return "head head--string-column";
    }
    function _transpose(data){
        return data[0].map((_, i) => [...data.map((row) => row[i])]);
    }
    function transpose() {
        data = _transpose(data);
        if (chartType == 'pie') {
            let _data = _transpose(data);
            updateChartData(_transpose(_data.slice(0,2)), Chart, data);
        } else {
            updateChartData(data, Chart);
        }
    }
    function handleDataChange(e) {
        console.log({ e, data });
        updateChartData(data, Chart);
    }
    
    s.LoadedDataConfig.subscribe(v => {
        /**
         * TO DO: NONCATEGORICAL
        */
        if (!v) return;
        //xaxis type == categorical
        const _data = [
            [(v.xAxis.title ? v.xAxis.title.text : ''), ...v.series.map(d => d.name)],
            ...v.xAxis.categories.map((c,i) => [c, ...v.series.map(s => s.data[i].y)])
        ];
        data = v.datatableData || _data;
        updateChartData(_data, Chart, data);

    })
    s.ChartType.subscribe(v => {
        if (v == 'pie' && chartType !== 'pie' ) {
            let _data = _transpose(data);
            updateChartData(_transpose(_data.slice(0,2)), Chart, data);
        } else if ( chartType == 'pie' && v !== 'pie' ) {
           // setTimeout(() => {
                updateChartData(data, Chart);
           // },1000); // what;s going on here? any way to simplify?
        }
        chartType = v;
    });
    s.XAxisType.subscribe((v) => {
        xAxisType = v;
    });
    s.SeriesCountMismatch.subscribe(v => {
        seriesCountMismatch = v;
        notices[v ? 'add' : 'delete'](seriesCountMismatchNotice);
        notices = notices;
    });
    updateChartData(data, Chart);
</script>

<style>
    .datatable-container {
        display: inline-block;
        position: relative;
        max-width: 100%;
        max-height: calc(100vh - var(--banner-height, 75px) - 2rem - 150px);
        overflow: auto;
        border-top: 1px solid #fff;
        border-bottom: 1px solid var(--background-medium, lightgray);
    }
    .datatable {
        position: absolute;
        top: 40px;
        left: 40px;
        table-layout: fixed;
    }
    .bar {
        position: sticky;
        z-index: 1;
    }
    .bar--left {
        left: 0;
        width: 40px;
    }
    .bar--top {
        top: 0;
        height: 40px;
        width: 100%;
        display: flex;
        z-index: 2;
    }
    .bar-slot {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: var(--background-medium, lightgray);
    }
    .bar-slot--row {
        height: 40px;
        width: 100%;
        border-bottom: 1px solid #fff;
    }
    .bar-slot--row:last-child {
        border-bottom-width: 0;
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
    .bar-slot--column.unused {
        opacity: 0.5;

    }
    .transpose {
        position: sticky; 
        left: 0;
        appearance: none;
        width: 40px;
        height: 40px;
        border-width: 0;
        background: var(--background-medium, lightgray);
        border-bottom: 1px solid #fff;
        border-right: 1px solid #fff;
    }

    .actions {
        display: inline-block;
        padding-left: 40px;
        display: flex;
        background-image: linear-gradient(
            to right,
            var(--background-medium, lightgray),
            var(--background-medium, lightgray) 40px,
            transparent 41px
        );
    }
    :global(.unused) {
        opacity: 0.5;
    }
</style>
<Notices {notices} />
<div class="actions">
    <Button
        clickHandler={() => (showDataInput = true)}
        showIconAndText="true"
        iconID="spreadsheet"
        title="Import"
        iconStyle="top:2px;"
        type="gray"
        style="border-bottom-width: 0;border-top-width: 0;" />
</div>
<div bind:this={datatableContainer} class="datatable-container">
    <div class="bar bar--top">
        <button
            role="button"
            on:click={transpose}
            title="transpose data"
            class="transpose">
            <Sprite width="15" id="loop-circular" />
            <span class="visually-hidden">transpose data</span>
        </button>
        {#if data}
            {#each data[0] as _, i}
                <div class="bar-slot bar-slot--column" class:unused="{seriesCountMismatch && i > 1}">
                    <span>{returnColumnLetters(i)}</span>
                </div>
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
    <table class="datatable">
        <thead>
            <tr>
                {#if data}
                    {#each data[0] as columnHead, i}
                        <EditableCell
                            isDateTime={false}
                            on:dataChange={handleDataChange}
                            bind:value={data[0][i]}
                            row="0"
                            column={i}
                            type="th"
                            scope="column"
                            klass="{returnValueType(columnHead)} {returnHeadClass(i)} {i > 1 && seriesCountMismatch ? 'unused' : ''}" />
                    {/each}
                {/if}
            </tr>
        </thead>
        <tbody>
            {#if data}
                {#each data.slice(1) as row, i}
                    <tr>
                        <EditableCell
                            isDateTime={xAxisType == 'datetime'}
                            on:dataChange={handleDataChange}
                            bind:value={data[i + 1][0]}
                            row={i + 1}
                            column="0"
                            type="td"
                            scope={null}
                            klass={returnValueType(row[0])} />
                        {#each row.slice(1) as datum, j}
                            <EditableCell
                                isDateTime={false}
                                on:dataChange={handleDataChange}
                                bind:value={data[i + 1][j + 1]}
                                row={i + 1}
                                column={j + 1}
                                type="td"
                                scope={null}
                                klass="{returnValueType(datum)} {j > 0 && seriesCountMismatch ? 'unused' : ''}" />
                        {/each}
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
</div>
