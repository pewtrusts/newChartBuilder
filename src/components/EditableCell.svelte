<script context="module">
    import  { s } from '@Project/store.js';
    import { createEventDispatcher } from 'svelte';
    import CellContents from './CellContents.svelte';
    import Move from './../scripts/move-focus';
    import Sprite from './Sprite.svelte';
    import ParseDynamic from './../scripts/parse-dynamic.js';
    //let previousValue = undefined;
    let _cellBeingEdited;
    s.CellBeingEdited.subscribe(v => {
        _cellBeingEdited = v;
    });
    
    
</script>
<script>
    export let type;
    export let scope;
    export let klass;
    export let value;
    export let row;
    export let column;
    export let isDateTime;
    let cell;
    let cellBeingEdited = null;
    let showForm = false;
    const dispatch = createEventDispatcher();
    s.CellBeingEdited.subscribe(v => {
        cellBeingEdited = v;
    });
    function keyupHandler(e){
        if (e.keyCode == 9 ){// tab 
            this.isEditable = false;
        }
        if ( e.keyCode == 13 ){ //enter
            clickHandler.call(this);
        }
        if ( e.keyCode == 37 ){
            Move.left.call(this);
        }
        if ( e.keyCode == 38 ){
            e.preventDefault();
            Move.up.call(this);
        }
        if ( e.keyCode == 39 ){
            Move.right.call(this);
        }
        if ( e.keyCode == 40 ){
            e.preventDefault();
            Move.down.call(this);
        }
    }
    function changeHandler(){
        showForm = false;
        value = ParseDynamic(this.value);
        dispatch('dataChange', {row, column, value});
    }
    function bodyClickHandler(){
        if ( _cellBeingEdited ){
            _cellBeingEdited.isEditable = false;
            showForm = false;
        }
    }
    function clickHandler(){
        
        if ( cellBeingEdited == this ) return; // do nothing if focusing into cell already being edited
        if ( cellBeingEdited ){
            cellBeingEdited.isEditable = false;
        }
        this.isEditable = true;
    }
    function setGetterSetter(node){
        cell = node;
        Object.defineProperty(node, 'isEditable', {
            get: function(){return this._isEditable;},
            set: function(bool){
                if ( bool ){
                    s.CellBeingEdited.set(this);
                    document.body.addEventListener('click', bodyClickHandler);
                } else {
                    s.CellBeingEdited.set(null);
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
        color: sienna;
        font-size: 0.75rem;
    }
    .number {
        font-family: var(--mono, monospace);
        text-align: right;
        color: blue;
    }
    .null {
        text-align: center;
        color: lightgray
    }
    .boolean {
        font-family: var(--mono, monospace);;
        text-align: center;
        color: purple;
    }
    .date {
        color: midnightblue;
    }
    .head {
        color: #333;
    }
    .head--number-column {
        text-align: right;
    }
    .head--string-column {
        text-align: left;
    }
    td,th {
        width: 110px;
        min-width: 110px;
        max-width: 110px;
        height: 40px;
        border-bottom: 1px solid lightgray;
        border-right: 1px solid lightgray;
        padding-right: 25px;
        padding-left: 8px;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
</style>
{#if type == 'th' }
<th tabindex="0" bind:this="{cell}" use:setGetterSetter on:click|stopPropagation="{clickHandler}" on:keyup="{keyupHandler}" data-row="{row}" data-column="{column}" class="{klass}" scope="{scope}">{value === null ? '' : value}
    <CellContents bind:value {cell} {cellBeingEdited} {showForm} {changeHandler} />
    {#if isDateTime}
    <Sprite width="15" id="calendar" style="position: absolute; right: 5; fill: lightgray;" />
    {/if}
</th>
{:else}
<td tabindex="0" bind:this="{cell}" use:setGetterSetter on:click|stopPropagation="{clickHandler}" on:keyup="{keyupHandler}" data-row="{row}" data-column="{column}" class="{klass}">{value}
    <CellContents bind:value {cell} {cellBeingEdited} {showForm} {changeHandler} />
    {#if isDateTime}
    <Sprite width="15" id="calendar" style="position: absolute; right: 5; fill: lightgray;" />
    {/if}
</td>
{/if}
