<script context="module">
    import {ChartType, ColorIndeces, SelectedColorPalette, ColorCount} from './../store';
    import { get } from 'svelte/store';
    function changeHandler(e){
        console.log(e.target.value);
        SelectedColorPalette.set(e.target.value);
    }
    function swatchClick(){
        SelectedColorPalette.set(this.dataset.value);
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
    export let defaultPaletteColorCount;
    let customSwatchStep = 360 / colorCount;
    let selectedPalette;
    
    ChartType.subscribe(() => {
        checkColorIndeces(get(ColorCount));
    });
    SelectedColorPalette.subscribe(v => {
        selectedPalette = v;
        if ( selectedPalette == palette){
            let colorCount = get(ColorCount);
            checkColorIndeces(colorCount);
        }
    });
    ColorCount.subscribe(v => {
        checkColorIndeces(v);
    });
    function checkColorIndeces(seriesCount){
        if (seriesCount  && selectedPalette == palette){
           if ( seriesCount < colorCount && !['default','custom'].includes(palette)){
               selectEvenlySpacedColors({seriesCount, colorCount});
           } else {
               resetColorIndeces(seriesCount);
           }
       }
    }
    function customSwatchColor({palette, i}){
        if (palette !== 'custom') return null;
        return `background-image: linear-gradient(to right, hsl(${ i * customSwatchStep}, 100%, 50%), hsl(${ (i + 1) * customSwatchStep}, 100%, 50%));`;

    }
    
    
</script>
<style>
    
    .selector {
        display: flex;
        align-items: flex-end;
        line-height: 1;
        cursor: pointer;
        border: 2px solid transparent;
    }
    .swatch-container {
        position: relative;
        top: 1px;
        line-height: 1;
        
    }
    .swatch {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 2px;
    }

    .input {
        margin-right: 3px;
        height: 23px;
        cursor: pointer;
    }
    
    label {
        line-height: 1;
        cursor: pointer;
    }
    .isSelected label {
        font-weight: 900;
        color: #000;
    }
    
    
</style>
<div class="wrapper">
    <div class="selector" class:isSelected="{selectedPalette == palette ? true : null}">
        <input checked="{selectedPalette == palette ? true : null}" on:change="{changeHandler}" value="{palette}" name="color-palette" id="input-{palette}" class="input" type="radio">
        <div>
            <label for="input-{palette}">{palette.replace(/-/g,' ').replace(/^(\w)/, v => v.toUpperCase())}</label>
            <div on:click="{swatchClick}" class="swatch-container {palette}" data-value="{palette}">
                {#each new Array(palette == 'default' ? defaultPaletteColorCount : colorCount) as _, i}
                    <div class="swatch highcharts-color-{i} {palette}" style="{customSwatchColor({palette, i})}"></div>
                {/each}
            </div>
        </div>
    </div>
</div>
