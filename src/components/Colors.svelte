<script>
    import ColorPalette from './ColorPalette.svelte';
    import brandOptions from '../brand-options.json';
    import griffinConfig from './../griffin/griffin-config.json';
    import {ColorByPoint} from './../store';
    import Notices from './Notices.svelte';
    let palettes = ['default', ...brandOptions.additionalColorPalettes];
    let notices = new Set();
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
    <p>1. Select from the default palettes below</p>
    <p class="note">The monochrome palettes will automatically space series or points as uniformly as possible across the range of values</p>
    <div class="grid-container">
        {#each palettes as palette}
        <ColorPalette {palette} colorCount="{griffinConfig.numberOfColors}" />
        {/each}
    </div>
</div>
