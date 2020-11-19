<script context="module">
    let count = -1;
</script>
<script>
    import Dropdown from './Dropdown.svelte';
    import {ChartType} from './../store'; 
   export let chartTypes;
    let options = chartTypes.sort();
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