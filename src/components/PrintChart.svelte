<script>
    import { s } from './../store';
    import convert from './../scripts/unit-conversions';
    import { afterUpdate } from 'svelte';
    import cloneDeep from 'lodash.clonedeep';
    import defaultsDeep from 'lodash.defaultsdeep';
    import Notices from './Notices.svelte';
    import {customSettingsNotice} from './../App.svelte';
    import {extendObj, beforeRenderExtensions} from '@Submodule/newgriffin/src/index.js';

    import returnLegendFormatter from '@Submodule/newgriffin/src/scripts/return-legend-formatter';
    export let Chart;
    const _={cloneDeep, defaultsDeep};
    let printWidth;
    let printHeight;
    let chartContainer;
    let config;
    let classes = [];
    let responsiveRules = [];
    let responsiveNotice = {
        label: 'Mobile settings applied',
        description: 'Mobile settings such as minimum chart height applied elsewhere may be affecting the output here. You may enable or disable them below.',
        type: 'warning'
    };
    let notices = new Set();
    $:appliedRules = responsiveRules.slice();
    s.AllResponsiveRules.subscribe(v => {
        notices[v.length > 0 ? 'add' : 'delete'](responsiveNotice);
        responsiveRules = v;
    });
    s.Classes.subscribe(v => {
        classes = v;
    });
    s.PrintWidth.subscribe(v => {
        printWidth = v;
    });
    s.PrintHeight.subscribe(v => {
        printHeight = v;
    });
    s.ChartConfig.subscribe(v => {
        config = v;
    });
    s.HasCustomSettings.subscribe(v => {
        notices[v ? 'add' : 'delete'](customSettingsNotice);
        notices = notices;
    });
    
    afterUpdate(async () => {
        const chart = await Chart;
        const _config = _.cloneDeep(config);
        _config.chart.height = printHeight;
        _config.chart.className = 'griffin griffin--for-print';
        _config.legend.align = 'left';
        _config.responsive.rules = appliedRules;
        extendObj(_config, ['legend', 'labelFormatter'], returnLegendFormatter(_config.chart.type));
        /**
         * some of the settings from the origin preview chart were being lost.
         * befor render extensions and defaults deep here to make up for that
        */
        beforeRenderExtensions(_config);
        _.defaultsDeep(_config, chart.userOptions);
        window.PrintChart = window.Highcharts.chart(chartContainer, _config);
    });
    function changeHandler(){
        var active = [];
        const data =  new FormData(this);
        console.log(data.values());
        for (let [name,value] of data ){
            active.push(responsiveRules[parseInt(name)]);
            console.log(name,value);
        }
        appliedRules = active.slice();
        console.log(appliedRules);
        window.PrintChart.update({responsive: {rules: appliedRules}});
    }
</script>
<style>
    .container {
         position: absolute;
        top: 0;
        width: 100%;
        padding: 1em 1em;
    }
    .chart-container {
        position: relative;
        margin: 0 auto;
        height: 300px;
        overflow: visible;
    }
    h2 {
        margin-top: 0;
    }
    h2::after {
        content: ' ' attr(data-width) 'in X ' attr(data-height) 'in';
        color: #767676;
        font-size: 1rem;
        font-weight: 400;
        
    }
    .rules-container {
        display: grid;
        grid-template-columns: repeat( auto-fit, minmax(200px, 1fr) );
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        grid-auto-rows: minmax(min-content, max-content);
        align-items: stretch;
    }
    .rule-item {
        position: relative;
        display: flex;
        border: 1px solid var(--medium-gray, gray);
        padding: 0.5em;
    }
    pre {
        margin: 0;
        margin-top: -0.2em;
        
    }
    label {
        cursor: pointer;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
</style>
<div class="container">
    <Notices {notices} />
    <div class="griffin-figure">
        <h2 data-width="{convert.pixelsToInches(printWidth)}" data-height="{convert.pixelsToInches(printHeight)}">Print preview (WIP)</h2>
        <div bind:this="{chartContainer}" class="chart-container {classes.join(' ')}" style="width: {printWidth}px; height: {printHeight}px;"></div>
    </div>
    {#if responsiveRules.length > 0 }
    <h3>Responsive rules</h3>
    <form on:change="{changeHandler}" class="rules-container">
        {#each responsiveRules as rule, i}
            <div class="rule-item">
                <label for="rule-input-{i}">Toggle rule on/off</label>
                <input name="{i}" id="rule-input-{i}" data-index="{i}" checked type="checkbox">
                <pre>{JSON.stringify(rule, null, 2)}</pre>
            </div>
        {/each}
    </form>
    {/if}
</div>