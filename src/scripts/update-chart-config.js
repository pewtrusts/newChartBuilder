import { ColorByPoint, UserOptions } from './../store';
export default function updateChartConfig(Chart, config) {
    Chart.update(config, true, true);
    UserOptions.set(Chart.userOptions);
    ColorByPoint.set(Chart.series.map(s => s.options.colorByPoint));
}