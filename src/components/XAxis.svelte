<script>
    import { s } from './../store';
    let y;
   
    function xAxisSubmit(){
        const data =  new FormData(this);
        for (let [name,value] of data) {
            s[name].set( (Number(value) !== NaN ? Number(value) : value) || undefined)
        }
    }
    s.XAxisLabelsY.subscribe(v => {
        y = v;
    })
    
</script>
<style>
    label {
        display: block;
    }
</style>
<h3>X Axis</h3>
<form on:submit|preventDefault={xAxisSubmit}>
    <label>Label Y position: <input bind:value="{y}" type="number" name="XAxisLabelsY"></label>
    <input class="button button--primary" type="submit">
</form>
