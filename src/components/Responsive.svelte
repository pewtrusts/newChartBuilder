<script>
import {s} from './../store';
    let value;
    let minHeight;
    s.MinHeight.subscribe(v => {
        minHeight = v;
    });
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
for more information. Options that you set here may override or be overridden by the <em>mobile chart height</em>, 
which sets the height for charts 416px wide or narrower. That value is set using the form above the preview chart.
It is represented in JSON format below to serve as an example. The value you set is the height of the entire figure, text included;
the value shown below is for the chart only.</p>
<pre>
    {JSON.stringify({
        chartOptions: {
            chart: {
                height: minHeight
            }
        },
        condition: {
            maxWidth: 416
        }
    }, null, 2)}
</pre>
<form on:submit|preventDefault="{handler}">
    <textarea bind:value></textarea>
    <input type="submit" class="button button--primary">
</form>