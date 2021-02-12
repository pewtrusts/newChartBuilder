<script>
import { ActiveSection } from '../store';
import html from './start.md';
</script>
<style>
    .contents {
        display: contents;
    }
</style>
<div class="contents">
    {@html html}
    <button on:click="{() => ActiveSection.set({method: 'click', value: 'data'})}" class="button button--primary">New chart</button>
    <!--<button on:click="{() => showSavedCharts = true}" class="button button--primary">Saved chart</button>-->
</div>