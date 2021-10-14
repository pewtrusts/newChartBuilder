<script context="module">
    const frag = document.createElement('div');
</script>
<script>
    export let chart;
    export let i;
    let griffinConfig = JSON.parse(chart.config).griffinConfig;
    function decode(str){
        frag.innerHTML = str;
        str = frag.textContent;
        frag.textContent = '';
        return str;
    }
</script>
<style>
    header * {
        margin: 0;
        font-size: 1rem;
        line-height: inherit;
    }
</style>
<aside>
    <header>
        {#if i == 0}
        <h1>{griffinConfig.ChartLabel}</h1>
        <p>{@html decode(chart.hed)}</p>
        {/if}
        <p>{@html decode(griffinConfig.ChartSubtitle)}</p>
    </header>
    <img src="{chart.thumbnail}" alt="" />

</aside>

