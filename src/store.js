import baseChart from '@Project/base-chart-config.json';
import options from '@Project/options.json';
import { writable, readable, derived, get } from 'svelte/store';
import defaultsDeep from 'lodash.defaultsdeep';

const _ = { defaultsDeep };

const CellBeingEdited = writable(null);
const BaseConfig = readable(baseChart);
const SeriesData = writable({});
const XAxesTypes = writable('linear');
const XAxisConfig = derived([XAxesTypes], ([xAxesTypes]) => {
    const currentConfig = get(ChartConfig);
    if (currentConfig) {
        return {
            xAxis: currentConfig.xAxis.map((__, i) => {
                return {
                    type: typeof xAxesTypes == 'string' ? xAxesTypes : xAxesTypes[i],
                    dateTimeLabelFormats: options.dateTimeLabelFormats
                };
            })
        };
    } else {
        return { xAxis: [{}] };
    }
});
const ChartConfig = derived([BaseConfig, SeriesData, XAxisConfig], ([baseConfig, seriesData, xAxisConfig]) => {
    // defaulstDeep applies left to right; once a property is set additional values are ignored. left overrides right.
    const chartConfig = _.defaultsDeep({},seriesData, xAxisConfig, baseConfig)
    return chartConfig;
});

export {
    CellBeingEdited, ChartConfig, SeriesData, XAxesTypes
};