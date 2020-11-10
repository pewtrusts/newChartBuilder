import { SeriesData, XAxesTypes  } from '../store';
import toDate from './coerce-to-date';
// return a HC series config object based on the data
export default function _createSeriesData(data) {
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
    SeriesData.set({series}); // eg { series: [{},{},{}] }
}