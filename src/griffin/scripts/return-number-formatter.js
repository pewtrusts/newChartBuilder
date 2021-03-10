/* global Highcharts */
export default function _returnFormatter(format, context){
    switch (format){
        case 'percentage':
            return function () {
                var value = this.value !== undefined ? this.value : this.y;
                // TO DO  figure out decimals programmatically
                var rtn = Highcharts.numberFormat(value * 100, (context == 'tooltip' ? 1 : 0)) + '%';
                return rtn;
            };
        case 'currency':
            return function () {
                var value = this.value !== undefined ? this.value : this.y;
                return '$' + Highcharts.numberFormat(value, 2);
            };
        default:
            return function () {
                var value = this.value !== undefined ? this.value : this.y;
                return Highcharts.numberFormat(value, -1);
            };
    }
}