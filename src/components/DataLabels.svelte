<script>
    import { s } from './../store';
    let enabled;
    let decimals;
    s.DataLabels.subscribe(v => {
        enabled = v;
    });
    let last;
    s.LastLabelOnly.subscribe(v => {
        last = v;
    });
    s.LabelDecimals.subscribe(v => {
        decimals = v;
    })
    function changeHandler(){
        s.DataLabels.set(this.checked);
    }
    function lastLabelHandler(){
        s.LastLabelOnly.set(this.checked ? 'last-label-only' : '');
    }
    function decimalHandler(){
        s.LabelDecimals.set(isNaN(+this.value) ? undefined : +this.value);
    }
</script>
<style>
    label {
        display: block;
    }
</style>
<h3>Data labels</h3>
<label>Enabled: <input on:change="{changeHandler}" type="checkbox" checked="{enabled || null}"></label>
<label>Last label only: <input on:change="{lastLabelHandler}" type="checkbox" checked="{last == 'last-label-only' || null}"></label>
<label>Decimals (for tooltips too): <input on:change="{decimalHandler}" type="number" bind:value="{decimals}"></label>

