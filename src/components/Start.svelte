<script>
import { s, resetWritables} from '../store';
import { dummyData } from './../App.svelte';
import updateChartData from './../scripts/update-chart-data';
import html from './start.md';
import cloneDeep from 'lodash.clonedeep';
import { resetColorIndeces } from './ColorPalette.svelte';
const _= {cloneDeep};
export let Chart;
export let checkHeight;
export let data;

async function clickHandler(){
    await Chart;
    resetWritables();
    data = _.cloneDeep(dummyData);
    updateChartData(data, Chart);
    checkHeight();
    resetColorIndeces(data[0].length - 1);
    s.ActiveSection.set({method: 'click', value: 'data'});
}
</script>
<style>
    .contents {
        display: contents;
    }
</style>
<div class="contents">
    {@html html}
    <button on:click="{clickHandler}" class="button button--primary">New chart</button>
    <!--<button on:click="{() => showSavedCharts = true}" class="button button--primary">Saved chart</button>-->
</div>