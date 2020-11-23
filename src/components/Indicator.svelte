<script>
    export let Chart;
    $:value = (function(){
        return Chart.series[0].type;
    })()
</script>
{value}