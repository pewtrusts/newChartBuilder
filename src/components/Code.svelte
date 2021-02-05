<script>
    import {CodeExport} from './../store';
    let codeExport;
    CodeExport.subscribe(v => {
        codeExport = v;
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
<textarea value="{codeExport}"></textarea>