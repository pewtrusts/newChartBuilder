<script>
    export let cell;
    export let cellBeingEdited;
    export let value;
    export let editCell;
    export let showForm;
    export let changeHandler;
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
    <input on:change="{changeHandler}" class="edit-input" type="text" bind:value="{value}">
    {/if}
{/if}
