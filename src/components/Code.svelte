<script>
    import alphabetize from 'alphabetize-object-keys';
    export let Chart;
    $: stringified = Chart ? JSON.stringify(alphabetize(Chart.userOptions), null, 2) : '';
</script>
<style>
    textarea {
        width: 100%;
        font-family: var(--mono, monospace);
        height: calc(100% - 40px);
    }
</style>
<textarea bind:value="{stringified}"></textarea>