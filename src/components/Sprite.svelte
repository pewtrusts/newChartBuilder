<script>
    export let width;
    export let id;
    export let style = null;
    export let brandPrimary = false;
    export let gray = false;
    export let white = false;
</script>
<style>
    svg {
        position: relative;
    }
    .brandPrimary {
        fill: var(--brand-primary, #fff);
    }
    .gray {
        fill: var(--medium-gray, #bbb);
    }
    .white {
        fill: #fff;
    }
</style>
<svg width="{width}" viewbox="0 0 8 8" class:brandPrimary class:gray class:white class="icon" style="{style}" >
    <use xlink:href="#{id}" class="icon-{id}"></use>
</svg>
