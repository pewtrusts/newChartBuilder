<script>
    import { SeriesCount } from './../store';
    export let selectedPalette;
    export let colorCount;
    let seriesArray = [];
    SeriesCount.subscribe(v => {
        if (!v) return;
        seriesArray = Array.apply(null, Array(v)).map((_,i) => i + 1);
    });
    
</script>
<style>
    .series-container {
        padding-left: 15px;
    }
    .series-label {
        margin: 0;
    }
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
<div class="container selectedPalette">
    <p>2. Assign a color to each series.</p>
    {#each seriesArray as series}
    <div class="series-container">
        <p class="series-label {selectedPalette}">Series {series}: </p>
            {#each new Array(colorCount) as _, i }
                <label class="color-label">
                    <input class="radio visually-hidden" type="radio" name="series-{series}-color" value="{i}" aria-label="Palette {selectedPalette} color {i}">
                    <div class="swatch highcharts-color-{i}"></div>
                </label>       
            {/each}
        </div>
    {/each}
</div>
