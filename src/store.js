import baseChart from '@Project/base-chart-config.json';
import { writable, readable, derived } from 'svelte/store';

const CellBeingEdited = writable(null);
const BaseConfig = readable(baseChart);
const SeriesData = writable([]);
const ChartConfig = derived([BaseConfig, SeriesData], ([baseConfig, seriesData]) => {
    console.log(baseConfig, seriesData);
    seriesData.forEach((series, i) => {
        const seriesObj = baseConfig.series[i] || {};
        seriesObj.name = series[0].seriesName;
        seriesObj.data = series;
        baseConfig.series[i] = seriesObj;
    });
    return baseConfig;
});

export {
    CellBeingEdited, ChartConfig, SeriesData
};