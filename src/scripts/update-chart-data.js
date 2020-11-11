//import { XAxesTypes  } from '../store';
import toDate from './coerce-to-date';
// return a HC series config object based on the data
export default function _updateChartData(data, Chart) {
    // map of x-axis values as coerced to dates.
    var intervals;
    const asDateTime = data.slice(1).map(row => {
        return typeof row[0] == 'string' ? toDate(row[0]) : 'invalid';
    });
    const shouldBeDateTime = asDateTime.every(value => typeof value == 'object');
    if (shouldBeDateTime) {
        intervals = asDateTime.reduce(function (acc, cur, i, array) {
            if (i === 0) {
                return acc;
            }
            acc.add(cur - array[i - 1]);
            return acc;
        }, new Set());
        console.log(intervals);
    }
    const series = data[0].slice(1).map((valueColumn, i) => {
        return {
            name: valueColumn,
            data: data.slice(1).map((row, j) => {
                return {
                    x: shouldBeDateTime ? asDateTime[j].getTime() : row[0],
                    y: row[i + 1]
                };
            })
        }
    });
    const newConfig = { series };
    if (shouldBeDateTime) {
        // to do this may not work if xAxis userOptions have already been passed to Chart
        newConfig.xAxis = { type: 'datetime' };
    } else {
        newConfig.xAxis = { type: 'linear' }; // TO DO : handle other data types ie categorical. will later be able to be set sepaarately, too
        // so you will not want to override explicitly set options
    }
    if (intervals && intervals.size == 1) {
        newConfig.xAxis.tickPositions = series[0].data.map(d => d.x);
        newConfig.xAxis.labels = {
            formatter: function () {
                this.dateTimeLabelFormat = '%b %e'; // TO DO: gonna need logic to select the right datetimeFormat
                return Chart.xAxis[0].defaultLabelFormatter.call(this);
            }
        };
        //newConfig.xAxis.labels = { formatter: () => 'foo bar' };
    }
    //TODO: if datetime will have to adjust dateTimeLabelFormats for x-axis and tooltip, and tooltip.xDateFormat
    // depending on range and specificity of time values. also may have to adjust time: useUTC see=tting
    console.log({Chart});
    Chart.update(newConfig, true, true); // p2: redraw; p3: one-to-one in order to add/remove series
} 