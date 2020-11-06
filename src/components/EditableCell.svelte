<script context="module">
    import  { CellBeingEdited } from '@Project/store.js';
    import { createEventDispatcher } from 'svelte';
    let previousValue = undefined;
    let _cellBeingEdited;
    CellBeingEdited.subscribe(v => {
        _cellBeingEdited = v;
    });
    function bodyClickHandler(){
        if ( _cellBeingEdited ){
            _cellBeingEdited.isEditable = false;
        }
    }
</script>
<script>
    export let type;
    export let scope;
    export let klass;
    export let value;
    export let row;
    export let column;
    let cell;
    let cellBeingEdited = null;
    let showForm = false;
    const dispatch = createEventDispatcher();
    function editCell(){
        showForm = true;
    }
    CellBeingEdited.subscribe(v => {
        cellBeingEdited = v;
    });
    function changeHandler(){
        dispatch('dataChange', {row, column, value});
    }
    function clickHandler(){
        if ( cellBeingEdited == this ) return; // do nothing if focusing into cell already being edited
        if ( cellBeingEdited ){
            cellBeingEdited.isEditable = false;
        }
        this.isEditable = true;
        console.log(cell, this, cellBeingEdited);
    }
    function setGetterSetter(node){
        cell = node;
        Object.defineProperty(node, 'isEditable', {
            get: function(){return this._isEditable;},
            set: function(bool){
                if ( bool ){
                    CellBeingEdited.set(this);
                    document.body.addEventListener('click', bodyClickHandler);
                } else {
                    CellBeingEdited.set(null);
                    document.body.removeEventListener('click', bodyClickHandler);
                }
                this.classList[bool ? 'add' : 'remove']('isEditable');
                this._isEditable = bool;
            }
        });
    }
    // TODO: BELOW USE SLOTS, COMPONENTS WITH CHILDREN, TO BE MORE DRY?
</script>
<style>
    .string {
        text-align: left;
        color: orange;
    }
    .number {
        font-family: monospace;
        text-align: right;
        color: blue;
    }
    .null {
        text-align: center;
        color: lightgray
    }
    .boolean {
        font-family: monospace;
        text-align: center;
        color: darkred;
    }
    .head--number-column {
        text-align: right;
    }
    .head--string-column {
        text-align: left;
    }
    td,th {
        width: 100px;
        min-width: 100px;
        height: 40px;
        border-bottom: 1px solid lightgray;
        border-right: 1px solid lightgray;
        padding-right: 8px;
        padding-left: 8px;
        position: relative;
    }
    .isEditable {
        background-color: magenta;
    }
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
{#if type == 'th' }
<th bind:this="{cell}" use:setGetterSetter on:click|stopPropagation="{()=>{}}" on:click="{clickHandler}" data-row="{row}" data-column="{column}" class="{klass}" scope="{scope}">{value}
    {#if cell == cellBeingEdited}
    <button on:click="{editCell}" class="edit-button">Edit</button>
    {#if showForm }
    <input on:change="{changeHandler}" class="edit-input" type="text" bind:value="{value}">
    {/if}
    {/if}
</th>
{:else}
<td bind:this="{cell}" use:setGetterSetter on:click|stopPropagation="{()=>{}}" on:click="{clickHandler}" data-row="{row}" data-column="{column}" class="{klass}">{value}
    {#if cell == cellBeingEdited}
    <button on:click="{editCell}" class="edit-button">Edit</button>
    {#if showForm }
    <input on:change="{changeHandler}" class="edit-input" type="text" bind:value="{value}">
    {/if}
    {/if}
</td>
{/if}
