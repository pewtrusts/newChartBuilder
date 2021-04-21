<script>
    import { s } from './../store';
    let enabled;
    s.DataLabels.subscribe(v => {
        enabled = v;
    });
    let last;
    s.LastLabelOnly.subscribe(v => {
        last = v;
    });
    function changeHandler(){
        s.DataLabels.set(this.checked);
    }
    function lastLabelHandler(){
        s.LastLabelOnly.set(this.checked ? 'last-label-only' : '');
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

