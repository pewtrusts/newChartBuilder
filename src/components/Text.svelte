<script>
    import Login from './Login.svelte'
    import sanitizeHtml from 'sanitize-html';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import Quill from 'quill';
    import brandOptions from "./../brand-options.json";
    import {s} from './../store';
    import Sprite from './Sprite.svelte';
    import Notices from './Notices.svelte';
    export let checkHeight;
    export let savedCharts;
    let project;
    let quills = {};
    let descRadio;
    let notesRadio;
    let captionRadio;
    let invalidQuill;
    let descProxy;
    let isDirtyNotice = {
        label: 'Unsaved changes',
        description: 'The form has changes that have not been applied yet to the chart. Hit the submit button for the changes to take effect.',
        type: 'warning'
    };
    let dummyResolve;
    let dummy = new Promise(function(resolve){ // dummy div at end of component will resolve this Promise. the quill inits await it
        dummyResolve = resolve;
    });
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
    // to do: ought to be a way to automate this: `use` function?
    let mapStores = {
        'chartCredit': s.ChartCredit,
        'chartDescription': s.ChartDescription,
        'chartLabel': s.ChartLabel,
        'chartCaption': s.ChartCaption,
        'chartNotes': s.ChartNotes,
        'chartTitle': s.ChartTitle,
        'chartSources': s.ChartSources,
        'chartSubtitle': s.ChartSubtitle
    };
    // to do: ought to be a way to automate this: `use` function?
    let localValues = {
        'chartCredit': '',
        'chartDescription': '',
        'chartLabel': '',
        'chartCaption': '',
        'chartNotes': '',
        'chartTitle': '',
        'chartSources': '',
        'chartSubtitle': ''
    };
    function changeHandler(){
        s.ChartProject.set(this.value);
    }
    function resolveDummy(){
        dummyResolve(true);
    }
    function proxyChange(){
        s.DescriptionProxy.set(this.value);
        invalidQuill = undefined;
    }
    function inputHandler(){
        isDirty = true;
    }
    function submitHandler(e){
        // disabled inputs are not included in FormData
        // handle value from quill
        const data =  new FormData(this);
        for (let [name,value] of data) {
            
            if ( descProxy == name){
                mapStores.chartDescription.set(sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                }));
            }
            if ( mapStores[name]) {
                mapStores[name].set(parseLinks(value));
            }
        }
        isSubmitting = true;
        setTimeout(() => {
            isSubmitting = false;
            isDirty = false;
        }, 500);
        //checkHeight();
        s.PictureIsMissingOrOld.set(true);
    }
    function replaceFn(url){
        return `<a href="${url}">${url.replace(/(\/(?!\/)|[.-])/g, '$1&#8203;')}</a>`;
    }
    function parseLinks(string){
                                // negative lookbehind after anything but quote or close tage
        return string.replace(/(?<![">])https?:[^ ;,:]+/g, replaceFn);
    }
    
    function invalid(e){
        
        if ( this.validity.valueMissing ){
            invalidQuill = this.name;
        }
    }
    async function initQuill(node,{controls, placeholder}){
        await dummy;
        const nextFocus = node.parentElement.nextElementSibling;
        const previousFocus = controls == 'chartNotes' ? captionRadio : controls == 'chartCaption' ? descRadio : notesRadio;
        const formats = ['bold','italic','link', 'list'];
        const editor = new Quill(node, {
            theme: 'snow',
            formats,
            modules: {
                keyboard: {
                    bindings: {
                        tab: {
                            key: 9,
                            handler: function(){
                                
                                nextFocus.focus();
                            }
                        },
                        esc: {
                            key: 27,
                            handler: function(){
                                
                                previousFocus.focus();
                            }
                        }
                    }
                },
                toolbar: ['bold','italic','link', 'list', { 'list': 'ordered'}, { 'list': 'bullet' }, 'clean'],
            },
            placeholder
        });
       
        editor.on('text-change', function(delta, oldDelta, source) {
            localValues[controls] = sanitizeHtml(editor.root.innerHTML, sanitizeOptions);
        });
        quills[controls] = editor;
    }
    function changeFocus(){
        
        quills[this.name].focus();
    }
    s.ChartProject.subscribe(v => {
        project = v;
    });
    s.DescriptionProxy.subscribe(v => {
        descProxy = v;
    });
    s.ChartCredit.subscribe(v => {
        localValues.chartCredit = v;
        localValues = localValues;
    });
    s.ChartDescription.subscribe(v => {
        localValues.chartDescription = v;
        localValues = localValues;
    });
    s.ChartLabel.subscribe(v => {
        localValues.chartLabel = v;
        localValues = localValues;
    });
    s.ChartNotes.subscribe(v => {
        localValues.chartNotes = v;
        localValues = localValues;
        if (!quills.chartNotes) return;
        quills.chartNotes.clipboard.dangerouslyPasteHTML(sanitizeHtml(v));
    });
    s.ChartCaption.subscribe(v => {
        localValues.chartCaption = v;
        localValues = localValues;
        if (!quills.chartCaption) return;
        quills.chartCaption.clipboard.dangerouslyPasteHTML(sanitizeHtml(v));
    });
    s.ChartTitle.subscribe(v => {
        localValues.chartTitle = v;
        localValues = localValues;
        if (!quills.chartTitle) return;
        quills.chartTitle.clipboard.dangerouslyPasteHTML(sanitizeHtml(v));
    });
    s.ChartSources.subscribe(v => {
        localValues.chartSources = v;
        localValues = localValues;
        if (!quills.chartSources) return;
        quills.chartSources.clipboard.dangerouslyPasteHTML(sanitizeHtml(v));
    });
    s.ChartSubtitle.subscribe(v => {
        localValues.chartSubtitle = v;
        localValues = localValues;
        if (!quills.chartSubtitle) return;
        quills.chartSubtitle.clipboard.dangerouslyPasteHTML(sanitizeHtml(v));
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
    
    input[type="text"]:not([name="chart-label"]) {
        width: 100%;
    }
    textarea {
        margin-bottom: 0;
    }
    textarea::placeholder, input::placeholder, :global(.ql-editor.ql-blank::before) {
        color: #767676;
        font-style: italic;
    }
    :global(.ql-editor){
        font-size: 0.85rem;
        color: var(--text-color, #000);
    }
    .quill-wrapper {
        z-index: 1;
        background-color: #fff;
    }
    .quill-container {
        width: 100%;
        height: 150px;
        width: 100%;
        margin-bottom: 0.5rem;
    }
    .quill-container--title, .quill-container--subtitle {
        height: 50px;
        margin-bottom: 14px;
    }
    textarea {
        width: 100%;
        min-height: 70px;
    }
    textarea[name="chartNotes"], textarea[name="chartSources"], textarea[name="chartCaption"], textarea[name="chartTitle"], textarea[name="chartSubtitle"]{
        position: absolute;
        z-index: -1;
        /*visibility: hidden;*/
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
    .desc-proxy {
        font-weight: normal;
        margin-top: -0.9rem;
        
        color: #767676;
    }
    .desc-proxy input {
        position: relative;
        top: 1px;
    }
    .proxied {
        opacity: 0.5;
    }
    .required.invalid {
        border: 1px solid var(--warning, orange);
        margin-bottom: 0.5rem;
        position: relative;
    }
    .required.invalid::before {
        content: 'required';
        position: absolute;
        right: 0;
        top: -1.3rem;
        color: var(--warning, orange);
        font-style: italic;
    }
    .required.invalid .quill-container {
        margin-bottom: 0;
        border-color: transparent;
    }
    :global(.required.invalid .ql-toolbar) {
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
    }
    form.name {
        padding: 0.5em;
        background-color: var(--light-gray, #f0f0f0);
        margin-bottom: 1em;
    }
</style>
<Notices {notices} />
{#await savedCharts}
<Login reason="to load previous projects" />
{:then _}
<form class="name">
    <label for="project-list--settings">Project name (select existing or add a new one):</label>
    <input
        value={project}
        class="datalist-input"
        id="project-list--settings"
        name="project"
        list="saved-projects"
        type="text"
        on:change="{changeHandler}"
    />
    <p style="margin:0;">
        The project name is not displayed but is necessary if you are designing a chart for project with custom styles. It is also required for the chart to be saved.</p>
</form>
{/await}
<form class:isDirty class:isSubmitting on:input="{inputHandler}" on:submit|preventDefault="{submitHandler}">
    <label>{brandOptions.chartLabelName}:<br /><input bind:value="{localValues.chartLabel}" placeholder="e.g., Figure 1" name="chartLabel" type="text"></label>
    <p class="label">{brandOptions.chartTitleName}:</p>
    <textarea required="{descProxy == 'chartTitle' ? 'required' : null}" bind:value="{localValues.chartTitle}" placeholder="e.g., Most Apples Are Harvested in the Fall" name="chartTitle" type="text"></textarea>
    <div class="quill-wrapper" class:required="{descProxy == 'chartTitle'}" class:invalid="{invalidQuill == 'chartTitle'}">
        <div class="quill-container quill-container--title" use:initQuill="{{controls: 'chartTitle',placeholder: 'e.g., Most Apples Are Harvested in the Fall'}}"></div>
    </div>
    <label class="desc-proxy"><input checked="{descProxy == 'chartTitle' ? 'checked' : null}" on:change="{proxyChange}" type="radio" name="desc-proxy" value="chartTitle"> use as description</label>
    <p class="label">{brandOptions.chartSubtitleName}:</p>
    <textarea required="{descProxy == 'chartSubtitle' ? 'required' : null}" bind:value="{localValues.chartSubtitle}" placeholder="e.g., Mix of fruit harvest by season" name="chartSubtitle" type="text"></textarea>
    <div class="quill-wrapper" class:required="{descProxy == 'chartSubtitle'}" class:invalid="{invalidQuill == 'chartSubtitle'}">
        <div class="quill-container quill-container--subtitle" use:initQuill="{{controls: 'chartSubtitle',placeholder: 'e.g., Mix of fruit harvest by season'}}"></div>
    </div>
    <label class="desc-proxy"><input checked="{descProxy == 'chartSubtitle' ? 'checked' : null}" on:change="{proxyChange}" type="radio" name="desc-proxy" value="chartSubtitle"> use as description</label>
    <label class:proxied="{descProxy !== 'chartDescription'}">Description:<br /><textarea disabled="{descProxy !== 'chartDescription' ? 'disabled' : null}" required="{descProxy == 'chartDescription' ? 'required' : null}" bind:value="{localValues.chartDescription}" placeholder="REQUIRED for screen readers and search engines: e.g., Chart showing the number of apples, oranges, and peaches harvested in each season. If other fields are descriptive enough you may choose them instead." name="chartDescription" type="text"></textarea></label>
    <label bind:this="{descRadio}" style="margin-top:-0.4rem;" class="desc-proxy"><input checked="{descProxy == 'chartDescription' ? 'checked' : null}" on:change="{proxyChange}" type="radio" name="desc-proxy" value="chartDescription"> use as description</label>
    
    <p class="label">Caption:</p>
    <textarea on:focus="{changeFocus}" tabindex="0" on:invalid="{invalid}" required="{descProxy == 'chartCaption' ? 'required' : null}" bind:value="{localValues.chartCaption}" name="chartCaption" type="text"></textarea>
    <div class="quill-wrapper" class:required="{descProxy == 'chartCaption'}" class:invalid="{invalidQuill == 'chartCaption'}">
        <div class="quill-container" use:initQuill="{{controls: 'chartCaption',placeholder: ''}}"></div>
    </div>
    <label bind:this="{captionRadio}" style="margin-top:-0.4rem;" class="desc-proxy"><input checked="{descProxy == 'chartCaption' ? 'checked' : null}" on:change="{proxyChange}" type="radio" name="desc-proxy" value="chartCaption"> use as description</label>
    
    <p class="label">Notes:</p>
    <textarea on:focus="{changeFocus}" tabindex="0" on:invalid="{invalid}" required="{descProxy == 'chartNotes' ? 'required' : null}" bind:value="{localValues.chartNotes}" name="chartNotes" type="text"></textarea>
    <div class="quill-wrapper" class:required="{descProxy == 'chartNotes'}" class:invalid="{invalidQuill == 'chartNotes'}">
        <div class="quill-container" use:initQuill="{{controls: 'chartNotes',placeholder: 'e.g., Note: Data for 2020 is tentative.'}}"></div>
    </div>
    <label bind:this="{notesRadio}" style="margin-top:-0.4rem;" class="desc-proxy"><input checked="{descProxy == 'chartNotes' ? 'checked' : null}" on:change="{proxyChange}" type="radio" name="desc-proxy" value="chartNotes"> use as description</label>
    <p class="label">Sources:</p>
    <textarea bind:value="{localValues.chartSources}" name="chartSources" type="text"></textarea>
    <div class="quill-wrapper">
        <div class="quill-container" use:initQuill="{{controls: 'chartSources', placeholder: 'e.g., Source: John Adams, ABCs Are Easy, 1955'}}"></div>
    </div>
    <label>Credit:<br /><input bind:value="{localValues.chartCredit}" placeholder="e.g., © 2021 The Pew Charitable Trusts" name="chartCredit" type="text"></label>
    <input disabled="{isDirty ? null : 'disabled'}" class="button button--primary" type="submit">
    <div class="checkmark">
        <Sprite width="20" id="check" brandPrimary="{true}" />
    </div>
    <div use:resolveDummy></div>
</form>