<script context="module">
    let count = -1;
</script>
<script>
    import Dropdown from './Dropdown.svelte';
    import { s } from './../store'; 
   export let chartTypes;
    let options = chartTypes.sort();
    let label = 'Chart type:';
    let selected;
    count++;
    s.ChartType.subscribe(v => {
        selected = v;
    });
    function changeHandler(e){
        s.ChartType.set(e.target.value);
    }
</script>
<style></style>
<Dropdown {changeHandler} {options} {selected} {label} {count} />