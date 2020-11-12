<script context="module">
    import ParseDynamic from './../scripts/parse-dynamic.js';
    import Sprite from './Sprite.svelte';
</script>
<script>
    export let cell;
    export let cellBeingEdited;
    export let value;
    export let showForm;
    export let changeHandler;
    let valueString = value;
    $:_ = (function(){
        const parsed = ParseDynamic(valueString);
        value = parsed;
        return parsed;
    })();
    
    function mountButton(node){
        node.focus();
    }
    function mountForm(node){
        node.focus();
    }   
    function keydownHandler(e){
        if ([9,27].includes(e.keyCode)){ // tab, esc
            showForm = false;
        }
    }
    function editCell(){
        showForm = true;
    }
    function _changeHandler(){
        showForm = false;
        changeHandler.call(this);
    }
</script>
<style>
    .edit-button {
        appearance: none;
        background: none;
        border-width: 0;
        position: absolute;
        top: 0;
        right: 0;
    }
    .edit-input {
        width: 100px;
        position: absolute;
        left: 0;
    }
</style>
{#if cell == cellBeingEdited}
    {#if !showForm }
    <button use:mountButton title="Edit the value" on:click="{editCell}" class="edit-button"><Sprite id="pencil" width="10" /><span class="visually-hidden">Edit</span></button>
    {/if}
    {#if showForm }
    <input use:mountForm on:change="{_changeHandler}" on:keydown|stopPropagation="{keydownHandler}" on:keyup|stopPropagation="{() => {}}" class="edit-input" type="text" bind:value="{valueString}">
    {/if}
{/if}
