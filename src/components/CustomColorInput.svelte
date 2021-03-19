<script>
import { get } from "svelte/store";
import { s } from "../store";
import addCustomColorProperties from './../griffin/scripts/addCustomColorProperties';
import hash from './../griffin/scripts/hash';

    export let seriesIndex;
    let color = getComputedStyle(document.documentElement).getPropertyValue(`--color-${seriesIndex}`).trim();
    s.CustomColors.subscribe(v => {
        if (v.length === 0){
            return;
        }
        color = v[seriesIndex] || color; // need to bind to subscribe for when saved charts are loaded.
    });
    function changeHandler(){
        const customColors = get(s.CustomColors);
        customColors[seriesIndex] = this ? this.value : color; // this is not defined when called by `use`, on mount
        s.CustomColors.set(customColors);
        
        if ( this ){
            addCustomColorProperties({colors: customColors, hash: hash(customColors.join(''))})
        }
    }
    
</script>
<input on:change="{changeHandler}" type="color" aria-label="Custom color {seriesIndex}" value="{color}">