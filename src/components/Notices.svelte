<script context="module">
    import DefinitionItem from './DefinitionItem.svelte';
    
</script>
<script>
    export let notices;
    export let position;
    
</script>
<style>
/*    .container {
        margin-top: -1em;
        margin-bottom: -1em;
    }*/
    dl {
        display: flex;
        justify-content: flex-end;
        margin: 0;
        padding: 0;
        min-height: 21px;
    }
    dl.left {
        justify-content: start;
    }
   
</style>
<div class="container">
    <p class="visually-hidden">Notices</p>
    <dl class:left="{position == 'left'}">
        {#each [...notices] as notice}
        <DefinitionItem {notice} />
        {/each}
    </dl>
</div>