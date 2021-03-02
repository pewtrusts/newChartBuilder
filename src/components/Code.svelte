<script>
    import { CodeExport, PictureIsMissingOrOld, ExportType } from './../store';
    import Button from './Button.svelte';
    let codeExport;
    let pictureIsMissingOrOld = false;
    let container;
    let showSuccess = false;
    let fadeSuccess = false;
    CodeExport.subscribe(v => {
        codeExport = v;
    });
    PictureIsMissingOrOld.subscribe(v => {
        pictureIsMissingOrOld = true;
    });
    function changeHandler(){
        ExportType.set(this.value);
    }
    function flashSuccess(){
        showSuccess = true;
        
        setTimeout(() => {
            fadeSuccess = true;
            setTimeout(() => {
                showSuccess = false;
                fadeSuccess = false;
            }, 1000);
        },500);
    }
    function clickHandler(){
        navigator.clipboard.writeText(codeExport).then(() => {
            flashSuccess();
        });
    }
</script>
<style>
    textarea {
        /*width: 100%;
        font-family: var(--mono, monospace);
        height: calc(100% - 40px);*/
        display: none;
    }
    .container {
        display: inline-block;
        position: relative;
    }
    .showSuccess::after {
        content: 'done!';
        position: absolute;
        display: block;
        padding-left: 0.5em;
        top: 50%;
        left: 100%;
        opacity: 1;
        transition: opacity 1000ms ease-out;
        transform: translateY(-50%);
        color: var(--highlight-color, #000);
    }
    .showSuccess.fadeSuccess::after {
        opacity: 0;
    }
    .selectors {
        display: block;
        margin-bottom: 1em;
    }
</style>
<!-- to do: remove spacing to minimize output -->
<!--<textarea value="{JSON.stringify(codeExport, null, 2)}"></textarea>-->
<p>Copy the code needed to include the chart on the website. The website will render the chart as a static image if you have <em>static</em> selected;
it will replace the image with a dynamic Highcharts version if you have <em>dynamic</em> selected.</p>
<div class="selectors">
    <label><input on:change="{changeHandler}" name="static-dynamic" type="radio" value="static" checked > Static</label>
    <label><input on:change="{changeHandler}" name="static-dynamic" type="radio" value="dynamic" > Dynamic</label>
</div>
<div class:showSuccess class:fadeSuccess bind:this="{container}" class="container"><Button title="Copy to clipboard" {clickHandler} type="primary" /></div>
<textarea value="{codeExport}"></textarea>