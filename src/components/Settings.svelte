<script>
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
    function initQuill(node){
        const formats = ['bold','italic','link', 'list'];
        const editor = new Quill(node, {
            theme: 'snow',
            formats,
            modules: {
                toolbar: ['bold','italic','link', 'list', { 'list': 'ordered'}, { 'list': 'bullet' }, 'clean']
            }
        });
        editor.on('text-change', function() {
            console.log(editor.root.innerHTML);
            ChartNotes.set(sanitizeHtml(editor.root.innerHTML, sanitizeOptions));
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
    }
    input[type="text"]{
        font-size: 0.85em;
    }
    input[type="text"]:not([name="chart-label"]) {
        width: 100%;
    }
    input::placeholder {
        color: #767676;
    }
    .quill-container {
        width: 100%;
        height: 300px;
    }
</style>
<form on:submit|preventDefault="{submitHandler}">
    <label>{brandOptions.chartLabelName}:<br /><input bind:value="{chartLabel}" placeholder="e.g., Figure 1" name="chart-label" type="text"></label>
    <label>{brandOptions.chartTitleName}:<br /><input bind:value="{chartTitle}" placeholder="e.g., Most State Tax Revenue Comes from Personal Income Tax and Sales Tax" name="chart-title" type="text"></label>
    <label>{brandOptions.chartSubtitleName}:<br /><input bind:value="{chartSubtitle}" placeholder="e.g., Mix of tax sources by state" name="chart-subtitle" type="text"></label>
    <label>Description:<br /><input bind:value="{chartDescription}" placeholder="A detailed description for screen readers and search engines" name="chart-description" type="text"></label>
    <label>Notes:<br /><textarea bind:value="{chartNotes}" placeholder="e.g., Note: Data for 2020 is tentative" name="chart-notes" type="text"></textarea></label>
    <p class="label">Notes:</p>
    <div class="quill-container" use:initQuill></div>
    <label>Source:<br /><input bind:value="{chartSources}" placeholder="e.g., Source: John Adams, ABCs Are Easy, 1955" name="chart-sources" type="text"></label>
    <label>Credit:<br /><input bind:value="{chartCredit}" placeholder="e.g., © 2021 The Pew Charitable Trusts" name="chart-credit" type="text"></label>
    <input type="submit">

</form>