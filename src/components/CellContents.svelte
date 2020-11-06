<script context="module">
    import ParseDynamic from './../scripts/parse-dynamic.js';
</script>
<script>
    export let cell;
    export let cellBeingEdited;
    export let value;
    export let editCell;
    export let showForm;
    export let changeHandler;
    let valueString = value;
    $:_ = (function(){
        const parsed = ParseDynamic(valueString);
        value = parsed;
        return parsed;
    })();
    function mountForm(node){
        node.focus();
    }   
</script>
<style>
    .edit-button {
        position: absolute;
        bottom: 100%;
        right: 0;
    }
    .edit-input {
        width: 100px;
        position: absolute;
        left: 0;
    }
</style>
{#if cell == cellBeingEdited}
    <button on:click="{editCell}" class="edit-button">Edit</button>
    {#if showForm }
    <input use:mountForm on:change="{changeHandler}" class="edit-input" type="text" bind:value="{valueString}">
    {/if}
{/if}
