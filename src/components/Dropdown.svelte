<script>
    export let changeHandler;
    export let options;
    export let selected;
    export let label;
    function use(node){
        console.log(node);
    } 
    let isGrouped = Array.isArray(options[0]);
</script>
{#if label}
<label for="">{label}</label>
{/if}
<!-- svelte-ignore a11y-no-onchange -->
<select use:use on:change="{changeHandler}">
    {#if isGrouped}
    {#each options as group}
        <optgroup>
            {#each group as option}
            <option selected="{option == selected ? true : null}" value="{option}">{option}</option>
            {/each}
        </optgroup>
    {/each}
    {:else}
    {#each options as option}
    <option selected="{option == selected ? true : null}" value="{option}">{option}</option>
    {/each}
    {/if}
</select>
