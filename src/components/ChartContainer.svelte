<script>
    import PreviewChart from '@Component/PreviewChart.svelte';
    export let Chart;
</script>
<style>
    .chart-container {
        flex-grow: 1;
    }
</style>
<div class="chart-container">
    <PreviewChart bind:Chart />
</div>