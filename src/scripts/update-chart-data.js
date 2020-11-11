import { XAxesTypes  } from '../store';
import toDate from './coerce-to-date';
// return a HC series config object based on the data
export default function _updateChartData(data, Chart) {
    // map of x-axis values as coerced to dates.
    const asDateTime = data.slice(1).map(row => {
        return typeof row[0] == 'string' ? toDate(row[0]) : 'invalid';
    });
    const shouldBeDateTime = asDateTime.every(value => typeof value == 'object');
    const series = data[0].slice(1).map((valueColumn, i) => {
        return {
            name: valueColumn,
            data: data.slice(1).map((row, j) => {
                return {
                    x: shouldBeDateTime ? asDateTime[j] : row[0],
                    y: row[i + 1]
                };
            })
        }
    });
    if (shouldBeDateTime) XAxesTypes.set('datetime');
    Chart.update({ series: series }, true, true); // p2: redraw; p3: one-to-one in order to add/remove series
}