<script context="module">
    let count = -1;
</script>
<script>
    import Dropdown from './Dropdown.svelte';
    import {ChartType} from './../store';
    export let APIData;
    export let preferred;
    export let isLimited;
    let chartTypes = Object.keys(APIData.plotOptions.children);
    let options = isLimited ? preferred.sort() : [preferred.sort(), chartTypes.filter(d => !preferred.includes(d))];
    let label = 'Chart type:';
    let selected;
    count++;
    ChartType.subscribe(v => {
        selected = v;
    });
    function changeHandler(e){
        ChartType.set(e.target.value);
    }
</script>
<style></style>
<Dropdown {changeHandler} {options} {selected} {label} {count} />