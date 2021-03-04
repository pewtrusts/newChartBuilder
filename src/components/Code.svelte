<script>
    /**
     * perhaps later if there are more required fields, put in a derived stored of missing
     * required fields and base the dialog on that. now it is only dependent on ChartDescription
     */
    import { ChartDescription, CodeExport, PictureIsMissingOrOld, ExportType, IsWorking, ChartHasBeenSaved } from './../store';
    import getImageData from './../scripts/get-image-data';
    import Button from './Button.svelte';
    import SaveAfterCopy from './SaveAfterCopy.svelte';
    let codeExport;
    let pictureIsMissingOrOld;
    let chartHasBeenSaved;
    let chartDescription;
    let container;
    let showSuccess = false;
    let fadeSuccess = false;
    export let dialog;
    export let clickSave;
    ChartHasBeenSaved.subscribe(v => {
        chartHasBeenSaved = v;
    });
    ChartDescription.subscribe(v => {
        chartDescription = v;
    });
    CodeExport.subscribe(v => {
        codeExport = v;
    });
    PictureIsMissingOrOld.subscribe(v => {
        pictureIsMissingOrOld = v;
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
    function copyCode(){
        navigator.clipboard.writeText(codeExport).then(() => {
            flashSuccess();
        });
    }
    function clickHandler(){
        const data =  new FormData(this);
        console.log(Array.from(data.keys()));
        if (data.has('chartDescription')){
            ChartDescription.set(data.get('chartDescription'));
        }
        if ( pictureIsMissingOrOld ){
            IsWorking.set(true);
            requestIdleCallback(function(){
                getImageData().then(() => {
                    copyCode();
                    if (!chartHasBeenSaved){
                        dialog = {
                            component: SaveAfterCopy,
                            props: {
                                clickSave
                            }
                        };
                        /**
                         * to do : separate show dialog from dialog itself
                        */
                    }
                    
                });
            }, {timeout: 2000})
        } else {
            copyCode();
            if (!chartHasBeenSaved){
                dialog = {
                    component: SaveAfterCopy,
                    props: {
                        clickSave
                    }
                };
            }
        }
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
    .form-wrapper {
        margin-top: 1em;
    }
    .form-wrapper label {
        font-weight: 900;
        margin: 0 0 0.5rem;
    }
    .form-wrapper textarea {
        display: block;
        width: 100%;
        font-size: 0.85em;
        line-height: 1.5;
    }
    .form-wrapper textarea::placeholder {
        color: #767676;
        font-style: italic;
    }
</style>
<!-- to do: remove spacing to minimize output -->
<!--<textarea value="{JSON.stringify(codeExport, null, 2)}"></textarea>-->
<p>Copy the code needed to include the chart on the website. The website will render the chart as a static image if you have <em>static</em> selected;
it will replace the image with a dynamic Highcharts version if you have <em>dynamic</em> selected.</p>
<form on:submit|preventDefault="{clickHandler}">
    <div class="selectors">
        <label><input on:change="{changeHandler}" name="static-dynamic" type="radio" value="static" checked > Static</label>
        <label><input on:change="{changeHandler}" name="static-dynamic" type="radio" value="dynamic" > Dynamic</label>
    </div>
    <div class:showSuccess class:fadeSuccess bind:this="{container}" class="container"><Button title="Copy to clipboard" type="primary" /></div>
    {#if !chartDescription }
    <div class="form-wrapper">
        <label>Description:<textarea 
            required
            name="chartDescription" 
            id="chartDescription-missing" 
            placeholder="REQUIRED for screen readers and search engines: e.g., Chart showing the number of apples, oranges, and peaches harvested in each season."
            ></textarea>
        </label>
    </div>
    {/if}
</form>
<textarea value="{codeExport}"></textarea>