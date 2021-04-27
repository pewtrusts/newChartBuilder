<script>
    import {s} from './../store';
    let value;
    function handler(){
        //TO DO: try/catch
        const custom = JSON.parse(value);
        s.CustomSettings.set(custom);
    }
    s.CustomSettings.subscribe(v => {
        value = JSON.stringify(v, null, 2);
    });
</script>
<style>
    textarea {
        display: block;
        width: 100%;
        height: 300px;
    }
</style>
<p>You may set any custom options in JSON format following the <a href="https://api.highcharts.com/highcharts/responsive">Highcharts documentation</a>.
   Options that you set here will override settings you've set elsewhere.</p>
<form on:submit|preventDefault="{handler}">
    <textarea bind:value></textarea>
    <input type="submit" class="button button--primary">
</form>