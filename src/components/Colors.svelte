<script>
    import ColorPalette from './ColorPalette.svelte';
    import SeriesColorSelectors from './SeriesColorSelectors.svelte';
    import brandOptions from '../brand-options.json';
    import griffinConfig from './../griffin/griffin-config.json';
    import {ColorByPoint, SelectedColorPalette} from './../store';
    import Notices from './Notices.svelte';
    let palettes = ['default', ...brandOptions.additionalColorPalettes, 'custom'];
    let notices = new Set();
    let selectedPalette;
    SelectedColorPalette.subscribe(v => {
        if (!v) return;
        selectedPalette = v;
    });
    const colorByPointNotice = {
        label: 'colorByPoint',
        description: 'The data points in one or more series will have colors assigned individually.  ' + 
                     'This is automatic for some chart types, such as pie charts.',
        type: 'info'
    };
    ColorByPoint.subscribe(v => {
        notices[v.includes(true) ? 'add' : 'delete'](colorByPointNotice);
        notices = notices;
    });
</script>
<style>
   .grid-container {
        display: grid;
        grid-template-columns: repeat( auto-fit, minmax(150px, 1fr) );
        grid-column-gap: 5px;
        grid-row-gap: 5px;
   }
  
</style>
<div class="container">
    <Notices {notices} />
    <p class="instruction-step">1. Select from preset palettes below or make a custom palette.</p>
    <!--<p class="note">Change the numbers beneath the colors in the default palette to change which series or points they apply to.
        The monochrome palettes will automatically space series or points as uniformly as possible across the range of values.
    </p>-->
    <div class="grid-container">
        {#each palettes as palette}
        <ColorPalette {palette} colorCount="{griffinConfig.numberOfColors}" />
        {/each}
    </div>
    <SeriesColorSelectors {selectedPalette} colorCount="{griffinConfig.numberOfColors}" />
</div>
