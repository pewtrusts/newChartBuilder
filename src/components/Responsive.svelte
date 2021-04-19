<script>
    import {s} from './../store';
    let value;
    s.OtherResponsive.subscribe(v => {
        console.log('otherResponsive');
        value = JSON.stringify(v, null, 2);
        // rules[0] governs min height which is handled by the GUI
    });
    function handler(){
        //TO DO: try/catch
        const rules = JSON.parse(value);
        s.OtherResponsive.set(rules);
    }
    
</script>
<style>
    textarea {
        display: block;
        width: 100%;
        height: 300px;
    }
</style>
<p>You may set responsive options for the chart to take effect at certain screen sizes.  
    See the <a href="https://api.highcharts.com/highcharts/responsive">Highcharts documentation</a>
for more information. Options that you set here may override or be overridden by the <em>mobile chart height</em> setting
found above the preview chart, which sets the height for charts 416px wide or narrower.</p>
<form on:submit|preventDefault="{handler}">
    <textarea bind:value></textarea>
    <input type="submit" class="button button--primary">
</form>