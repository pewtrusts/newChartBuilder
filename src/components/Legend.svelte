<script>
    import { s } from './../store';
    let enabled;
    let reversed;
    function enableChangeHandler(){
        s.LegendEnabled.set(this.checked);
    }
    function reverseChangeHandler(){
        s.LegendReversed.set(this.checked);
    }
    s.LegendEnabled.subscribe(v => {
        enabled = v;
    });
    s.LegendReversed.subscribe(v => {
        reversed = v;
    });
    
</script>
<style>
   
</style>
<h3>Legend</h3>
<label>
    <input 
        on:change="{enableChangeHandler}"
        type="checkbox" 
        checked="{enabled}"
        > Enabled
</label>
<label>
    <input 
        on:change="{reverseChangeHandler}"
        type="checkbox" 
        checked="{reversed}"
        > Reversed
</label>
