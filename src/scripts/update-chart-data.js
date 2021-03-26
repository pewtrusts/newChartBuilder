//import { DatatableData, XAxisType, NumberFormat } from '../store';
import { s } from '../store'; 
//import { extendObj } from './../griffin/griffin';
import returnPointFormatter from './../griffin/scripts/return-point-formatter';
import toDate from './coerce-to-date';
/*
 * TO DO: All of the infered axis types (linear, datetime, categorical) etc need to be
 * able to be overridden by user choice. ie for evenly spaces dates it might be better to
 * treat as categories rather than as dates. or for months or quarters especially
 */
let numberFormat;
s.NumberFormat.subscribe(v => {
    numberFormat = v;
});
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
export default function _updateChartData(data, Chart, datatableData = null, chartType) { // pass in third arg when the chart uses fewer series than what's in the
                                                                       // datatable, e.g., pie charts 
    // map of x-axis values as coerced to dates.
    // info: intervals was used to set specific tick points until i found the more immediate
    // and simpler issue was the startOfWeek setting. keeping here as comments for later
    const storesToSet = [];
    if ( datatableData ){
        s.DatatableData.set(datatableData);
    } else {
        s.DatatableData.set(data);
    }
    var intervals;
    const asDateTime = data.slice(1).map(row => {
        return typeof row[0] == 'string' ? toDate(row[0]) : 'invalid';
    });
    const shouldBeDateTime = asDateTime.every(value => typeof value == 'object');
    const shouldBeCategorical = !shouldBeDateTime && data.slice(1).every(row => typeof row[0] == 'string');
    if (shouldBeDateTime) {
       // s.XAxisType.set('datetime');
        intervals = asDateTime.reduce(function (acc, cur, i, array) {
            if (i === 0) {
                return acc;
            }
            acc.add(cur - array[i - 1]);
            return acc;
        }, new Set());
        
    }
    const series = data[0].slice(1).map((valueColumn, i) => {
        var rtn;
        if (shouldBeCategorical) {
            rtn = {
                name: valueColumn || '',
                data: data.slice(1).map(row => {
                    if (chartType == 'pie'){
                        return {
                            name: row[0],
                            y: row[i + 1]
                        };
                    }
                    return {
                        y: row[i + 1]
                    };
                })
            };
        } else {
            rtn = {
                name: valueColumn || '',
                data: data.slice(1).map((row, j) => {
                    return {
                        x: shouldBeDateTime ? asDateTime[j].getTime() : row[0],
                        y: row[i + 1]
                    };
                })
            }
        }
        /**
         * TO DO. find a better way to do this. should be pulling from defaults based on chart type
         */
        rtn.marker = {
            radius: 4,
            symbol: 'circle'
        };
        rtn.states = {
            hover: {
                enabled: false,
                    halo: {
                    size: 0
                },
            }
        };
        return rtn;
    });
    if (shouldBeDateTime) {
        storesToSet.push(['XAxisType', 'datetime'],['XAxisCategories',null]);
       // s.XAxisType.set('datetime');
       // s.XAxisCategories.set(null);
        // to do this may not work if xAxis userOptions have already been passed to Chart
       // newConfig.xAxis = { type: 'datetime', categories: null };
    } else if (shouldBeCategorical) {
       // newConfig.xAxis = { type: 'category', categories: data.slice(1).map(row => row[0]) };
        storesToSet.push(['XAxisType', 'categorical'], ['XAxisCategories', data.slice(1).map(row => row[0])]);
        // s.XAxisType.set('category');
        // s.XAxisCategories.set(data.slice(1).map(row => row[0]));
    }
    else {
      //  s.XAxisType.set('linear');
      //  s.XAxisCategories.set(null);
        
        storesToSet.push(['XAxisType', 'linear'], ['XAxisCategories', null]);
       // newConfig.xAxis = { type: 'linear', categories: null }; // TO DO : handle other data types ie categorical. will later be able to be set sepaarately, too
        // so you will not want to override explicitly set options
    }
    if (intervals && intervals.size == 1) {
        if ([...intervals][0] === timeUnits.week) {
            let dayIndex = +Chart.time.dateFormat('%w', asDateTime[0]);
            //newConfig.xAxis.startOfWeek = dayIndex;
            //s.StartOfWeek.set(dayIndex);
            storesToSet.push(['StartOfWeek',dayIndex])
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
    //  extendObj(newConfig, ['legend','enabled'], series.length > 1);
      //extendObj(newConfig, ['tooltip', 'pointFormatter'], returnPointFormatter({numberFormat: numberFormat, seriesLength: series.length}));
    // depending on range and specificity of time values. also may have to adjust time: useUTC see=tting
    storesToSet.push(
        ['XAxisTitle', data[0][0] || ''],
        ['LegendEnabled', series.length > 1],
        ['TooltipFormatter', returnPointFormatter({ numberFormat: numberFormat, seriesLength: series.length })],
        ['ChartSeries', series]
    );
   /* s.XAxisTitle.set(data[0][0] || '');
    s.LegendEnabled.set(series.length > 1);
    s.TooltipFormatter.set(returnPointFormatter({ numberFormat: numberFormat, seriesLength: series.length }))
    s.ChartSeries.set(series);*/
    storesToSet.forEach(d => {
        s[d[0]].set(d[1]);
    })
} 