<script context="module">
    import DataTable from '@Component/DataTable.svelte';
    import PreviewChart from '@Component/PreviewChart.svelte';
    import DataInput from '@Component/DataInput.svelte';
    import SpriteDefs from './sprite.svelte';
    let dataResolve;
    let dataPromise = new Promise(function(resolve){
        dataResolve = resolve;
    });
</script>
<script></script>
<style></style>
<SpriteDefs />
<h1>App</h1>
<DataInput {dataResolve} />
{#await dataPromise then data}
<PreviewChart />
<DataTable {data} />
{/await}