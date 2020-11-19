<script>
    import alphabetize from 'alphabetize-object-keys';
    import {UserOptions} from './../store';
    let userOptions;
    UserOptions.subscribe(v => {
        userOptions = alphabetize(v);
    });
</script>
<style>
    textarea {
        width: 100%;
        font-family: var(--mono, monospace);
        height: calc(100% - 40px);
    }
</style>
<textarea value="{JSON.stringify(userOptions, null, 2)}"></textarea>