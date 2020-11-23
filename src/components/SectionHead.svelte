<script context="module">
    import slugger from 'slugger';
    import Indicator from './Indicator.svelte';
</script>
<script>
    export let text;
    export let indicators = [];
    export let Chart;
</script>
<style>
    .section-anchor {
        position: absolute;
        top: -80px;
    }
    .observer {
        display: block;
        width: 1px;
        height: calc(25vh);
        position: absolute;
        top: calc(25vh - var(--banner-height, 75px));
    }
</style>
<a name="{slugger(text)}" id="{slugger(text)}" class="section-anchor"><span class="visually-hidden">{text}</span></a>
<div class="observer" data-section="{slugger(text)}"></div>
<h2>{text}</h2>
{#if Chart}
{#each indicators as indicatorArr}
<Indicator {Chart} {indicatorArr} />
{/each}
{/if}
