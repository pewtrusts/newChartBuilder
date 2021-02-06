<script>
    
     /**
      * to do: toggle view of htm vs styled and
      * bind htm inout to display. either through clipboard convert or direct
      * to innerHTML
      */
     

    import sanitizeHtml from 'sanitize-html';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import Quill from 'quill';
    import brandOptions from "./../brand-options.json";
    import {ChartCredit, ChartDescription, ChartLabel, ChartNotes, ChartTitle, ChartSources, ChartSubtitle} from './../store';
    let sanitizeOptions = {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
        allowedAttributes: {
            'a': [ 'href' ]
        }
    };
    let mapStores = {
        'chart-credit': ChartCredit,
        'chart-description': ChartDescription,
        'chart-label': ChartLabel,
        'chart-notes': ChartNotes,
        'chart-title': ChartTitle,
        'chart-sources': ChartSources,
        'chart-subtitle': ChartSubtitle
    };
    let chartCredit = ''
    let chartDescription = '';
    let chartLabel = '';
    let chartNotes = '';
    let chartTitle = '';
    let chartSources = '';
    let chartSubtitle = '';
    function submitHandler(e){
        const data =  new FormData(this);
        for (let [name,value] of data) {
            console.log(name,value);
            mapStores[name].set(value);
        }
    }
    function inputHandler(e){
        /**
         * input only files user action not of dynamically setting value
         * should be able to use this with distinguishing inputType `insertFromPaste`
         * from `insertText` or not to call editor.clipboard.dangerouslyPasteHTML (right?)
        */
        console.log(e, this);
    }
    function initQuill(node,{controls, placeholder}){
        const formats = ['bold','italic','link', 'list'];
        const editor = new Quill(node, {
            theme: 'snow',
            formats,
            modules: {
                toolbar: ['bold','italic','link', 'list', { 'list': 'ordered'}, { 'list': 'bullet' }, 'clean'],
            },
            placeholder
        });
        editor.on('text-change', function(delta, oldDelta, source) {
            /**
             * possibly detect HTML (presence of angle brackets) or Word
             * ACTUALLY  it handles Word perfectly
             * AND rendered HTML
            */

            console.log(editor.root.innerHTML, delta, oldDelta, source);
            mapStores[controls].set(sanitizeHtml(editor.root.innerHTML, sanitizeOptions));
        });
    }
    ChartCredit.subscribe(v => {
        chartCredit = v;
    });
    ChartDescription.subscribe(v => {
        chartDescription = v;
    });
    ChartLabel.subscribe(v => {
        chartLabel = v;
    });
    ChartNotes.subscribe(v => {
        chartNotes = v;
    });
    ChartTitle.subscribe(v => {
        chartTitle = v;
    });
    ChartSources.subscribe(v => {
        chartSources = v;
    });
    ChartSubtitle.subscribe(v => {
        chartSubtitle = v;
    });
</script>
<style>
    label {
        display: block;
        margin: 0 0 0.5rem;
        font-weight: 900;
    }
    .label {
        margin: 0;
        font-weight: 900;
    }
    input[type="text"], textarea {
        border: 1px solid #ccc;
        border-radius: 0;
        line-height: 1.5;
        color: var(--text-color, #000);
    }
    input[type="text"]{
        font-size: 0.85rem;
    }
    input[type="text"]:not([name="chart-label"]) {
        width: 100%;
    }
    input::placeholder, :global(.ql-editor.ql-blank::before) {
        color: #767676;
        font-style: italic;
    }
    :global(.ql-editor){
        font-size: 0.85rem;
        color: var(--text-color, #000);
    }
    .quill-container {
        width: 100%;
        height: 150px;
    }
    .quill-container {
        
        width: 100%;
        margin-bottom: 0.5rem;
    }
    textarea[name="chart-notes"], textarea[name="chart-sources"]{
        display:none;
    }
    :global(.ql-editor){
        font-family: var(--font-primary, sans);
    }
</style>
<form on:submit|preventDefault="{submitHandler}">
    <label>{brandOptions.chartLabelName}:<br /><input bind:value="{chartLabel}" placeholder="e.g., Figure 1" name="chart-label" type="text"></label>
    <label>{brandOptions.chartTitleName}:<br /><input bind:value="{chartTitle}" placeholder="e.g., Most State Tax Revenue Comes from Personal Income Tax and Sales Tax" name="chart-title" type="text"></label>
    <label>{brandOptions.chartSubtitleName}:<br /><input bind:value="{chartSubtitle}" placeholder="e.g., Mix of tax sources by state" name="chart-subtitle" type="text"></label>
    <label>Description:<br /><input bind:value="{chartDescription}" placeholder="Please provide a detailed description of the chart for screen readers and search engines" name="chart-description" type="text"></label>
    <p class="label">Notes:</p>
    <textarea on:input="{inputHandler}" bind:value="{chartNotes}" name="chart-notes" type="text"></textarea>
    <div class="quill-container" use:initQuill="{{controls: 'chart-notes',placeholder: 'e.g., Note: Data for 2020 is tentative.'}}"></div>
    <p class="label">Sources:</p>
    <textarea bind:value="{chartSources}" name="chart-sources" type="text"></textarea>
    <div class="quill-container" use:initQuill="{{controls: 'chart-sources', placeholder: 'e.g., Source: John Adams, ABCs Are Easy, 1955'}}"></div>
    <label>Credit:<br /><input bind:value="{chartCredit}" placeholder="e.g., © 2021 The Pew Charitable Trusts" name="chart-credit" type="text"></label>
    <input class="button button--primary" type="submit">

</form>