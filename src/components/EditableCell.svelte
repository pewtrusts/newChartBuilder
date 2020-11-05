<script context="module">
    import  { CellBeingEdited } from '@Project/store.js';
    import  { get } from 'svelte/store';
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
    CellBeingEdited.subscribe(v => {
        cellBeingEdited = v;
    });
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
    }
    .isEditable {
        background-color: magenta;
    }
</style>
{#if type == 'th' }
<th bind:this="{cell}" use:setGetterSetter on:click|stopPropagation="{()=>{}}" on:click="{clickHandler}" data-row="{row}" data-column="{column}" class="{klass}"  scope="{scope}">{value}
    {#if cell == cellBeingEdited}
    <button class="edit">Edit</button>
    {/if}
</th>
{:else}
<td bind:this="{cell}" use:setGetterSetter on:click|stopPropagation="{()=>{}}" on:click="{clickHandler}" data-row="{row}" data-column="{column}" class="{klass}" >{value}
    {#if cell == cellBeingEdited}
    <button class="edit">Edit</button>
    {/if}
</td>
{/if}
