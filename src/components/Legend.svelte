<script>
    import { s } from './../store';
    let enabled;
    let reversed;
    let alignment;
    let layout;
    let verticalAlign;
    function enableChangeHandler(){
        s.LegendEnabled.set(this.checked);
    }
    function reverseChangeHandler(){
        s.LegendReversed.set(this.checked);
    }
    function selectHandler(){
        s[this.name].set(this.value);
    }
    s.LegendEnabled.subscribe(v => {
        enabled = v;
    });
    s.LegendReversed.subscribe(v => {
        reversed = v;
    });
    s.LegendAlign.subscribe(v => {
        alignment = v;
    });
    s.LegendLayout.subscribe(v => {
        layout = v;
    });
    s.LegendVerticalAlign.subscribe(v => {
        verticalAlign = v;
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
        data-isChecked="{enabled}"
        > Enabled
</label>
<label>
    <input 
        on:change="{reverseChangeHandler}"
        type="checkbox" 
        checked="{reversed}"
        > Reversed
</label>
<label>Align:
    <!-- svelte-ignore a11y-no-onchange -->
    <select bind:value="{alignment}" on:change="{selectHandler}" name="LegendAlign">
        <option value="center">Center</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
    </select>
</label>
<label>Layout:
    <!-- svelte-ignore a11y-no-onchange -->
    <select bind:value="{layout}" on:change="{selectHandler}" name="LegendLayout">
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
    </select>
</label>
<label>Vertical align:
    <!-- svelte-ignore a11y-no-onchange -->
    <select bind:value="{verticalAlign}" on:change="{selectHandler}" name="LegendVerticalAlign">
        <option value="top">Top</option>
        <option value="middle">Middle</option>
        <option value="bottom">Bottom</option>
    </select>
</label>
