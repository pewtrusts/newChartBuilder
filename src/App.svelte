<script context="module">
    import DataTable from '@Component/DataTable.svelte';
    import PreviewChart from '@Component/PreviewChart.svelte';
    import DataInput from '@Component/DataInput.svelte';
    import SpriteDefs from './sprite.svelte';
</script>
<script>
    let Chart = '';
    let rawData = '';
</script>
<style></style>
<SpriteDefs />
{#if Chart && !rawData}
<DataInput bind:Chart bind:rawData />
{/if}
{#if Chart && rawData}
<DataTable bind:data="{rawData}" bind:Chart />
{/if}
<PreviewChart {rawData} bind:Chart />
