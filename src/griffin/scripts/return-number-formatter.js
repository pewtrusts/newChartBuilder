/* global Highcharts  */
function countDecimals(value) { //HT: https://stackoverflow.com/a/27082406
    if (value == null) return 0;
    const text = value.toString()
    // verify if number 0.000005 is represented as "5e-6"
    if (text.indexOf('e-') > -1) {
        let trail = text.split('e-')[1];
        let deg = parseInt(trail, 10);
        return deg;
    }
    // count decimals for number in representation like "0.123456"
    if (Math.floor(value) !== value) {
        return value.toString().split(".")[1].length || 0;
    }
    return 0;
}
function returnMaxDecimals(){
    if (this.axis) {
            return Math.max(...this.axis.paddedTicks.map(d => countDecimals(d)));
    }
    if (this.series){
        return Math.max(...this.series.data.map(d => countDecimals(d.y)));
    }
    return 0;
}
export default function _returnFormatter(format, context, decimals){
    switch (format){
        case 'percentage':
            return function _percentage() {
                var maxDecimals = returnMaxDecimals.call(this);
                var value = this.value !== undefined ? this.value : this.y;
                // TO DO  figure out decimals programmatically
                var rtn = value === 0 ? '0%' : Highcharts.numberFormat(value * 100, decimals !== undefined ? decimals : Math.max(maxDecimals - 2, 0)) + '%';
                return rtn;
            };
        case 'currency':
            return function _currency() {
                var value = this.value !== undefined ? this.value : this.y;
                return '$' + Highcharts.numberFormat(value, 2);
            };
        default:
            return function _default() {
                var maxDecimals = returnMaxDecimals.call(this);
                var value = this.value !== undefined ? this.value : this.y;
                return Highcharts.numberFormat(value, decimals !== undefined ? decimals : maxDecimals);
            };
    }
}