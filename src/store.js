import baseChart from '@Project/base-chart-config.json';
import { writable } from 'svelte/store';

const ChartConfig = writable(baseChart);

export {
    ChartConfig
};