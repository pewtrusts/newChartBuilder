<script context="module">
    import {ColorIndeces, SelectedColorPalette, SeriesCount} from './../store';
    import { get } from 'svelte/store';
    function changeHandler(e){
        console.log(e.target.value);
        SelectedColorPalette.set(e.target.value);
    }
    function selectEvenlySpacedColors({seriesCount, colorCount}){
        const colorIndeces = Array.apply(null, Array(seriesCount)).map((_,i,arr) => 0 + Math.round(i * (colorCount - 1) / (arr.length - 1)));
        console.log(colorIndeces);
        ColorIndeces.set(colorIndeces);
    }
    function resetColorIndeces(seriesCount){
        const colorIndeces = Array.apply(null, Array(seriesCount)).map((_,i) => i);
        ColorIndeces.set(colorIndeces);
    }
    
</script>
<script>
    export let palette;
    export let colorCount;
    let selectedPalette;
    SelectedColorPalette.subscribe(v => {
        selectedPalette = v;
        if ( selectedPalette == palette){
            let seriesCount = get(SeriesCount);
            checkColorIndeces(seriesCount);
        }
    });
    SeriesCount.subscribe(v => {
        checkColorIndeces(v);
    });
    function checkColorIndeces(seriesCount){
        if (seriesCount  && selectedPalette == palette){
           if ( seriesCount < colorCount && palette !== 'default'){
               selectEvenlySpacedColors({seriesCount, colorCount});
           } else {
               resetColorIndeces(seriesCount);
           }
       }
    }
</script>
<style>
    .swatch-container {
        position: relative;
        top: 1px;
        display: inline-block;
    }
    .swatch {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 4px;
    }
</style>
<div class="selector">
    <div class="swatch-container {palette}">
        {#each new Array(colorCount) as _, i}
            <div class="swatch highcharts-color-{i}"></div>
        {/each}
    </div>
    <input checked="{selectedPalette == palette ? true : null}" on:change="{changeHandler}" value="{palette}" name="color-palette" id="input-{palette}" class="input" type="radio">
    <label for="input-{palette}">{palette.replace(/-/g,' ').replace(/^(\w)/, v => v.toUpperCase())}</label>
</div>
