<script>
    import { s } from './../store';
    let enabled;
    function changeHandler(){
        s.LegendEnabled.set(this.checked);
    }
    s.LegendEnabled.subscribe(v => {
        enabled = v;
    });
    
</script>
<style>
    label {
        display: block;
    }
</style>
<h3>Legend</h3>
<label>
    <input 
        on:change="{changeHandler}"
        type="checkbox" 
        checked="{enabled}"
        > Enabled
</label>
