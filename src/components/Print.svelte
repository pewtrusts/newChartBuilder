
<script>
    import Button from './Button.svelte';
    import { PrintWidth, PrintHeight } from './../store';
    export let enablePrint = true; // undo this for dev only
    let customWidth = false;
    let printWidth = 0;
    let printHeight = 0;
    $: customWidthInches = pixelsToInches(printWidth);
    let printSizes = [
        {
            value: '39p0',
            key: 'Full'
        },
        {
            value: '25p8',
            key: '2/3'
        },
        {
            value: '19p0',
            key: '1/2'
        },
        {
            value: '12p4',
            key: '1/3'  
        },
        {
            value: null,
            key: 'Custom'
        }
    ];
    function changeHandler(){
        enablePrint = !enablePrint;
    }
    function picaToInches(d){
        const split = d.split('p');
        return split[0] / 6 + split[1] / 12;
    }
    function pixelsToInches(px){
        return Number((px / 96 / 1.3333).toFixed(3));
    }
    function inchesToPixels(inches){
        return inches * 96 * 1.3333;
    }
    function widthHandler(){
        if (this.value == 'null'){
            customWidth = true;
            return;
        }
        const pixels = inchesToPixels(picaToInches(this.value));
        PrintWidth.set(pixels);
        customWidth = false;
    }
    function widthDisplay(d){
        var inches;
        if ( d.value ){
            inches = picaToInches(d.value);
        }
        let parenthetical = d.value ? ` ${d.value} (${Number(inches.toFixed(3)).toString()}in)` : '';
        return d.value ? `${d.key} column — ${parenthetical}` : d.key;
    }
    function customWidthHandler(){
        console.log(this.value);
        PrintWidth.set(inchesToPixels(this.value))
    }
    function heightHandler(){
        PrintHeight.set(inchesToPixels(this.value));
    }
    PrintWidth.set(inchesToPixels(picaToInches('39p0')));
    PrintWidth.subscribe(v => {
        printWidth = v;
    });
    PrintHeight.set(inchesToPixels(picaToInches('39p0')) * 0.5625);
    PrintHeight.subscribe(v => {
        printHeight = v;
    });
    function clickHandler(){
        PrintHeight.set(printWidth * 0.5625);
    }
    function downloadSVG(){
        const exportingOptions = {
            filename: 'chart',
            scale: 1,
            sourceHeight: window.PrintChart.container.clientHeight,
            sourceWidth: window.PrintChart.container.clientWidth,
            type: 'image/svg+xml'
        };
        window.PrintChart.exportChartLocal(exportingOptions, {});
    }
</script>
<style>
    label {
        font-weight: 900;
        display: block;
    }
    select, input {
        border: 1px solid #ccc;
        font-size: 0.85rem;
        line-height: 1.5;
        margin: 0 0 0.5rem;
    }
</style>
<p>Use this section to define print-only settings for the chart. You can then download an SVG ready to be placed in a document
    or to be edited further.</p>
<label><input on:change="{changeHandler}"type="checkbox" name="enable-print"> Enable print settings</label>
{#if enablePrint}
    <h3>Dimensions</h3>
    <label for="width-selector">Width:</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select on:change="{widthHandler}" name="width" id="width-selector">
        {#each printSizes as size}
        <option value="{size.value}">{widthDisplay(size)}</option>
        {/each}
    </select>
    {#if customWidth}
    <input aria-label="Set custom width in inches" style="width:80px;" on:change="{customWidthHandler}" type="number" bind:value="{customWidthInches}" step="0.001" min="0"> inches
    {/if}
    <br />
    <label for="height-input">Height:</label>
    <input id="height-input" style="width:80px;" on:change="{heightHandler}" type="number" step="0.001" min="0" value="{pixelsToInches(printHeight)}"> inches<br />
    <Button title="Reset to 16:9" type="secondary" {clickHandler} />
    <Button title="Download SVG" type="primary" clickHandler="{downloadSVG}" />
{/if}
