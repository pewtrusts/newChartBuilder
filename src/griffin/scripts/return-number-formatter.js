/* global Highcharts */
export default function _returnFormatter(format){
    switch (format){
        case 'percentage':
            return function () {
                var value = this.value !== undefined ? this.value : this.y;
                var rtn = Highcharts.numberFormat(value * 100, 0) + '%';
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