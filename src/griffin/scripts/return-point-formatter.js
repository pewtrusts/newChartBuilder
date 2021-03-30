import returnNumberFormatter from './return-number-formatter';
export default function _returnPointFormatter(obj){
    var numberFormat = obj.numberFormat;
    var seriesLength = obj.seriesLength;
    var numberFormatter = returnNumberFormatter(numberFormat, 'tooltip');
    if (seriesLength > 1 ){
        return function(){
            return (this.series.name ? this.series.name + ': ' : '') + numberFormatter.call(this);
        }
    }
    return function () {
        return numberFormatter.call(this);
    }
}