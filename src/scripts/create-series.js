import { SeriesData } from '../store';
export default function _createSeriesData(data) {
    // return a HC series config object based on the data
    const seriesData = data[0].slice(1).map((valueColumn, i) => {
        return data.slice(1).map((row,j) => {
            return j == 0 ? {
                x: row[0],
                y: row[i + 1],
                seriesName: data[0][i + 1]
            } : {
                x: row[0],
                y: row[i + 1],
            }
        });
    });
    SeriesData.set(seriesData);
}