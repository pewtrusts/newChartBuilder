<script>
    /**
     * perhaps later if there are more required fields, put in a derived stored of missing
     * required fields and base the dialog on that. now it is only dependent on ChartDescription
     */
    import { s } from './../store';
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
    let exportType;
    let showCode = false;
    export let dialog;
    export let clickSave;
    s.ChartHasBeenSaved.subscribe(v => {
        chartHasBeenSaved = v;
    });
    s.ChartDescription.subscribe(v => {
        chartDescription = v;
    });
    s.CodeExport.subscribe(v => {
        codeExport = v;
    });
    s.PictureIsMissingOrOld.subscribe(v => {
        pictureIsMissingOrOld = v;
    });
    s.ExportType.subscribe(v => {
        exportType = v;
    });
    function toggleShowCode(e){
        e.preventDefault()
        showCode = !showCode;
    }
    function changeHandler(){
        s.ExportType.set(this.value);
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
        
        if (data.has('chartDescription')){
            s.ChartDescription.set(data.get('chartDescription'));
        }
        if ( pictureIsMissingOrOld ){
            s.IsWorking.set(true);
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
    .code-export {
        display: none;
        width: 100%;
        font-family: var(--mono, monospace);
        font-size: 1rem;
        height: calc(100% - 40px);
    }
    .code-export.showCode {
        display: block;
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
    
    .form-wrapper label {
        font-weight: 900;
        margin: 0 0 0.5rem;
    }
    .form-wrapper textarea {
        width: 100%;
        font-size: 0.85rem;
        line-height: 1.5;
        margin-top: 0.2em;
    }
    .form-wrapper textarea::placeholder {
        color: #767676;
        font-style: italic;
    }
    form.chart-description {
        background-color: var(--light-gray, #f0f0f0);
        padding: 0.5em;
    }
</style>
<!-- to do: remove spacing to minimize output -->
<!--<textarea value="{JSON.stringify(codeExport, null, 2)}"></textarea>-->

<form class="chart-description">
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
        <p style="margin-bottom: 0;margin-top:0;">The chart is missing a description, which is required for screen readers and search engines.
            Please enter a description above or go the <a on:click|preventDefault="{() => s.ActiveSection.set({method:'click', value: 'text'})}" href="?">the text section</a>
            to select another field to serve as the description</p>
    {/if}
</form>
<p>Copy the code needed to include the chart on the website. The website will render the chart as a static image if you have <strong><em>static</em></strong> selected;
it will replace the image with a dynamic Highcharts version if you have <strong><em>dynamic</em></strong> selected. If you select <strong><em>lazy</em></strong>, the dynamic chart will trigger
when it is scrolled into view.</p>
<form on:submit|preventDefault="{clickHandler}">
    <div class="selectors">
        <label><input on:change="{changeHandler}" name="static-dynamic" type="radio" value="static" checked="{exportType == 'static' || null}"> Static</label>
        <label><input on:change="{changeHandler}" name="static-dynamic" type="radio" value="dynamic" checked="{exportType == 'dynamic' || null}"> Dynamic</label>
        <label><input on:change="{changeHandler}" name="static-dynamic" type="radio" value="lazy" checked="{exportType == 'lazy' || null}"> Lazy</label>
    </div>
    <div class:showSuccess class:fadeSuccess bind:this="{container}" class="container"><Button title="Copy to clipboard" type="primary" /></div>
    <Button title="{showCode ? 'Hide' : 'Show'} code" type="secondary" clickHandler="{toggleShowCode}" />
    
</form>
<textarea class:showCode class="code-export" value="{codeExport}"></textarea>