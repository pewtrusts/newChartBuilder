import { s } from './../store';
//import { clean } from './../components/PreviewChart.svelte';
export default function updateChartConfig(Chart, config) {
    window.Charts.forEach(chart => {
        chart.update(config, true, true);
    });
    //UserOptions.set(clean(Chart.userOptions));
  //  ColorByPoint.set(Chart.series.map(s => s.options.colorByPoint));
    s.PictureIsMissingOrOld.set(true);
}