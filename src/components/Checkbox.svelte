<script>
    import {SelectedColorPalette, ColorIndeces} from './../store';
    import get from 'svelte/store';
    export let seriesIndex;
    export let colorIndex;
    let selectedPalette;
    let colorIndeces;
    SelectedColorPalette.subscribe(v => {
        if (!v) return;
        selectedPalette = v;
    });
    ColorIndeces.subscribe(v => {
        colorIndeces = v;
    });
    $:isChecked = (() => {
        return colorIndeces[seriesIndex] == colorIndex;
    })();
    function changeHandler(){
        colorIndeces[seriesIndex] = colorIndex;
        ColorIndeces.set(colorIndeces);
    }
</script>
<style>
    .color-label {
        width: 20px;
        font-size: 0;
    }
    .swatch {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 2px;
        position: relative;
    }
    .swatch::after {
        content: ' ';
        position: absolute;
        top: 100%;
        left: 50%;
        display: block;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 12px solid #000;
        transform: translate(-50%, 0);
        visibility: hidden;

    }
    
    .radio:checked ~ .swatch::after {
        visibility: visible;
    }
</style>
<label class="color-label">
    <input
        on:change="{changeHandler}"
        checked={isChecked}
        class="radio visually-hidden"
        type="radio"
        name="series-{seriesIndex}-color"
        value="{colorIndex}"
        aria-label="Palette {selectedPalette} color {colorIndex}"
    >
    <div class="swatch highcharts-color-{colorIndex}"></div>
</label> 