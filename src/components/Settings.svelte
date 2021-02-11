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
    import Sprite from './Sprite.svelte';
    import Notices from './Notices.svelte';
    let isDirtyNotice = {
        label: 'Unsaved changes',
        description: 'The form has changes that have not been applied yet to the chart. Hit the submit button for the changes to take effect.',
        type: 'warning'
    };
    $:notices = (function(){
        const _notices = notices || new Set();
        _notices[isDirty ? 'add' : 'delete'](isDirtyNotice);
        return _notices;
    })();
    let isDirty = false;
    let isSubmitting = false;
    let sanitizeOptions = {
        allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
        allowedAttributes: {
            'a': [ 'href' ]
        }
    };
    let mapStores = {
        'chartCredit': ChartCredit,
        'chartDescription': ChartDescription,
        'chartLabel': ChartLabel,
        'chartNotes': ChartNotes,
        'chartTitle': ChartTitle,
        'chartSources': ChartSources,
        'chartSubtitle': ChartSubtitle
    };
    let localValues = {
        'chartCredit': '',
        'chartDescription': '',
        'chartLabel': '',
        'chartNotes': '',
        'chartTitle': '',
        'chartSources': '',
        'chartSubtitle': ''
    };
    function inputHandler(){
        isDirty = true;
    }
    function submitHandler(e){
        const data =  new FormData(this);
        for (let [name,value] of data) {
            console.log(name,value);
            mapStores[name].set(parseLinks(value));
        }
        isSubmitting = true;
        setTimeout(() => {
            isSubmitting = false;
            isDirty = false;
        }, 500);
    }
    function replaceFn(url){
        return `<a href="${url}">${url.replace(/(\/(?!\/)|[.-])/g, '$1&#8203;')}</a>`;
    }
    function parseLinks(string){
                                // negative lookbehind after anything but quote or close tage
        return string.replace(/(?<![">])https?:[^ ;,:]+/g, replaceFn);
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
            localValues[controls] = sanitizeHtml(editor.root.innerHTML, sanitizeOptions);
        });
    }
    ChartCredit.subscribe(v => {
        localValues.chartCredit = v;
        localValues = localValues;
    });
    ChartDescription.subscribe(v => {
        localValues.chartDescription = v;
        localValues = localValues;
    });
    ChartLabel.subscribe(v => {
        localValues.chartLabel = v;
        localValues = localValues;
    });
    ChartNotes.subscribe(v => {
        localValues.chartNotes = v;
        localValues = localValues;
    });
    ChartTitle.subscribe(v => {
        localValues.chartTitle = v;
        localValues = localValues;
    });
    ChartSources.subscribe(v => {
        localValues.chartSources = v;
        localValues = localValues;
    });
    ChartSubtitle.subscribe(v => {
        localValues.chartSubtitle = v;
        localValues = localValues;
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
    input[type="text"], textarea {
        font-size: 0.85rem;
    }
    input[type="text"]:not([name="chart-label"]) {
        width: 100%;
    }
    textarea::placeholder, input::placeholder, :global(.ql-editor.ql-blank::before) {
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
    textarea {
        width: 100%;
    }
    textarea[name="chartNotes"], textarea[name="chartSources"]{
        display:none;
    }
    :global(.ql-editor){
        font-family: var(--font-primary, sans);
    }
    .checkmark {
        display: inline-block;
        position: relative;
        top: 2px;
        transition: opacity 100ms ease-in;
        opacity: 0;
    }
    .isSubmitting .checkmark {
        opacity: 1;
    }
</style>
<Notices {notices} />
<form class:isDirty class:isSubmitting on:input="{inputHandler}" on:submit|preventDefault="{submitHandler}">
    <label>{brandOptions.chartLabelName}:<br /><input bind:value="{localValues.chartLabel}" placeholder="e.g., Figure 1" name="chartLabel" type="text"></label>
    <label>{brandOptions.chartTitleName}:<br /><input bind:value="{localValues.chartTitle}" placeholder="e.g., Most Apple Are Harvested in the Fall" name="chartTitle" type="text"></label>
    <label>{brandOptions.chartSubtitleName}:<br /><input bind:value="{localValues.chartSubtitle}" placeholder="e.g., Mix of fruit harvest by season" name="chartSubtitle" type="text"></label>
    <label>Description:<br /><textarea required bind:value="{localValues.chartDescription}" placeholder="REQUIRED for screen readers and search engines: e.g., Chart showing the number of apples, oranges, and peaches harvested in each season." name="chartDescription" type="text"></textarea></label>
    <p class="label">Notes:</p>
    <textarea bind:value="{localValues.chartNotes}" name="chartNotes" type="text"></textarea>
    <div class="quill-container" use:initQuill="{{controls: 'chartNotes',placeholder: 'e.g., Note: Data for 2020 is tentative.'}}"></div>
    <p class="label">Sources:</p>
    <textarea bind:value="{localValues.chartSources}" name="chartSources" type="text"></textarea>
    <div class="quill-container" use:initQuill="{{controls: 'chartSources', placeholder: 'e.g., Source: John Adams, ABCs Are Easy, 1955'}}"></div>
    <label>Credit:<br /><input bind:value="{localValues.chartCredit}" placeholder="e.g., © 2021 The Pew Charitable Trusts" name="chartCredit" type="text"></label>
    <input disabled="{isDirty ? null : 'disabled'}" class="button button--primary" type="submit">
    <div class="checkmark">
        <Sprite width="20" id="check" brandPrimary="{true}" />
    </div>
</form>