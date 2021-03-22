import returnNumberFormatter from './return-number-formatter';
export default function _returnPointFormatter({numberFormat, seriesLength}){
    const numberFormatter = returnNumberFormatter(numberFormat, 'tooltip');
    if (seriesLength > 1 ){
        return function(){
            return `${ this.series.name ? this.series.name + ': ' : '' }${ numberFormatter.call(this) }`;
        }
    }
    return function () {
        return `${numberFormatter.call(this)}`;
    }
}