import { ColorByPoint, PictureIsMissingOrOld, UserOptions } from './../store';
export default function updateChartConfig(Chart, config) {
    window.Charts.forEach(chart => {
        chart.update(config, true, true);
    });
    UserOptions.set(Chart.userOptions);
    ColorByPoint.set(Chart.series.map(s => s.options.colorByPoint));
    PictureIsMissingOrOld.set(true);
}