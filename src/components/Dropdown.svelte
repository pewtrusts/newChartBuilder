<script context="module">
    import slugger from 'slugger';
</script>
<script>
    export let changeHandler;
    export let options;
    export let selected;
    export let label;
    export let count = 0;
    let id = `dropdown-${slugger(label)}-${count}`;
    let isGrouped = Array.isArray(options[0]);
</script>
<div>
	
	{#if label}
	<label for="{id}">{label}</label>
	{/if}
	<!-- svelte-ignore a11y-no-onchange -->
	<select id="{id}" on:change="{changeHandler}">
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
</div>
