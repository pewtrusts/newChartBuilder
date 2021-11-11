<script>
    import ColorPalette from './ColorPalette.svelte';
    import SeriesColorSelectors from './SeriesColorSelectors.svelte';
    import brandOptions from '../brand-options.json';
    import griffinConfig from '@Submodule/newgriffin/src/griffin-config.json';
    import {s} from './../store';
    import Notices from './Notices.svelte';
    let palettes = ['default', ...brandOptions.additionalColorPalettes];
    let notices = new Set();
    let selectedPalette;
    s.SelectedColorPalette.subscribe(v => {
        if (!v) return;
        selectedPalette = v;
    });
    const colorByPointNotice = {
        label: 'colorByPoint',
        description: 'The data points in one or more series will have colors assigned individually.  ' + 
                     'This is automatic for some chart types, such as pie charts.',
        type: 'info'
    };
    s.ColorByPoint.subscribe(v => {
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
        margin-bottom: 5px;
   }
   .default-wrapper {
       margin-bottom: 1.5rem;
   }
</style>
<div class="container">
    <Notices {notices} />
    <p class="instruction-step">1. Select from preset palettes below or make a custom palette.</p>
    <!--<p class="note">Change the numbers beneath the colors in the default palette to change which series or points they apply to.
        The monochrome palettes will automatically space series or points as uniformly as possible across the range of values.
    </p>-->
    <div class="default-wrapper">
        <ColorPalette palette="{palettes[0]}" 
                colorCount="{griffinConfig.numberOfColors}"
                defaultPaletteColorCount="{griffinConfig.numberOfColorsInDefaultPalette}"
            />
    </div>
    <div class="grid-container">
        {#each palettes.slice(1) as palette}
        <ColorPalette {palette} 
            colorCount="{griffinConfig.numberOfColors}"
            defaultPaletteColorCount="{griffinConfig.numberOfColorsInDefaultPalette}"
        />
        {/each}
    </div>
    <div class="default-wrapper">
        <ColorPalette palette="custom"
                colorCount="{griffinConfig.numberOfColors}"
                defaultPaletteColorCount="{griffinConfig.numberOfColorsInDefaultPalette}"
        />
    </div>
    <SeriesColorSelectors {selectedPalette}
        colorCount="{griffinConfig.numberOfColors}"
        defaultPaletteColorCount="{griffinConfig.numberOfColorsInDefaultPalette}"
    />
</div>
