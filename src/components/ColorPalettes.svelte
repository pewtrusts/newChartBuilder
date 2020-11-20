<script>
    import {ColorPalette} from './../store';
    export let palettes;
    export let colorCount;
    let selectedPalette;
    ColorPalette.subscribe(v => {
        selectedPalette = v;
    });
    function changeHandler(e){
        console.log(e.target.value);
        ColorPalette.set(e.target.value);
    }
</script>
<style>
    .swatch-container {
        position: relative;
        top: 1px;
        display: inline-block;
    }
    .swatch {
        width: 15px;
        height: 15px;
        display: inline-block;
        margin-right: 4px;
    }
</style>
{#each palettes as palette}
    <div class="selector">
        <div class="swatch-container {palette}">
            {#each new Array(colorCount) as _, i}
                <div class="swatch highcharts-color-{i}"></div>
            {/each}
        </div>
        <input checked="{selectedPalette == palette ? true : null}" on:change="{changeHandler}" value="{palette}" name="color-palette" id="input-{palette}" class="input" type="radio">
        <label for="input-{palette}">{palette.replace(/-/g,' ').replace(/^(\w)/, v => v.toUpperCase())}</label>
    </div>
{/each}
