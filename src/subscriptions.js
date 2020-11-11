
import { XAxesTypes } from './store.js';
export function initSubscriptions(chart) {
    XAxesTypes.subscribe(v => {
        if (!chart) return;
        var config;
        if (Array.isArray(v)) {
            if (v.length !== chart.xAxis.length) {
                console.log('Axis type setting does not match number of x axes in the chart');
                return;
            }
            config = {
                xAxis: v.map(type => { 
                    return { type };
                })
            };
        } else if (typeof v == 'string') {
            config = {
                xAxis: chart.xAxis.map(() => {
                    return {
                        type: v
                    };
                })
            };
        }
        chart.update(config);
    });
}