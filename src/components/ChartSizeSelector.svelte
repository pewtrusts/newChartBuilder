<script>
    import {ChartWidth, ChartHeight, MinHeight} from './../store';
    import updateChartConfig from '../scripts/update-chart-config';
    export let Chart;
    let minHeight;
    function widthHandler(){
        if (this.value == 'custom') {
            customWidth = true;
            return;
        }
        ChartWidth.set(this.value);
    }
    function heightHandler(){
         if (this.value == 'custom') {
            customHeight = true;
            return;
        }
        ChartHeight.set({type: 'percent', value: this.value});
    }
    function minHeightHandler(){
        MinHeight.set(this.value);
    }
    MinHeight.subscribe(v => {
        minHeight = v;
        if (Chart){
            updateChartConfig(Chart, {
                "responsive": {
                    "rules": [
                    {
                        "chartOptions": {
                        "chart": {
                            "height": v
                        }
                        },
                        "condition": {
                        "maxHeight": v
                        }
                    }
                    ]
                }
            });
        }
    });
</script>

<!-- svelte-ignore a11y-no-onchange -->
<label>Chart width: <select on:change="{widthHandler}" name="chart-width">
    <option value="990">990px</option>
    <option selected value="650">650px</option>
    <option value="custom">custom</option>
</select></label>
<!-- svelte-ignore a11y-no-onchange -->
<label>Chart height: <select on:change="{heightHandler}" name="chart-height">
    <option selected value="0.5625">16:9 (56.25% width)</option>
    <option value="custom">custom</option>
</select></label>
<!-- svelte-ignore a11y-no-onchange -->
<label>Minimum chart height: <input type="number" on:change="{minHeightHandler}" increment="1" bind:value="{minHeight}" >
</label>