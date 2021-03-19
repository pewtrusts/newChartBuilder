
<script>
    import Button from './Button.svelte';
    import { s } from './../store';
    import convert from './../scripts/unit-conversions';
    export let enablePrint = false; 
    let customWidth = false;
    let printWidth = 0;
    let printHeight = 0;
    $: customWidthInches = convert.pixelsToInches(printWidth);
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
    function widthHandler(){
        if (this.value == 'null'){
            customWidth = true;
            return;
        }
        const pixels = convert.inchesToPixels(convert.picaToInches(this.value));
        s.PrintWidth.set(pixels);
        customWidth = false;
    }
    function widthDisplay(d){
        var inches;
        if ( d.value ){
            inches = convert.picaToInches(d.value);
        }
        let parenthetical = d.value ? ` ${d.value} (${Number(inches.toFixed(3)).toString()}in)` : '';
        return d.value ? `${d.key} column — ${parenthetical}` : d.key;
    }
    function customWidthHandler(){
        console.log(this.value);
        s.PrintWidth.set(convert.inchesToPixels(this.value))
    }
    function heightHandler(){
        s.PrintHeight.set(convert.inchesToPixels(this.value));
    }
    s.PrintWidth.set(convert.inchesToPixels(convert.picaToInches('39p0')));
    s.PrintWidth.subscribe(v => {
        printWidth = v;
    });
    s.PrintHeight.set(convert.inchesToPixels(convert.picaToInches('39p0')) * 0.5625);
    s.PrintHeight.subscribe(v => {
        printHeight = v;
    });
    function clickHandler(){
        s.PrintHeight.set(printWidth * 0.5625);
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
    <input id="height-input" style="width:80px;" on:change="{heightHandler}" type="number" step="0.001" min="0" value="{convert.pixelsToInches(printHeight)}"> inches<br />
    <Button title="Reset to 16:9" type="secondary" {clickHandler} />
    <Button title="Download SVG" type="primary" clickHandler="{downloadSVG}" />
{/if}
