<script>
import { ActiveSection } from '../store';
import loadChart from '../scripts/load-chart';
import html from './start.md';

function clickHandler(){
    loadChart();
    ActiveSection.set({method: 'click', value: 'data'});
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