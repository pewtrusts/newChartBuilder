<script context="module">
    import Sprite from "./Sprite.svelte";
</script>
<script>
    export let clickHandler
    export let iconID;
    export let title;
    export let iconStyle;
    export let type;
    export let style;
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
        background-color: var(--background-medium, lightgray);
    }
</style>
<button class="button-component" class:secondary="{type == 'secondary'}" class:primary="{type == 'primary'}" role="button" on:click="{clickHandler}" title="{title}" style="{style}" >
    <span class:visually-hidden="{!!iconID}">{title}</span>
    {#if iconID}
    <Sprite width="15" id="{iconID}" style="{iconStyle}" />
    {/if}
</button>