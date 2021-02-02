<script>
    import { SeriesCount, ColorIndeces, SelectedColorPalette } from './../store';
    import Checkbox from './Checkbox.svelte';
    export let selectedPalette;
    export let colorCount;
    let seriesArray = [];
    let colorIndeces;
    SeriesCount.subscribe(v => {
        if (!v) return;
        seriesArray = Array.apply(null, Array(v)).map((_,i) => i + 1);
    });
    ColorIndeces.subscribe(v => {
        if (!v) return;
        colorIndeces = v;
    });
    SelectedColorPalette.subscribe(v => {
        if (!v) return;
        selectedPalette = v;
    })
    function isChecked(j,i){
        console.log(colorIndeces,j,i);
        return colorIndeces[j] == i ? 'checked' : null;
    }
    
</script>
<style>
    .series-container {
        padding-left: 15px;
        margin-bottom: 20px;
    }
    .series-label {
        margin: 0;
        display: inline-block;
        position: relative;
        bottom: 4px;
    }
    
</style>
<div class="container {selectedPalette}">
    <p class="instruction-step">2. Assign a color to each series.</p>
    {#each seriesArray as series, j}
    <div class="series-container">
        <p class="series-label {selectedPalette}">Series {series}: </p>
            {#each new Array(colorCount) as _, i }
                <Checkbox seriesIndex="{j}" colorIndex="{i}" />
            {/each}
        </div>
    {/each}
</div>
