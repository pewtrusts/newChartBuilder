<script>
import { get } from "svelte/store";
import { CustomColors } from "../store";
import addCustomColorProperties from './../griffin/scripts/addCustomColorProperties';
import hash from './../griffin/scripts/hash';

    export let seriesIndex;
    let color = getComputedStyle(document.documentElement).getPropertyValue(`--color-${seriesIndex}`).trim();
    CustomColors.subscribe(v => {
        color = v[seriesIndex]; // need to bind to subscribe for when saved charts are loaded.
    });
    function changeHandler(){
        const customColors = get(CustomColors);
        customColors[seriesIndex] = this ? this.value : color; // this is not defined when called by `use`, on mount
        CustomColors.set(customColors);
        console.log(get(CustomColors));
        if ( this ){
            addCustomColorProperties({colors: customColors, hash: hash(customColors.join(''))})
        }
    }
    
</script>
<input use:changeHandler on:change="{changeHandler}" type="color" aria-label="Custom color {seriesIndex}" value="{color}">