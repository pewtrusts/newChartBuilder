<script>
    import { s } from './../store';
    let enabled;
    s.DataLabels.subscribe(v => {
        enabled = v;
    });
    function changeHandler(){
        s.DataLabels.set(this.checked);
    }
</script>
<style>
    label {
        display: block;
    }
</style>
<h3>Data labels</h3>
<label>Enabled: <input on:change="{changeHandler}" type="checkbox" checked="{enabled || null}"></label>

