import { XAxisType } from '../store';
import toDate from './coerce-to-date';
/*
 * TO DO: All of the infered axis types (linear, datetime, categorical) etc need to be
 * able to be overridden by user choice. ie for evenly spaces dates it might be better to
 * treat as categories rather than as dates. or for months or quarters especially
 */
 
const timeUnits =
{
    millisecond: 1,
    second:      1000,
    minute:      60000,
    hour:        3600000,
    day:         86400000,
    week:        604800000,
    month:       2419200000,
    year:        31449600000,
};
// return a HC series config object based on the data
export default function _updateChartData(data, Chart) {
    // map of x-axis values as coerced to dates.
    // info: intervals was used to set specific tick points until i found the more immediate
    // and simpler issue was the startOfWeek setting. keeping here as comments for later
    var intervals;
    const asDateTime = data.slice(1).map(row => {
        return typeof row[0] == 'string' ? toDate(row[0]) : 'invalid';
    });
    const shouldBeDateTime = asDateTime.every(value => typeof value == 'object');
    const shouldBeCategorical = !shouldBeDateTime && data.slice(1).every(row => typeof row[0] == 'string');
    if (shouldBeDateTime) {
        XAxisType.set('datetime');
        intervals = asDateTime.reduce(function (acc, cur, i, array) {
            if (i === 0) {
                return acc;
            }
            acc.add(cur - array[i - 1]);
            return acc;
        }, new Set());
        console.log(intervals);
    } else if (shouldBeCategorical) {
        XAxisType.set('categorical');
    } else {
        XAxisType.set('linear');
    }
    const series = data[0].slice(1).map((valueColumn, i) => {
        if (shouldBeCategorical) {
            return {
                name: valueColumn,
                data: data.slice(1).map(row => {
                    return {
                        y: row[i + 1]
                    };
                })
            };
        }
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
    } else if (shouldBeCategorical) {
        newConfig.xAxis = { type: 'category', categories: data.slice(1).map(row => row[0]) };
    }
    else {
        newConfig.xAxis = { type: 'linear' }; // TO DO : handle other data types ie categorical. will later be able to be set sepaarately, too
        // so you will not want to override explicitly set options
    }
    if (intervals && intervals.size == 1) {
        if ([...intervals][0] === timeUnits.week) {
            let dayIndex = +Chart.time.dateFormat('%w', asDateTime[0]);
            newConfig.xAxis.startOfWeek = dayIndex;
            console.log({ dayIndex, newConfig });
        }
    }
    /* 
     COMMENTING THIS OUT. startOfWeek SETTING WAS THE MORE IMMEDIATE ISSUE. SAVING FOR PSSIBLE ALETR USE
    if (intervals && intervals.size == 1) {
         let positions = series[0].data.map(d => d.x);
         newConfig.xAxis.tickPositions = positions;
         newConfig.xAxis.labels = {
             formatter: function () {
                 this.dateTimeLabelFormat = '%b %e'; // TO DO: gonna need logic to select the right datetimeFormat
                 return Chart.xAxis[0].defaultLabelFormatter.call(this);
             }
         };
         //newConfig.xAxis.labels = { formatter: () => 'foo bar' };
     }*/
    //TODO: if datetime will have to adjust dateTimeLabelFormats for x-axis and tooltip, and tooltip.xDateFormat
    // depending on range and specificity of time values. also may have to adjust time: useUTC see=tting
    console.log({ Chart });
    Chart.update(newConfig, true, true); // p2: redraw; p3: one-to-one in order to add/remove series
} 