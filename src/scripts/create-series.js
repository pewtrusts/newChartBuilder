import { get } from 'svelte/store';
import { ChartConfig } from '../store';
export default function _createSeriesData(data) {
    // return a HC series config object based on the data
    const config = get(ChartConfig);
    data[0].slice(1).forEach((valueColumn, i) => {
        const serie = config.series[i] || {};
        serie.data = data.slice(1).map(row => {
            return {
                x: row[0],
                y: row[i + 1],
            };
        });
        config.series[i] = serie;
    });
    ChartConfig.set(config);
}