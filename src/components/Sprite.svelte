<script>
    export let width;
    export let id;
    export let style = null;
    export let brandPrimary = false;
    export let gray = false;
</script>
<style>
    .brandPrimary {
        fill: var(--brand-primary, #fff);
    }
    .gray {
        fill: var(--background-medium, #ddd);
    }
</style>
<svg width="{width}" viewbox="0 0 8 8" class:brandPrimary class:gray class="icon" style="{style}" >
    <use xlink:href="#{id}" class="icon-{id}"></use>
</svg>
