<script>
    import ColorPalettes from './ColorPalettes.svelte';
    import brandOptions from '../brand-options.json';
    import griffinConfig from './../griffin/griffin-config.json';
    let palettes = ['default', ...brandOptions.additionalColorPalettes];
</script>
<style>
    .swatch {
        width: 10px;
        height: 10px;
    }
</style>
<ColorPalettes {palettes} colorCount="{griffinConfig.numberOfColors}" />
