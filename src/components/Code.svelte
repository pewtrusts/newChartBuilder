<script>
    import { CodeExport, PictureIsMissingOrOld } from './../store';
    import Notices from './Notices.svelte';
    let codeExport;
    let notices = new Set();
    export let pictureIsMissingOrOldNotice;
    CodeExport.subscribe(v => {
        codeExport = v;
    });
    PictureIsMissingOrOld.subscribe(v => {
        notices[v ? 'add' : 'delete'](pictureIsMissingOrOldNotice);
        notices = notices;
    });
</script>
<style>
    textarea {
        width: 100%;
        font-family: var(--mono, monospace);
        height: calc(100% - 40px);
    }
</style>
<!-- to do: remove spacing to minimize output -->
<!--<textarea value="{JSON.stringify(codeExport, null, 2)}"></textarea>-->
<Notices {notices} />
<textarea value="{codeExport}"></textarea>