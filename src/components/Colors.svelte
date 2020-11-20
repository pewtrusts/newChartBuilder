<script>
    import ColorPalette from './ColorPalette.svelte';
    import brandOptions from '../brand-options.json';
    import griffinConfig from './../griffin/griffin-config.json';
    let palettes = ['default', ...brandOptions.additionalColorPalettes];
</script>
<style>
   
</style>
{#each palettes as palette}
<ColorPalette {palette} colorCount="{griffinConfig.numberOfColors}" />
{/each}
