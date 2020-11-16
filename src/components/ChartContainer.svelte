<script>
    import PreviewChart from '@Component/PreviewChart.svelte';
    export let Chart;
</script>
<style>
    .chart-container {
        flex-grow: 1;
        padding: 1rem;
        background-color: var(--background-shade, lightgray);
        display: flex;
        justify-content: center;
        height: calc(100vh - var(--banner-height, 75px));
        overflow-y: auto;
        
    }
</style>
<div class="chart-container">
    <div>
        <PreviewChart bind:Chart />
    </div>
</div>