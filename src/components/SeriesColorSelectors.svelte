<script>
    import { SeriesCount, SelectedColorPalette, ColorByPoint, MaxPointCount } from './../store';
    import Checkbox from './Checkbox.svelte';
    import CustomColorInput from './CustomColorInput.svelte';
    export let selectedPalette;
    export let colorCount;
    export let defaultPaletteColorCount;
    let seriesArray = [];
    let maxPointCountArray = [];
    let colorByPoint = false;
    SeriesCount.subscribe(v => {
        if (!v) return;
        seriesArray = Array.apply(null, Array(v)).map((_,i) => i + 1);
    });
    SelectedColorPalette.subscribe(v => {
        if (!v) return;
        selectedPalette = v;
    });
    ColorByPoint.subscribe(v => {
        colorByPoint = v[0] == true; // TO DO. here we are only handling the first series being colorByPoint
                                     // no support yet for a mix of color by point vs not color by point
    });
    MaxPointCount.subscribe(v => {
        maxPointCountArray = Array.apply(null, Array(v)).map((_,i) => i + 1);
    });
    
</script>
<style>
    .series-container {
        padding-left: 15px;
        margin-bottom: 20px;
    }
    .series-label {
        margin: 0;
        position: relative;
        bottom: 4px;
    }
    
</style>
<div class="container {selectedPalette}">
    <p class="instruction-step">2. Assign a color to each {colorByPoint ? 'point' : 'series'}.</p>
    {#each (colorByPoint ? maxPointCountArray : seriesArray) as index, j}
    <div class="series-container">
        <p class="series-label {selectedPalette}">{colorByPoint ? 'Point' : 'Series'} {index}: </p>
        {#if selectedPalette !== 'custom'}
            {#each new Array(selectedPalette == 'default' ? defaultPaletteColorCount : colorCount) as _, i }
                <Checkbox seriesIndex="{j}" colorIndex="{i}" />
            {/each}
        {:else}
            <CustomColorInput seriesIndex="{j}" />
        {/if}
        </div>
    {/each}
</div>
