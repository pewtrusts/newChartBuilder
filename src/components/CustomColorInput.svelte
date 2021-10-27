<script context="module">
    import { get } from "svelte/store";
    import { s } from "../store";
    import addCustomColorProperties from './../griffin/scripts/addCustomColorProperties';
    import {addCustomPatterns} from './../griffin/scripts/addCustomColorProperties';
    import hash from './../griffin/scripts/hash';
    import Button from './Button.svelte';
</script>
<script>

export let seriesIndex;
let color = getComputedStyle(document.documentElement).getPropertyValue(`--color-${seriesIndex}`).trim();
let patternColors = [color, getComputedStyle(document.documentElement).getPropertyValue(`--color-${seriesIndex == 0 ? seriesIndex + 1 : seriesIndex - 1}`).trim()];
let isPatternMode = false;
s.CustomColors.subscribe(v => {
    if (v.length === 0){
        return;
    }
    color = v[seriesIndex] || color; // need to bind to subscribe for when saved charts are loaded.
        addCustomColorProperties({colors: v, hash: hash(v.join(''))})
    });
    s.PatternColors.subscribe(v => {
        addCustomPatterns({patterns: v, hash: hash(v.flat().join(''))})
});
function changeHandler(){
    const customColors = get(s.CustomColors);
    customColors[seriesIndex] = this ? this.value : color; // this is not defined when called by `use`, on mount
    s.CustomColors.set(customColors);
}
function setPatternColors(type = 'add'){
    const _patternColors = get(s.PatternColors);
    _patternColors[seriesIndex] = type == 'remove' ? [] : patternColors;
    s.PatternColors.set(_patternColors);
}
function changePatternHandler(){
    setPatternColors();
}
function toggleMode(){
    isPatternMode = !isPatternMode;
    if (!isPatternMode){
        setPatternColors('remove');
    }
}
    
</script>
{#if !isPatternMode}
<input use:changeHandler on:change="{changeHandler}" type="color" aria-label="Custom color {seriesIndex}" value="{color}">
{:else}
<input use:changePatternHandler on:change="{changePatternHandler}" type="color" aria-label="First custom color {seriesIndex}" value="{patternColors[0]}">
<input use:changePatternHandler on:change="{changePatternHandler}" type="color" aria-label="Second custom color {seriesIndex}" value="{patternColors[1]}">
Select the foreground and background colors or the diagonal pattern fill
{/if}
<Button type="tertiary" title="{isPatternMode ? 'or select solid fill' : 'or create pattern'}" clickHandler="{toggleMode}" />