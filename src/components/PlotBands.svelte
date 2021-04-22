<script>
    import { s } from './../store';
    import Button from './Button.svelte';
    let count = 1;
    $:array = new Array(count);
    function submit(){
        const plotBands = [];
        const data =  new FormData(this);
         for (let [name,value] of data ){
            let index = parseInt(name);
            let property = name.split('-')[1];
            plotBands[index] = plotBands[index] || {};
            plotBands[index][property] = property == 'label' ? {text: value} : isNaN(+value) ? value : +value;
        }
        console.log(plotBands);
        s.PlotBands.set(plotBands);
    }
</script>
<style>
    label {
        display: inline-block;
    }
</style>
<h4>Plot bands</h4>
<form on:submit|preventDefault={submit}>
    {#each array as _,i}
    <fieldset>
        <legend>Plot band {i + 1}</legend>
        <label>From: <input name="{i}-from" type="text"></label> <label>To: <input name="{i}-to" type="text"></label>
        <label>Label: <input name="{i}-label" type="text"></label>
        {#if i == array.length - 1}
        <Button title="Remove" type="secondary" clickHandler="{() => count--}" />
        {/if}
    </fieldset>
    {/each}
    <input class="button button--primary" type="submit">
    <Button title="Add another" type="secondary" clickHandler="{() => count++}" />
</form>
