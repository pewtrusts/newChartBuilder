<script context="module">
    import Sprite from "./Sprite.svelte";
</script>
<script>
    export let clickHandler = function(){};
    export let iconID = null;
    export let title;
    export let iconStyle = null;
    export let type = null;
    export let style = null;
    export let showIconAndText = false;
    export let value = null;
    
</script>
<style>
    .button-component {
        appearance: none;
        border: none;
        background: none;
        margin: 0;
        padding: 0.25rem 0.5rem;
        border: 1px solid #fff;
    }
    .primary {
        color: #fff;
        background-color: var(--brand-primary, #000);
    }
    .secondary {
        background-color: #fff;
        color: var(--brand-primary, #000);
        border: 1px solid var(--brand-primary, #000);

    }
</style>
<button {value} class="button-component" class:secondary="{type == 'secondary'}" class:primary="{type == 'primary'}" role="button" on:click="{clickHandler}" title="{title}" style="{style}" >
    {#if iconID}
    <Sprite width="15" id="{iconID}" style="{iconStyle}" />
    {/if}
    <span class:visually-hidden="{!!iconID && !showIconAndText}">{title}</span>
</button>